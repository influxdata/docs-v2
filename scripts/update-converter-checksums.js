#!/usr/bin/env node
/**
 * Refresh the committed checksum manifest for the Rust markdown converter.
 *
 * Run this after a converter version bump has been released, so that
 * scripts/build-rust-converter.js can verify downloads again. Until it runs,
 * installs fall back to building from source.
 *
 * Usage:
 *   node scripts/update-converter-checksums.js [version]
 *   node scripts/update-converter-checksums.js [version] --from-file <path>
 *
 * The version defaults to the "version" field in
 * scripts/rust-markdown-converter/package.json, prefixed with "v". Without
 * --from-file the checksums come from the published release; the release
 * workflow passes the manifest it just generated so it needs no network.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const pkgDir = path.resolve('scripts/rust-markdown-converter');
const checksumPath = path.join(pkgDir, 'checksums.txt');

const packageVersion = JSON.parse(
  readFileSync(path.join(pkgDir, 'package.json'), 'utf8')
).version;
const args = process.argv.slice(2);
const fromFileIndex = args.indexOf('--from-file');
const fromFile = fromFileIndex === -1 ? null : args[fromFileIndex + 1];
const positional = args.filter(
  (arg, index) =>
    index !== fromFileIndex &&
    index !== fromFileIndex + 1 &&
    !arg.startsWith('--')
);
const version = positional[0] ?? `v${packageVersion}`;

if (fromFileIndex !== -1 && !fromFile) {
  console.error('✗ --from-file requires a path');
  process.exit(1);
}

const releaseUrl =
  'https://github.com/influxdata/docs-v2/releases/download/' +
  `rust-markdown-converter-${version}/checksums.txt`;
const source = fromFile ?? releaseUrl;

let published;
if (fromFile) {
  console.log(`Reading checksums for ${version} from ${fromFile}...`);
  published = readFileSync(fromFile, 'utf8');
} else {
  console.log(`Fetching checksums for ${version}...`);
  published = execFileSync(
    'curl',
    [
      '--fail',
      '--location',
      '--silent',
      '--show-error',
      '--connect-timeout',
      '10',
      '--max-time',
      '60',
      releaseUrl,
    ],
    { encoding: 'utf8' }
  );
}

const entries = published
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

if (entries.length === 0) {
  console.error(`✗ No checksums found at ${source}`);
  process.exit(1);
}

for (const entry of entries) {
  if (!/^[0-9a-f]{64}\s{2,}\S+$/.test(entry)) {
    console.error(`✗ Unexpected checksum line: ${entry}`);
    process.exit(1);
  }
}

// Preserve the explanatory header; only the version marker and the checksum
// lines change, so a bump shows up as a small, reviewable diff.
const existing = readFileSync(checksumPath, 'utf8');
const header = existing
  .split('\n')
  .filter((line) => line.startsWith('#'))
  .map((line) => line.replace(/^#\s*version:\s*\S+$/, `# version: ${version}`))
  .join('\n');

writeFileSync(checksumPath, `${header}\n${entries.join('\n')}\n`);

console.log(`✓ Wrote ${entries.length} checksums for ${version} to`);
console.log(`  ${path.relative(process.cwd(), checksumPath)}`);
console.log('  Review the diff and commit it.');
