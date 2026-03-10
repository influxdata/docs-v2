#!/usr/bin/env node
/**
 * Tests for apply-tag-config.ts
 *
 * Standalone test script — no test runner required.
 *
 * Usage:
 *   node api-docs/scripts/dist/test-apply-tag-config.js
 *
 * Creates temporary fixtures in $TMPDIR, runs the compiled script against
 * them via child_process, and reports pass/fail for each case.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync, spawnSync } from 'child_process';
import * as yaml from 'js-yaml';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const SCRIPT = path.resolve(__dirname, 'apply-tag-config.js');

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

interface OpenApiTag {
  name: string;
  description?: string;
  'x-related'?: Array<{ title: string; href: string }>;
  [key: string]: unknown;
}

interface OpenApiSpec {
  openapi: string;
  info: { title: string; version: string };
  tags?: OpenApiTag[];
  paths?: Record<string, Record<string, { tags?: string[]; [k: string]: unknown }>>;
  [key: string]: unknown;
}

/**
 * Build a minimal OpenAPI spec object.
 *
 * @param tags - Top-level tag definitions.
 * @param operationTags - Tag names to attach to a synthetic GET /test operation.
 */
function makeSpec(tags: OpenApiTag[], operationTags: string[]): OpenApiSpec {
  return {
    openapi: '3.0.0',
    info: { title: 'Test', version: '1.0.0' },
    tags,
    paths: {
      '/test': {
        get: {
          operationId: 'testOp',
          tags: operationTags,
          responses: {},
        },
      },
    },
  };
}

/**
 * Create a temporary api-docs root with a single product configured.
 *
 * Returns the root path and a helper to write the tags.yml file.
 */
function createTmpRoot(): { root: string; productDir: string; specDir: string; specPath: string } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apply-tag-test-'));
  const productDir = path.join(root, 'influxdb3', 'core');
  const specDir = path.join(productDir, 'v3');
  const specPath = path.join(specDir, 'openapi.yaml');

  fs.mkdirSync(specDir, { recursive: true });

  // Write .config.yml — apis.data.root points to v3/openapi.yaml
  const config = {
    apis: {
      data: {
        root: 'v3/openapi.yaml',
      },
    },
  };
  fs.writeFileSync(path.join(productDir, '.config.yml'), yaml.dump(config));

  return { root, productDir, specDir, specPath };
}

/**
 * Write a YAML file from a plain object.
 */
function writeYaml(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, yaml.dump(data, { lineWidth: -1 }), 'utf8');
}

/**
 * Read and parse a YAML file.
 */
function readYaml<T>(filePath: string): T {
  return yaml.load(fs.readFileSync(filePath, 'utf8')) as T;
}

/**
 * Run the compiled script with the given root and optional product filter.
 * Returns { stdout, stderr, exitCode }.
 */
function runScript(
  root: string,
  productFilter?: string
): { stdout: string; stderr: string; exitCode: number } {
  const scriptArgs = ['--root', root];
  if (productFilter) scriptArgs.push(productFilter);

  const result = spawnSync('node', [SCRIPT, ...scriptArgs], {
    encoding: 'utf8',
    timeout: 10_000,
  });

  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    exitCode: result.status ?? 1,
  };
}

/**
 * Remove a temporary directory created by createTmpRoot().
 */
