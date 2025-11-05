#!/usr/bin/env node

/**
 * Setup script to make the `docs` command available locally after yarn install.
 * Creates a symlink in node_modules/.bin/docs pointing to scripts/docs-cli.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, symlinkSync, unlinkSync, chmodSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const binDir = join(rootDir, 'node_modules', '.bin');
const binLink = join(binDir, 'docs');
const targetScript = join(rootDir, 'scripts', 'docs-cli.js');

try {
  // Ensure node_modules/.bin directory exists
  if (!existsSync(binDir)) {
    mkdirSync(binDir, { recursive: true });
  }

  // Remove existing symlink if it exists
  if (existsSync(binLink)) {
    unlinkSync(binLink);
  }

  // Create symlink
  symlinkSync(targetScript, binLink, 'file');

  // Ensure the target script is executable
  chmodSync(targetScript, 0o755);

  console.log('✓ Created local `docs` command in node_modules/.bin/');
  console.log('  You can now use: npx docs <command>');
  console.log('  Or add node_modules/.bin to your PATH for direct access');
} catch (error) {
  console.error('Failed to setup local docs command:', error.message);
  process.exit(1);
}
