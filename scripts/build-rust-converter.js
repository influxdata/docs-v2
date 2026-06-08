#!/usr/bin/env node
/**
 * Build the Rust markdown converter napi module when a Rust toolchain is
 * present. Skips with a clear message otherwise so `yarn install` never fails
 * on machines without Rust. CI builds it explicitly (see .circleci/config.yml).
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const pkgDir = path.resolve('scripts/rust-markdown-converter');

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
