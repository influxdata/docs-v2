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

// Command aliases for convenience
const COMMAND_ALIASES = {
  placeholders: 'add-placeholders',
};

function printUsage() {
  console.log(`
InfluxData Documentation Tooling CLI

Usage: docs <command> [options]

Commands:
  audit --products <p>                Audit documentation coverage
  create <draft> --products <p>       Create new documentation
  edit <url>                          Edit existing documentation
  release-notes <from> <to>           Generate release notes
  placeholders <file>                 Add placeholder syntax to code blocks

Product Targeting:
  --products accepts product keys OR content paths:
    influxdb3_core        or  /influxdb3/core
    influxdb3_enterprise  or  /influxdb3/enterprise
    telegraf              or  /telegraf

  --repos accepts direct repository paths or URLs (alternative to --products)

Configuration:
  Uses environment variables for configuration.
  See scripts/docs-cli/config/README.md for full documentation.

  Quick setup:
    1. (Optional) Copy config/.env.example to .env
    2. Authenticate with GitHub: gh auth login
    3. Run commands

Examples:
  # Audit documentation (using product key or path)
  docs audit --products influxdb3_core
  docs audit --products /influxdb3/core --version v3.3.0

  # Create new content
  docs create drafts/feature.md --products influxdb3_core
  docs create drafts/feature.md --products /influxdb3/core,/influxdb3/enterprise

  # Edit existing page
  docs edit /influxdb3/core/admin/databases/

  # Generate release notes
  docs release-notes v3.1.0 v3.2.0 --products influxdb3_core

  # Add placeholders to code blocks
  docs placeholders content/influxdb3/core/admin/databases.md

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
    // Go up two levels: docs-cli -> scripts -> repo root
    const pkg = JSON.parse(
      readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8')
    );
    console.log(`docs-cli v${pkg.version}`);
    process.exit(0);
  }

  // Resolve command aliases
  const resolvedCommand = COMMAND_ALIASES[command] || command;

  try {
    const commandPath = `./commands/${resolvedCommand}.js`;
    const commandModule = await import(commandPath);
    await commandModule.default({ args, command: resolvedCommand });
  } catch (error) {
    // Check if the command file itself wasn't found (unknown command)
    if (
      error.code === 'ERR_MODULE_NOT_FOUND' &&
      error.message.includes(`commands/${resolvedCommand}`)
    ) {
      console.error(`Error: Unknown command '${command}'`);
      console.error(`Run 'docs --help' for usage information`);
      process.exit(1);
    } else {
      // Other errors (missing dependencies, runtime errors, etc.)
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
