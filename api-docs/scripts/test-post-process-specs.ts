#!/usr/bin/env node
/**
 * Tests for post-process-specs.ts
 *
 * Standalone test script — no test runner required.
 *
 * Usage:
 *   node api-docs/scripts/dist/test-post-process-specs.js
 *
 * Creates temporary fixtures in $TMPDIR, runs the compiled script against
 * them via child_process, and reports pass/fail for each case.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { spawnSync } from 'child_process';
import * as yaml from 'js-yaml';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const SCRIPT = path.resolve(__dirname, 'post-process-specs.js');

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
  info: { title: string; version: string; [k: string]: unknown };
  servers?: Array<{ url: string; [k: string]: unknown }>;
  tags?: OpenApiTag[];
  paths?: Record<
    string,
    Record<string, { tags?: string[]; [k: string]: unknown }>
  >;
  [key: string]: unknown;
}

function makeSpec(
  tags: OpenApiTag[],
  operationTags: string[],
  overrides?: Partial<OpenApiSpec>
): OpenApiSpec {
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
    ...overrides,
  };
}

function createTmpRoot(segments: string[] = ['influxdb3', 'core']): {
  root: string;
  productDirLabel: string;
  productDir: string;
  specDir: string;
  specPath: string;
  buildSpecPath: string;
} {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'post-process-test-'));
  const productDirLabel = segments.join('/');
  const productDir = path.join(root, ...segments);
  const specDir = path.join(productDir, 'v3');
  const specPath = path.join(specDir, 'openapi.yaml');
  const buildSpecPath = path.join(
    root,
    '_build',
    ...segments,
    'v3',
    'openapi.yaml'
  );

  fs.mkdirSync(specDir, { recursive: true });

  const config = {
    apis: {
      data: {
        root: 'v3/openapi.yaml',
      },
    },
  };
  fs.writeFileSync(path.join(productDir, '.config.yml'), yaml.dump(config));

  return { root, productDirLabel, productDir, specDir, specPath, buildSpecPath };
}

function writeYaml(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, yaml.dump(data, { lineWidth: -1 }), 'utf8');
}

function readYaml<T>(filePath: string): T {
  return yaml.load(fs.readFileSync(filePath, 'utf8')) as T;
}

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
// Tag config tests
// ---------------------------------------------------------------------------

function testDescriptionSetting(): void {
  const { root, specDir, specPath, buildSpecPath } = createTmpRoot();
  try {
    writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data']));
    writeYaml(path.join(specDir, 'tags.yml'), {
      tags: {
        'Write data': { description: 'Write line protocol data to InfluxDB.' },
      },
    });

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('1a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(buildSpecPath);
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

function testTagRename(): void {
  const { root, specDir, specPath, buildSpecPath } = createTmpRoot();
  try {
    writeYaml(specPath, makeSpec([{ name: 'Cache data' }], ['Cache data']));
    writeYaml(path.join(specDir, 'tags.yml'), {
      tags: {
        'Cache data': { rename: 'Cache distinct values' },
      },
    });

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('2a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(buildSpecPath);
    const oldTag = spec.tags?.find((t) => t.name === 'Cache data');
    assert(
      '2b. old tag name gone from tags[]',
      !oldTag,
      'old tag still present in tags[]'
    );

    const newTag = spec.tags?.find((t) => t.name === 'Cache distinct values');
    assert(
      '2c. new tag name in tags[]',
      !!newTag,
      'renamed tag not found in tags[]'
    );

    const opTags =
      (spec.paths?.['/test']?.['get'] as { tags?: string[] })?.tags ?? [];
    assert(
      '2d. operation.tags[] updated',
      opTags.includes('Cache distinct values') &&
        !opTags.includes('Cache data'),
      `operation tags: ${JSON.stringify(opTags)}`
    );
  } finally {
    cleanup(root);
  }
}

function testXRelated(): void {
  const { root, specDir, specPath, buildSpecPath } = createTmpRoot();
  try {
    writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data']));
    writeYaml(path.join(specDir, 'tags.yml'), {
      tags: {
        'Write data': {
          description: 'Write data.',
          'x-related': [
            { title: 'Write data guide', href: '/influxdb3/core/write-data/' },
          ],
        },
      },
    });

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('3a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(buildSpecPath);
    const tag = spec.tags?.find((t) => t.name === 'Write data');
    const related = tag?.['x-related'] as
      | Array<{ title: string; href: string }>
      | undefined;
    assert(
      '3b. x-related present',
      Array.isArray(related) && related.length === 1,
      `x-related: ${JSON.stringify(related)}`
    );
    assert(
      '3c. x-related entry correct',
      related?.[0]?.title === 'Write data guide' &&
        related?.[0]?.href === '/influxdb3/core/write-data/',
      `entry: ${JSON.stringify(related?.[0])}`
    );
  } finally {
    cleanup(root);
  }
}

function testStaleConfigWarning(): void {
  const { root, specDir, specPath } = createTmpRoot();
  try {
    writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data']));
    writeYaml(path.join(specDir, 'tags.yml'), {
      tags: {
        'Write data': { description: 'Write data.' },
        'Ghost tag': { description: 'This tag does not exist in the spec.' },
      },
    });

    const { stderr, exitCode } = runScript(root, 'influxdb3/core');
    assert(
      '4a. exits 0 (warnings are not errors)',
      exitCode === 0,
      `exit code was ${exitCode}`
    );
    assert(
      '4b. stale config warning emitted',
      stderr.includes("config tag 'Ghost tag' not found in spec operations"),
      `stderr: ${stderr}`
    );
  } finally {
    cleanup(root);
  }
}

function testUncoveredTagWarning(): void {
  const { root, specDir, specPath } = createTmpRoot();
  try {
    writeYaml(
      specPath,
      makeSpec(
        [{ name: 'Write data' }, { name: 'Query data' }],
        ['Write data', 'Query data']
      )
    );
    writeYaml(path.join(specDir, 'tags.yml'), {
      tags: {
        'Write data': { description: 'Write data.' },
      },
    });

    const { stderr, exitCode } = runScript(root, 'influxdb3/core');
    assert(
      '5a. exits 0 (warnings are not errors)',
      exitCode === 0,
      `exit code was ${exitCode}`
    );
    assert(
      '5b. uncovered tag warning emitted',
      stderr.includes("spec tag 'Query data' has no config entry in tags.yml"),
      `stderr: ${stderr}`
    );
  } finally {
    cleanup(root);
  }
}

function testNoTagsYmlSilentSkip(): void {
  const { root, specPath } = createTmpRoot();
  try {
    writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data']));

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
    assert(
      '7a. exits 1 on malformed YAML',
      exitCode === 1,
      `exit code was ${exitCode}`
    );
  } finally {
    cleanup(root);
  }
}

// ---------------------------------------------------------------------------
// Content overlay tests
// ---------------------------------------------------------------------------

// 8. Info overlay — API-specific content/info.yml
function testInfoOverlay(): void {
  const { root, specDir, specPath, buildSpecPath } = createTmpRoot();
  try {
    writeYaml(
      specPath,
      makeSpec([], [], {
        info: { title: 'Original Title', version: '0.0.0' },
      })
    );

    // Create API-specific content/info.yml
    const contentDir = path.join(specDir, 'content');
    fs.mkdirSync(contentDir, { recursive: true });
    writeYaml(path.join(contentDir, 'info.yml'), {
      title: 'Overridden Title',
      version: '2.0.0',
      'x-influxdata-short-title': 'Short',
    });

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('8a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(buildSpecPath);
    assert(
      '8b. title overridden',
      spec.info.title === 'Overridden Title',
      `title: ${spec.info.title}`
    );
    assert(
      '8c. version overridden',
      spec.info.version === '2.0.0',
      `version: ${spec.info.version}`
    );
    assert(
      '8d. x-influxdata-short-title applied',
      (spec.info as Record<string, unknown>)['x-influxdata-short-title'] ===
        'Short',
      `x-influxdata-short-title: ${(spec.info as Record<string, unknown>)['x-influxdata-short-title']}`
    );
  } finally {
    cleanup(root);
  }
}

// 9. Info overlay — product-level fallback
function testInfoOverlayProductFallback(): void {
  const { root, productDir, specPath, buildSpecPath } = createTmpRoot();
  try {
    writeYaml(
      specPath,
      makeSpec([], [], {
        info: { title: 'Original', version: '1.0.0' },
      })
    );

    // Create product-level content/info.yml (NOT in specDir/content/)
    const contentDir = path.join(productDir, 'content');
    fs.mkdirSync(contentDir, { recursive: true });
    writeYaml(path.join(contentDir, 'info.yml'), {
      title: 'Product-Level Title',
    });

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('9a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(buildSpecPath);
    assert(
      '9b. title from product-level',
      spec.info.title === 'Product-Level Title',
      `title: ${spec.info.title}`
    );
    assert(
      '9c. version preserved',
      spec.info.version === '1.0.0',
      `version: ${spec.info.version}`
    );
  } finally {
    cleanup(root);
  }
}

// 10. Servers overlay
function testServersOverlay(): void {
  const { root, specDir, specPath, buildSpecPath } = createTmpRoot();
  try {
    writeYaml(
      specPath,
      makeSpec([], [], {
        servers: [{ url: 'https://old.example.com' }],
      })
    );

    const contentDir = path.join(specDir, 'content');
    fs.mkdirSync(contentDir, { recursive: true });
    writeYaml(path.join(contentDir, 'servers.yml'), [
      {
        url: 'https://{baseurl}',
        description: 'InfluxDB API',
        variables: {
          baseurl: {
            enum: ['localhost:8181'],
            default: 'localhost:8181',
            description: 'InfluxDB URL',
          },
        },
      },
    ]);

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('10a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(buildSpecPath);
    assert(
      '10b. servers replaced',
      spec.servers?.length === 1,
      `server count: ${spec.servers?.length}`
    );
    assert(
      '10c. server URL correct',
      spec.servers?.[0]?.url === 'https://{baseurl}',
      `url: ${spec.servers?.[0]?.url}`
    );
    assert(
      '10d. server variables present',
      (spec.servers?.[0] as Record<string, unknown>)?.variables !== undefined,
      'variables missing'
    );
  } finally {
    cleanup(root);
  }
}

// 11. Info overlay preserves fields not in overlay
function testInfoOverlayPreservesFields(): void {
  const { root, specDir, specPath, buildSpecPath } = createTmpRoot();
  try {
    writeYaml(
      specPath,
      makeSpec([], [], {
        info: {
          title: 'Original Title',
          version: '3.0.0',
          description: 'Original description.',
          license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
        },
      })
    );

    const contentDir = path.join(specDir, 'content');
    fs.mkdirSync(contentDir, { recursive: true });
    // Overlay only sets x-* fields, no title/version/description
    writeYaml(path.join(contentDir, 'info.yml'), {
      'x-influxdata-short-title': 'InfluxDB 3 API',
    });

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('11a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(buildSpecPath);
    assert(
      '11b. title preserved',
      spec.info.title === 'Original Title',
      `title: ${spec.info.title}`
    );
    assert(
      '11c. version preserved',
      spec.info.version === '3.0.0',
      `version: ${spec.info.version}`
    );
    assert(
      '11d. description preserved',
      spec.info.description === 'Original description.',
      `desc: ${spec.info.description}`
    );
    assert(
      '11e. x-influxdata-short-title added',
      (spec.info as Record<string, unknown>)['x-influxdata-short-title'] ===
        'InfluxDB 3 API',
      'x-influxdata-short-title missing'
    );
  } finally {
    cleanup(root);
  }
}

// 12. No content overlays — spec unchanged
function testNoOverlaysNoWrite(): void {
  const { root, specPath, buildSpecPath } = createTmpRoot();
  try {
    const original = makeSpec([{ name: 'Write data' }], ['Write data']);
    writeYaml(specPath, original);
    const mtime = fs.statSync(specPath).mtimeMs;

    // Small delay to detect mtime changes
    const start = Date.now();
    while (Date.now() - start < 50) {
      /* busy wait */
    }

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('12a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const built = readYaml<OpenApiSpec>(buildSpecPath);
    assert(
      '12b. build output matches input when no overlays/tags',
      JSON.stringify(built) === JSON.stringify(original),
      'build output differed from source'
    );
    assert(
      '12c. source file untouched',
      fs.statSync(specPath).mtimeMs === mtime,
      'source spec modified'
    );
  } finally {
    cleanup(root);
  }
}