function cleanup(root: string): void {
  fs.rmSync(root, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;
const failures: string[] = [];

function pass(name: string): void {
  console.log(`  PASS  ${name}`);
  passed++;
}

function fail(name: string, reason: string): void {
  console.log(`  FAIL  ${name}`);
  console.log(`        ${reason}`);
  failed++;
  failures.push(`${name}: ${reason}`);
}

function assert(name: string, condition: boolean, reason: string): void {
  if (condition) {
    pass(name);
  } else {
    fail(name, reason);
  }
}

// ---------------------------------------------------------------------------
// Test cases
// ---------------------------------------------------------------------------

// 1. Tag description setting
function testDescriptionSetting(): void {
  const { root, specDir, specPath } = createTmpRoot();
  try {
    writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data']));
    writeYaml(path.join(specDir, 'tags.yml'), {
      tags: {
        'Write data': { description: 'Write line protocol data to InfluxDB.' },
      },
    });

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('1a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(specPath);
    const tag = spec.tags?.find((t) => t.name === 'Write data');
    assert(
      '1b. description applied to tag',
      tag?.description === 'Write line protocol data to InfluxDB.',
      `description was: ${tag?.description}`
    );
  } finally {
    cleanup(root);
  }
}

// 2. Tag rename — tags[] and operation.tags[]
function testTagRename(): void {
  const { root, specDir, specPath } = createTmpRoot();
  try {
    writeYaml(specPath, makeSpec([{ name: 'Cache data' }], ['Cache data']));
    writeYaml(path.join(specDir, 'tags.yml'), {
      tags: {
        'Cache data': { rename: 'Cache distinct values' },
      },
    });

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('2a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(specPath);

    const oldTag = spec.tags?.find((t) => t.name === 'Cache data');
    assert('2b. old tag name gone from tags[]', !oldTag, 'old tag still present in tags[]');

    const newTag = spec.tags?.find((t) => t.name === 'Cache distinct values');
    assert('2c. new tag name in tags[]', !!newTag, 'renamed tag not found in tags[]');

    const opTags = (spec.paths?.['/test']?.['get'] as { tags?: string[] })?.tags ?? [];
    assert(
      '2d. operation.tags[] updated',
      opTags.includes('Cache distinct values') && !opTags.includes('Cache data'),
      `operation tags: ${JSON.stringify(opTags)}`
    );
  } finally {
    cleanup(root);
  }
}

// 3. x-related links
function testXRelated(): void {
  const { root, specDir, specPath } = createTmpRoot();
  try {
    writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data']));
    writeYaml(path.join(specDir, 'tags.yml'), {
      tags: {
        'Write data': {
          description: 'Write data.',
          'x-related': [{ title: 'Write data guide', href: '/influxdb3/core/write-data/' }],
        },
      },
    });

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('3a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(specPath);
    const tag = spec.tags?.find((t) => t.name === 'Write data');
    const related = tag?.['x-related'] as Array<{ title: string; href: string }> | undefined;
    assert('3b. x-related present', Array.isArray(related) && related.length === 1, `x-related: ${JSON.stringify(related)}`);
    assert(
      '3c. x-related entry correct',
      related?.[0]?.title === 'Write data guide' && related?.[0]?.href === '/influxdb3/core/write-data/',
      `entry: ${JSON.stringify(related?.[0])}`
    );
  } finally {
    cleanup(root);
  }
}

// 4. Warning: stale config reference (tag in tags.yml not in spec operations)
function testStaleConfigWarning(): void {
  const { root, specDir, specPath } = createTmpRoot();
  try {
    // Spec has 'Write data' in operations but tags.yml mentions 'Ghost tag'
    writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data']));
    writeYaml(path.join(specDir, 'tags.yml'), {
      tags: {
        'Write data': { description: 'Write data.' },
        'Ghost tag': { description: 'This tag does not exist in the spec.' },
      },
    });

    const { stderr, exitCode } = runScript(root, 'influxdb3/core');
    assert('4a. exits 0 (warnings are not errors)', exitCode === 0, `exit code was ${exitCode}`);
    assert(
      '4b. stale config warning emitted',
      stderr.includes("config tag 'Ghost tag' not found in spec operations"),
      `stderr: ${stderr}`
    );
  } finally {
    cleanup(root);
  }
}

// 5. Warning: uncovered spec tag (tag in spec operations but not in tags.yml)
function testUncoveredTagWarning(): void {
  const { root, specDir, specPath } = createTmpRoot();
  try {
    // Spec has 'Write data' and 'Query data'; tags.yml only covers 'Write data'
    writeYaml(
      specPath,
      makeSpec([{ name: 'Write data' }, { name: 'Query data' }], ['Write data', 'Query data'])
    );
    writeYaml(path.join(specDir, 'tags.yml'), {
      tags: {
        'Write data': { description: 'Write data.' },
      },
    });

    const { stderr, exitCode } = runScript(root, 'influxdb3/core');
    assert('5a. exits 0 (warnings are not errors)', exitCode === 0, `exit code was ${exitCode}`);
    assert(
      '5b. uncovered tag warning emitted',
      stderr.includes("spec tag 'Query data' has no config entry in tags.yml"),
      `stderr: ${stderr}`
    );
  } finally {
    cleanup(root);
  }
}

// 6. No tags.yml — silent skip, exit 0
function testNoTagsYmlSilentSkip(): void {
  const { root, specPath } = createTmpRoot();
  try {
    writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data']));
    // Deliberately do NOT create tags.yml

    const { stderr, exitCode } = runScript(root, 'influxdb3/core');
    assert('6a. exits 0', exitCode === 0, `exit code was ${exitCode}`);
    assert(
      '6b. no error output',
      !stderr.includes('ERROR'),
      `unexpected error in stderr: ${stderr}`
    );
  } finally {
    cleanup(root);
  }
}

// 7. Malformed YAML — exit 1
function testMalformedYamlFails(): void {
  const { root, specDir, specPath } = createTmpRoot();
  try {
    writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data']));
    fs.writeFileSync(
      path.join(specDir, 'tags.yml'),
      'tags:\n  Write data:\n    description: [\n  bad yaml here',
      'utf8'
    );

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('7a. exits 1 on malformed YAML', exitCode === 1, `exit code was ${exitCode}`);
  } finally {
    cleanup(root);
  }
}

// ---------------------------------------------------------------------------
// Run all tests
// ---------------------------------------------------------------------------

const tests: Array<[string, () => void]> = [
  ['1. Tag description setting', testDescriptionSetting],
  ['2. Tag rename (tags[] and operation.tags[])', testTagRename],
  ['3. x-related links', testXRelated],
  ['4. Warning: stale config reference', testStaleConfigWarning],
  ['5. Warning: uncovered spec tag', testUncoveredTagWarning],
  ['6. No tags.yml — silent skip', testNoTagsYmlSilentSkip],
  ['7. Malformed YAML — exit 1', testMalformedYamlFails],
];

console.log('\napply-tag-config tests\n');

for (const [name, fn] of tests) {
  console.log(name);
  try {
    fn();
  } catch (err) {
    fail(name, `threw: ${(err as Error).message}`);
  }
}

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);

if (failures.length > 0) {
  console.log('\nFailed:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
