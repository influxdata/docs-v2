#!/usr/bin/env node
/**
 * Build the Rust markdown converter napi module when a Rust toolchain is
 * present. Skips with a clear message otherwise so `yarn install` never fails
 * on machines without Rust. CI builds it explicitly (see .circleci/config.yml).
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
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
  const checksumPath = path.join(pkgDir, 'checksums.txt');
  const outputPath = path.join(pkgDir, target.output);

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
      checksumPath,
      `${releaseUrl}/checksums.txt`,
    ]);

    const expectedChecksum = readFileSync(checksumPath, 'utf8')
      .split('\n')
      .find((line) => line.endsWith(`  ${target.asset}`))
      ?.split(/\s+/)[0];
    const actualChecksum = createHash('sha256')
      .update(readFileSync(assetPath))
      .digest('hex');
    if (!expectedChecksum || actualChecksum !== expectedChecksum) {
      throw new Error(`checksum verification failed for ${target.asset}`);
    }

    renameSync(assetPath, outputPath);
    writeFileSync(prebuiltVersionPath, `${prebuiltVersion}\n`);
    console.log(`✓ Downloaded Rust markdown converter ${prebuiltVersion}`);
    return usePrebuilt();
  } catch (error) {
    console.warn(
      `⚠ Could not download Rust markdown converter ${prebuiltVersion}; rebuilding it: ${error.message}`
    );
    return false;
  } finally {
    rmSync(assetPath, { force: true });
    rmSync(checksumPath, { force: true });
  }
}

if (process.env.RUST_MARKDOWN_CONVERTER_PREBUILT === 'true') {
  if (usePrebuilt()) {
    process.exit(0);
  }
}

if (downloadPrebuilt()) {
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
console.log('✓ Rust markdown converter built');
