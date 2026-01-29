#!/usr/bin/env node

/**
 * Main CLI entry point for docs-v2
 * Unified documentation CLI with secure configuration
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const [command, ...args] = process.argv.slice(2);

function printUsage() {
  console.log(`
InfluxData Documentation Tooling CLI

Usage: docs <command> [options]

Commands:
  audit <product> <version>           Audit documentation coverage
  create <draft> --products <p>       Create new documentation
  edit <url>                          Edit existing documentation
  release-notes <from> <to> [paths]   Generate release notes
  add-placeholders <file>             Add placeholder syntax to code blocks

Products:
  core        - InfluxDB 3 Core
  enterprise  - InfluxDB 3 Enterprise
  both        - Both Core and Enterprise
  telegraf    - Telegraf plugins

Configuration:
  Uses environment variables for configuration.
  See scripts/docs-cli/config/README.md for full documentation.

  Quick setup:
    1. (Optional) Copy config/.env.example to .env
    2. Authenticate with GitHub: gh auth login
    3. Run commands

Examples:
  # Audit documentation
  docs audit core main

  # Create new content
  docs create drafts/feature.md --products influxdb3_core

  # Edit existing page
  docs edit /influxdb3/core/admin/databases/

  # Generate release notes
  docs release-notes v3.1.0 v3.2.0 ~/repos/influxdb

  # Get command help
  docs audit --help
  docs create --help
  docs edit --help
  docs release-notes --help

For more information:
  Documentation: scripts/docs-cli/README.md
  Configuration: scripts/docs-cli/config/README.md
  GitHub: https://github.com/influxdata/docs-v2
`);
}

async function main() {
  if (!command || command === '--help' || command === '-h') {
    printUsage();
    process.exit(command ? 0 : 1);
  }

  if (command === '--version' || command === '-v') {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const pkg = JSON.parse(readFileSync(join(dirname(__dirname), 'package.json'), 'utf8'));
    console.log(`docs-cli v${pkg.version}`);
    process.exit(0);
  }

  try {
    const commandPath = `./commands/${command}.js`;
    const commandModule = await import(commandPath);
    await commandModule.default({ args, command });
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      console.error(`Error: Unknown command '${command}'`);
      console.error(`Run 'docs --help' for usage information`);
      process.exit(1);
    } else {
      console.error(`Error executing command '${command}':`, error.message);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error('Fatal error:', error.message);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});
