#!/usr/bin/env node
"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const child_process_1 = require("child_process");
const yaml = __importStar(require("js-yaml"));
// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const SCRIPT = path.resolve(__dirname, 'post-process-specs.js');
function makeSpec(tags, operationTags, overrides) {
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
function createTmpRoot() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'post-process-test-'));
    const productDir = path.join(root, 'influxdb3', 'core');
    const specDir = path.join(productDir, 'v3');
    const specPath = path.join(specDir, 'openapi.yaml');
    const buildSpecPath = path.join(root, '_build', 'influxdb3', 'core', 'v3', 'openapi.yaml');
    fs.mkdirSync(specDir, { recursive: true });
    const config = {
        apis: {
            data: {
                root: 'v3/openapi.yaml',
            },
        },
    };
    fs.writeFileSync(path.join(productDir, '.config.yml'), yaml.dump(config));
    return { root, productDir, specDir, specPath, buildSpecPath };
}
function writeYaml(filePath, data) {
    fs.writeFileSync(filePath, yaml.dump(data, { lineWidth: -1 }), 'utf8');
}
function readYaml(filePath) {
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
}
function runScript(root, productFilter) {
    const scriptArgs = ['--root', root];
    if (productFilter)
        scriptArgs.push(productFilter);
    const result = (0, child_process_1.spawnSync)('node', [SCRIPT, ...scriptArgs], {
        encoding: 'utf8',
        timeout: 10_000,
    });
    return {
        stdout: result.stdout ?? '',
        stderr: result.stderr ?? '',
        exitCode: result.status ?? 1,
    };
}
function cleanup(root) {
    fs.rmSync(root, { recursive: true, force: true });
}
// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------
let passed = 0;
let failed = 0;
const failures = [];
function pass(name) {
    console.log(`  PASS  ${name}`);
    passed++;
}
function fail(name, reason) {
    console.log(`  FAIL  ${name}`);
    console.log(`        ${reason}`);
    failed++;
    failures.push(`${name}: ${reason}`);
}
function assert(name, condition, reason) {
    if (condition) {
        pass(name);
    }
    else {
        fail(name, reason);
    }
}
// ---------------------------------------------------------------------------
// Tag config tests
// ---------------------------------------------------------------------------
function testDescriptionSetting() {
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
        const spec = readYaml(buildSpecPath);
        const tag = spec.tags?.find((t) => t.name === 'Write data');
        assert('1b. description applied to tag', tag?.description === 'Write line protocol data to InfluxDB.', `description was: ${tag?.description}`);
    }
    finally {
        cleanup(root);
    }
}
function testTagRename() {
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
        const spec = readYaml(buildSpecPath);
        const oldTag = spec.tags?.find((t) => t.name === 'Cache data');
        assert('2b. old tag name gone from tags[]', !oldTag, 'old tag still present in tags[]');
        const newTag = spec.tags?.find((t) => t.name === 'Cache distinct values');
        assert('2c. new tag name in tags[]', !!newTag, 'renamed tag not found in tags[]');
        const opTags = spec.paths?.['/test']?.['get']?.tags ?? [];
        assert('2d. operation.tags[] updated', opTags.includes('Cache distinct values') &&
            !opTags.includes('Cache data'), `operation tags: ${JSON.stringify(opTags)}`);
    }
    finally {
        cleanup(root);
    }
}
function testXRelated() {
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
        const spec = readYaml(buildSpecPath);
        const tag = spec.tags?.find((t) => t.name === 'Write data');
        const related = tag?.['x-related'];
        assert('3b. x-related present', Array.isArray(related) && related.length === 1, `x-related: ${JSON.stringify(related)}`);
        assert('3c. x-related entry correct', related?.[0]?.title === 'Write data guide' &&
            related?.[0]?.href === '/influxdb3/core/write-data/', `entry: ${JSON.stringify(related?.[0])}`);
    }
    finally {
        cleanup(root);
    }
}
function testStaleConfigWarning() {
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
        assert('4a. exits 0 (warnings are not errors)', exitCode === 0, `exit code was ${exitCode}`);
        assert('4b. stale config warning emitted', stderr.includes("config tag 'Ghost tag' not found in spec operations"), `stderr: ${stderr}`);
    }
    finally {
        cleanup(root);
    }
}
function testUncoveredTagWarning() {
    const { root, specDir, specPath } = createTmpRoot();
    try {
        writeYaml(specPath, makeSpec([{ name: 'Write data' }, { name: 'Query data' }], ['Write data', 'Query data']));
        writeYaml(path.join(specDir, 'tags.yml'), {
            tags: {
                'Write data': { description: 'Write data.' },
            },
        });
        const { stderr, exitCode } = runScript(root, 'influxdb3/core');
        assert('5a. exits 0 (warnings are not errors)', exitCode === 0, `exit code was ${exitCode}`);
        assert('5b. uncovered tag warning emitted', stderr.includes("spec tag 'Query data' has no config entry in tags.yml"), `stderr: ${stderr}`);
    }
    finally {
        cleanup(root);
    }
}
function testNoTagsYmlSilentSkip() {
    const { root, specPath } = createTmpRoot();
    try {
        writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data']));
        const { stderr, exitCode } = runScript(root, 'influxdb3/core');
        assert('6a. exits 0', exitCode === 0, `exit code was ${exitCode}`);
        assert('6b. no error output', !stderr.includes('ERROR'), `unexpected error in stderr: ${stderr}`);
    }
    finally {
        cleanup(root);
    }
}
function testMalformedYamlFails() {
    const { root, specDir, specPath } = createTmpRoot();
    try {
        writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data']));
        fs.writeFileSync(path.join(specDir, 'tags.yml'), 'tags:\n  Write data:\n    description: [\n  bad yaml here', 'utf8');
        const { exitCode } = runScript(root, 'influxdb3/core');
        assert('7a. exits 1 on malformed YAML', exitCode === 1, `exit code was ${exitCode}`);
    }
    finally {
        cleanup(root);
    }
}
// ---------------------------------------------------------------------------
// Content overlay tests
// ---------------------------------------------------------------------------
// 8. Info overlay — API-specific content/info.yml
function testInfoOverlay() {
    const { root, specDir, specPath, buildSpecPath } = createTmpRoot();
    try {
        writeYaml(specPath, makeSpec([], [], {
            info: { title: 'Original Title', version: '0.0.0' },
        }));
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
        const spec = readYaml(buildSpecPath);
        assert('8b. title overridden', spec.info.title === 'Overridden Title', `title: ${spec.info.title}`);
        assert('8c. version overridden', spec.info.version === '2.0.0', `version: ${spec.info.version}`);
        assert('8d. x-influxdata-short-title applied', spec.info['x-influxdata-short-title'] ===
            'Short', `x-influxdata-short-title: ${spec.info['x-influxdata-short-title']}`);
    }
    finally {
        cleanup(root);
    }
}
// 9. Info overlay — product-level fallback
function testInfoOverlayProductFallback() {
    const { root, productDir, specPath, buildSpecPath } = createTmpRoot();
    try {
        writeYaml(specPath, makeSpec([], [], {
            info: { title: 'Original', version: '1.0.0' },
        }));
        // Create product-level content/info.yml (NOT in specDir/content/)
        const contentDir = path.join(productDir, 'content');
        fs.mkdirSync(contentDir, { recursive: true });
        writeYaml(path.join(contentDir, 'info.yml'), {
            title: 'Product-Level Title',
        });
        const { exitCode } = runScript(root, 'influxdb3/core');
        assert('9a. exits 0', exitCode === 0, `exit code was ${exitCode}`);
        const spec = readYaml(buildSpecPath);
        assert('9b. title from product-level', spec.info.title === 'Product-Level Title', `title: ${spec.info.title}`);
        assert('9c. version preserved', spec.info.version === '1.0.0', `version: ${spec.info.version}`);
    }
    finally {
        cleanup(root);
    }
}
// 10. Servers overlay
function testServersOverlay() {
    const { root, specDir, specPath, buildSpecPath } = createTmpRoot();
    try {
        writeYaml(specPath, makeSpec([], [], {
            servers: [{ url: 'https://old.example.com' }],
        }));
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
        const spec = readYaml(buildSpecPath);
        assert('10b. servers replaced', spec.servers?.length === 1, `server count: ${spec.servers?.length}`);
        assert('10c. server URL correct', spec.servers?.[0]?.url === 'https://{baseurl}', `url: ${spec.servers?.[0]?.url}`);
        assert('10d. server variables present', spec.servers?.[0]?.variables !== undefined, 'variables missing');
    }
    finally {
        cleanup(root);
    }
}
// 11. Info overlay preserves fields not in overlay
function testInfoOverlayPreservesFields() {
    const { root, specDir, specPath, buildSpecPath } = createTmpRoot();
    try {
        writeYaml(specPath, makeSpec([], [], {
            info: {
                title: 'Original Title',
                version: '3.0.0',
                description: 'Original description.',
                license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
            },
        }));
        const contentDir = path.join(specDir, 'content');
        fs.mkdirSync(contentDir, { recursive: true });
        // Overlay only sets x-* fields, no title/version/description
        writeYaml(path.join(contentDir, 'info.yml'), {
            'x-influxdata-short-title': 'InfluxDB 3 API',
        });
        const { exitCode } = runScript(root, 'influxdb3/core');
        assert('11a. exits 0', exitCode === 0, `exit code was ${exitCode}`);
        const spec = readYaml(buildSpecPath);
        assert('11b. title preserved', spec.info.title === 'Original Title', `title: ${spec.info.title}`);
        assert('11c. version preserved', spec.info.version === '3.0.0', `version: ${spec.info.version}`);
        assert('11d. description preserved', spec.info.description === 'Original description.', `desc: ${spec.info.description}`);
        assert('11e. x-influxdata-short-title added', spec.info['x-influxdata-short-title'] ===
            'InfluxDB 3 API', 'x-influxdata-short-title missing');
    }
    finally {
        cleanup(root);
    }
}
// 12. No content overlays — spec unchanged
function testNoOverlaysNoWrite() {
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
        const built = readYaml(buildSpecPath);
        assert('12b. build output matches input when no overlays/tags', JSON.stringify(built) === JSON.stringify(original), 'build output differed from source');
        assert('12c. source file untouched', fs.statSync(specPath).mtimeMs === mtime, 'source spec modified');
    }
    finally {
        cleanup(root);
    }
}
// 13. Combined: info + servers + tags applied together
function testCombinedOverlaysAndTags() {
    const { root, specDir, specPath, buildSpecPath } = createTmpRoot();
    try {
        writeYaml(specPath, makeSpec([{ name: 'Write data' }], ['Write data'], {
            info: { title: 'Original', version: '1.0.0' },
            servers: [{ url: 'https://old.example.com' }],
        }));
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
        const spec = readYaml(buildSpecPath);
        assert('13b. info title updated', spec.info.title === 'New Title', `title: ${spec.info.title}`);
        assert('13c. info version preserved', spec.info.version === '1.0.0', `version: ${spec.info.version}`);
        assert('13d. x-influxdata-short-title set', spec.info['x-influxdata-short-title'] ===
            'Short', 'missing');
        assert('13e. servers replaced', spec.servers?.[0]?.url === 'https://new.example.com', `url: ${spec.servers?.[0]?.url}`);
        const tag = spec.tags?.find((t) => t.name === 'Write data');
        assert('13f. tag description set', tag?.description === 'Write line protocol data.', `desc: ${tag?.description}`);
        assert('13g. tag x-related set', Array.isArray(tag?.['x-related']) && tag['x-related'].length === 1, `x-related: ${JSON.stringify(tag?.['x-related'])}`);
    }
    finally {
        cleanup(root);
    }
}
// ---------------------------------------------------------------------------
// Run all tests
// ---------------------------------------------------------------------------
const tests = [
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
];
console.log('\npost-process-specs tests\n');
for (const [name, fn] of tests) {
    console.log(name);
    try {
        fn();
    }
    catch (err) {
        fail(name, `threw: ${err.message}`);
    }
}
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failures.length > 0) {
    console.log('\nFailed:');
    for (const f of failures)
        console.log(`  - ${f}`);
    process.exit(1);
}
//# sourceMappingURL=test-post-process-specs.js.map