// 13. Combined: info + servers + tags applied together
function testCombinedOverlaysAndTags(): void {
  const { root, specDir, specPath, buildSpecPath } = createTmpRoot();
  try {
    writeYaml(
      specPath,
      makeSpec([{ name: 'Write data' }], ['Write data'], {
        info: { title: 'Original', version: '1.0.0' },
        servers: [{ url: 'https://old.example.com' }],
      })
    );

    const contentDir = path.join(specDir, 'content');
    fs.mkdirSync(contentDir, { recursive: true });
    writeYaml(path.join(contentDir, 'info.yml'), {
      title: 'New Title',
      'x-influxdata-short-title': 'Short',
    });
    writeYaml(path.join(contentDir, 'servers.yml'), [
      { url: 'https://new.example.com', description: 'New Server' },
    ]);
    writeYaml(path.join(specDir, 'tags.yml'), {
      tags: {
        'Write data': {
          description: 'Write line protocol data.',
          'x-related': [{ title: 'Guide', href: '/guide/' }],
        },
      },
    });

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('13a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(buildSpecPath);
    assert(
      '13b. info title updated',
      spec.info.title === 'New Title',
      `title: ${spec.info.title}`
    );
    assert(
      '13c. info version preserved',
      spec.info.version === '1.0.0',
      `version: ${spec.info.version}`
    );
    assert(
      '13d. x-influxdata-short-title set',
      (spec.info as Record<string, unknown>)['x-influxdata-short-title'] ===
        'Short',
      'missing'
    );
    assert(
      '13e. servers replaced',
      spec.servers?.[0]?.url === 'https://new.example.com',
      `url: ${spec.servers?.[0]?.url}`
    );

    const tag = spec.tags?.find((t) => t.name === 'Write data');
    assert(
      '13f. tag description set',
      tag?.description === 'Write line protocol data.',
      `desc: ${tag?.description}`
    );
    assert(
      '13g. tag x-related set',
      Array.isArray(tag?.['x-related']) && tag['x-related'].length === 1,
      `x-related: ${JSON.stringify(tag?.['x-related'])}`
    );
  } finally {
    cleanup(root);
  }
}

// 14. Mirror-product transforms — version prefix, trailing slash, empty
// servers, and doc-link rewriting, applied only to MIRROR_PRODUCT_PATHS.
function testMirrorProductTransforms(): void {
  const { root, productDirLabel, specPath, buildSpecPath } = createTmpRoot([
    'influxdb',
    'v2',
  ]);
  try {
    writeYaml(
      specPath,
      makeSpec([{ name: 'Write data' }], ['Write data'], {
        paths: {
          '/api/v2/health': {
            get: {
              operationId: 'getHealth',
              tags: ['Write data'],
              description:
                'See [buckets](/influxdb/latest/reference/glossary/#bucket) and ' +
                'https://docs.influxdata.com/influxdb/latest/security/tokens/.',
              responses: {},
              servers: [{ url: '' }, { url: 'https://kept.example.com' }],
            },
          },
          '/api/v2/write/': {
            get: { operationId: 'writeData', tags: ['Write data'], responses: {} },
          },
          '/api/v2/internal/private/debug': {
            get: { operationId: 'privateDebug', tags: [], responses: {} },
          },
        },
      })
    );

    const { exitCode } = runScript(root, productDirLabel);
    assert('14a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(buildSpecPath);
    const paths = spec.paths ?? {};

    assert(
      '14b. version prefix stripped from /health',
      '/health' in paths && !('/api/v2/health' in paths),
      `paths: ${Object.keys(paths).join(', ')}`
    );
    assert(
      '14c. trailing slash stripped from /write',
      '/api/v2/write' in paths && !('/api/v2/write/' in paths),
      `paths: ${Object.keys(paths).join(', ')}`
    );
    assert(
      '14d. private path removed',
      !('/api/v2/internal/private/debug' in paths),
      `paths: ${Object.keys(paths).join(', ')}`
    );

    const health = paths['/health']?.['get'] as {
      description?: string;
      servers?: Array<{ url: string }>;
    };
    assert(
      '14e. empty-url server removed, other server kept',
      health.servers?.length === 1 &&
        health.servers[0]?.url === 'https://kept.example.com',
      `servers: ${JSON.stringify(health.servers)}`
    );
    assert(
      '14f. relative /latest/ link rewritten to product path',
      !!health.description?.includes('/influxdb/v2/reference/glossary/#bucket'),
      `description: ${health.description}`
    );
    assert(
      '14g. absolute docs.influxdata.com/latest/ link rewritten',
      !!health.description?.includes('/influxdb/v2/security/tokens/') &&
        !health.description?.includes('docs.influxdata.com'),
      `description: ${health.description}`
    );
  } finally {
    cleanup(root);
  }
}

// 15. Non-mirror products are unaffected by mirror transforms.
function testNonMirrorProductUnaffected(): void {
  const { root, specPath, buildSpecPath } = createTmpRoot(['influxdb3', 'core']);
  try {
    writeYaml(
      specPath,
      makeSpec([{ name: 'Write data' }], ['Write data'], {
        paths: {
          '/api/v2/health': {
            get: {
              operationId: 'getHealth',
              tags: ['Write data'],
              description: 'See /influxdb/latest/reference/glossary/#bucket.',
              responses: {},
            },
          },
        },
      })
    );

    const { exitCode } = runScript(root, 'influxdb3/core');
    assert('15a. exits 0', exitCode === 0, `exit code was ${exitCode}`);

    const spec = readYaml<OpenApiSpec>(buildSpecPath);
    const paths = spec.paths ?? {};
    assert(
      '15b. version prefix left untouched',
      '/api/v2/health' in paths,
      `paths: ${Object.keys(paths).join(', ')}`
    );
    const health = paths['/api/v2/health']?.['get'] as {
      description?: string;
    };
    assert(
      '15c. doc link left untouched',
      health.description === 'See /influxdb/latest/reference/glossary/#bucket.',
      `description: ${health.description}`
    );
  } finally {
    cleanup(root);
  }
}

// ---------------------------------------------------------------------------
// Run all tests
// ---------------------------------------------------------------------------

const tests: Array<[string, () => void]> = [
  // Tag config tests (carried forward)
  ['1. Tag description setting', testDescriptionSetting],
  ['2. Tag rename (tags[] and operation.tags[])', testTagRename],
  ['3. x-related links', testXRelated],
  ['4. Warning: stale config reference', testStaleConfigWarning],
  ['5. Warning: uncovered spec tag', testUncoveredTagWarning],
  ['6. No tags.yml — silent skip', testNoTagsYmlSilentSkip],
  ['7. Malformed YAML — exit 1', testMalformedYamlFails],
  // Content overlay tests (new)
  ['8. Info overlay — API-specific', testInfoOverlay],
  ['9. Info overlay — product-level fallback', testInfoOverlayProductFallback],
  ['10. Servers overlay', testServersOverlay],
  [
    '11. Info overlay preserves fields not in overlay',
    testInfoOverlayPreservesFields,
  ],
  ['12. No overlays or tags — build mirrors source', testNoOverlaysNoWrite],
  ['13. Combined: info + servers + tags', testCombinedOverlaysAndTags],
  ['14. Mirror-product presentation transforms', testMirrorProductTransforms],
  ['15. Non-mirror product unaffected', testNonMirrorProductUnaffected],
];

console.log('\npost-process-specs tests\n');

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
