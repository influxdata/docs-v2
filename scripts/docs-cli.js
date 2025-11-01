#!/usr/bin/env node

/**
 * Main CLI entry point for docs tools
 * Supports subcommands: create, edit, etc.
 *
 * Usage:
 *   docs create <draft-path> [options]
 *   docs edit <url> [options]
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get subcommand and remaining arguments
const subcommand = process.argv[2];
const args = process.argv.slice(3);

// Map subcommands to script files
const subcommands = {
  create: 'docs-create.js',
  edit: 'docs-edit.js',
};

/**
 * Print usage information
 */
function printUsage() {
  console.log(`
Usage: docs <command> [options]

Commands:
  create <draft-path>     Create new documentation from draft
  edit <url>              Edit existing documentation

Examples:
  docs create drafts/new-feature.md --products influxdb3_core
  docs edit https://docs.influxdata.com/influxdb3/core/admin/

For command-specific help:
  docs create --help
  docs edit --help
`);
}

// Handle no subcommand or help
if (!subcommand || subcommand === '--help' || subcommand === '-h') {
  printUsage();
  process.exit(subcommand ? 0 : 1);
}

// Validate subcommand
if (!subcommands[subcommand]) {
  console.error(`Error: Unknown command '${subcommand}'`);
  console.error(`Run 'docs --help' for usage information`);
  process.exit(1);
}

// Execute the appropriate script
const scriptPath = join(__dirname, subcommands[subcommand]);
const child = spawn('node', [scriptPath, ...args], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error(`Failed to execute ${subcommand}:`, err.message);
  process.exit(1);
});
