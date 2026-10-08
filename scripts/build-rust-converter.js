#!/usr/bin/env node
/**
 * Build the Rust markdown converter napi module when a Rust toolchain is
 * present. Skips with a clear message otherwise so `yarn install` never fails
 * on machines without Rust. CI builds it explicitly (see .circleci/config.yml).
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import {
  existsSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const pkgDir = path.resolve('scripts/rust-markdown-converter');
const require = createRequire(import.meta.url);
const packageVersion = JSON.parse(
  readFileSync(path.join(pkgDir, 'package.json'), 'utf8')
).version;
const prebuiltVersion = `v${packageVersion}`;
const prebuiltVersionPath = path.join(pkgDir, '.prebuilt-version');

function nativeAsset() {
  if (process.platform === 'darwin' && process.arch === 'arm64') {
    return {
      asset: 'rust-markdown-converter-darwin-arm64.node',
      output: 'index.darwin-arm64.node',
    };
  }

  if (process.platform === 'linux' && process.arch === 'x64') {
    const report = process.report?.getReport();
    if (report?.header?.glibcVersionRuntime) {
      return {
        asset: 'rust-markdown-converter-linux-x86_64-gnu.node',
        output: 'index.linux-x64-gnu.node',
      };
    }
  }
}

function usePrebuilt() {
  try {
    require(pkgDir);
    console.log('✓ Using prebuilt Rust markdown converter');
    return true;
  } catch (error) {
    console.warn(
      `⚠ Prebuilt Rust markdown converter could not load; rebuilding it: ${error.message}`
    );
    return false;
  }
}

function downloadPrebuilt() {
  const target = nativeAsset();
  if (!target) {
    return false;
  }

  if (
    existsSync(prebuiltVersionPath) &&
    readFileSync(prebuiltVersionPath, 'utf8').trim() === prebuiltVersion &&
    usePrebuilt()
  ) {
    return true;
  }

  const release = `rust-markdown-converter-${prebuiltVersion}`;
  const releaseUrl = `https://github.com/influxdata/docs-v2/releases/download/${release}`;
  const assetPath = path.join(pkgDir, target.asset);
  const loaderAsset = 'rust-markdown-converter-loader.js';
  const loaderAssetPath = path.join(pkgDir, loaderAsset);
  const checksumPath = path.join(pkgDir, 'checksums.txt');
  const outputPath = path.join(pkgDir, target.output);
  const loaderOutputPath = path.join(pkgDir, 'index.js');

  try {
    execFileSync('curl', [
      '--fail',
      '--location',
      '--silent',
      '--show-error',
      '--connect-timeout',
      '5',
      '--max-time',
      '30',
      '--output',
      assetPath,
      `${releaseUrl}/${target.asset}`,
    ]);
    execFileSync('curl', [
      '--fail',
      '--location',
      '--silent',
      '--show-error',
      '--connect-timeout',
      '5',
      '--max-time',
      '30',
      '--output',
      loaderAssetPath,
      `${releaseUrl}/${loaderAsset}`,
    ]);
    execFileSync('curl', [
      '--fail',
      '--location',
      '--silent',
      '--show-error',
      '--connect-timeout',
      '5',
      '--max-time',
      '30',
      '--output',
      checksumPath,
      `${releaseUrl}/checksums.txt`,
    ]);

    const checksums = new Map(
      readFileSync(checksumPath, 'utf8')
        .trim()
        .split('\n')
        .map((line) => {
          const [checksum, asset] = line.split(/\s{2,}/);
          return [asset, checksum];
        })
    );
    for (const [asset, assetFile] of [
      [target.asset, assetPath],
      [loaderAsset, loaderAssetPath],
    ]) {
      const actualChecksum = createHash('sha256')
        .update(readFileSync(assetFile))
        .digest('hex');
      if (checksums.get(asset) !== actualChecksum) {
        throw new Error(`checksum verification failed for ${asset}`);
      }
    }

    renameSync(assetPath, outputPath);
    renameSync(loaderAssetPath, loaderOutputPath);
    if (usePrebuilt()) {
      writeFileSync(prebuiltVersionPath, `${prebuiltVersion}\n`);
      console.log(`✓ Downloaded Rust markdown converter ${prebuiltVersion}`);
      return true;
    }
    return false;
  } catch (error) {
    console.warn(
      `⚠ Could not download Rust markdown converter ${prebuiltVersion}; rebuilding it: ${error.message}`
    );
    return false;
  } finally {
    rmSync(assetPath, { force: true });
    rmSync(loaderAssetPath, { force: true });
    rmSync(checksumPath, { force: true });
  }
}

// Set RUST_MARKDOWN_CONVERTER_SOURCE=true to validate the checked-out Rust
// source. Both shortcuts below resolve to a *published release* binary, so
// without this the converter source in the working tree is never compiled
// unless its version was bumped ahead of the last release. CI gates that
// verify converter output set this when the source changed.
const buildFromSource = process.env.RUST_MARKDOWN_CONVERTER_SOURCE === 'true';

if (
  !buildFromSource &&
  process.env.RUST_MARKDOWN_CONVERTER_PREBUILT === 'true'
) {
  if (usePrebuilt()) {
    process.exit(0);
  }
}

if (!buildFromSource && downloadPrebuilt()) {
  process.exit(0);
}

function has(cmd) {
  try {
    execFileSync(cmd, ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (!has('cargo')) {
  // Exiting 0 here would leave whatever binary a previous `yarn install`
  // downloaded in place, so a caller that asked for a source build would
  // silently validate the released converter instead. Fail loudly.
  if (buildFromSource) {
    console.error(
      '✗ RUST_MARKDOWN_CONVERTER_SOURCE=true but cargo was not found.\n' +
        '  Refusing to fall back to a prebuilt binary. Install Rust ' +
        '(https://rustup.rs) first.'
    );
    process.exit(1);
  }
  console.log(
    'ℹ Skipping Rust converter build: cargo not found. ' +
      'Install Rust (https://rustup.rs) to build it locally, or rely on CI.'
  );
  process.exit(0);
}

console.log('🦀 Building Rust markdown converter...');
execFileSync('yarn', ['install', '--frozen-lockfile'], {
  cwd: pkgDir,
  stdio: 'inherit',
});
execFileSync('yarn', ['build'], { cwd: pkgDir, stdio: 'inherit' });

if (!existsSync(path.join(pkgDir, 'index.js'))) {
  console.error('✗ Rust build did not produce index.js');
  process.exit(1);
}
// The binary now comes from source, so drop the marker that claims it is the
// published prebuilt — a later run must not short-circuit on a stale version.
rmSync(prebuiltVersionPath, { force: true });
console.log('✓ Rust markdown converter built');
