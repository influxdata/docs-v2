#!/usr/bin/env node

/**
 * Documentation scaffolding tool
 * Prepares context for Claude to analyze and generates file structure
 */

import { parseArgs } from 'node:util';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import {
  prepareContext,
  executeProposal,
  validateProposal,
} from './lib/content-scaffolding.js';
import { writeJson, readJson, fileExists } from './lib/file-operations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Repository root
const REPO_ROOT = join(__dirname, '..');

// Temp directory for context and proposal
const TMP_DIR = join(REPO_ROOT, '.tmp');
const CONTEXT_FILE = join(TMP_DIR, 'scaffold-context.json');
const PROPOSAL_FILE = join(TMP_DIR, 'scaffold-proposal.json');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Print colored output
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print section divider
 */
function divider() {
  log('━'.repeat(70), 'cyan');
}

/**
 * Parse command line arguments
 */
function parseArguments() {
  const { values } = parseArgs({
    options: {
      draft: { type: 'string' },
      from: { type: 'string' },
      execute: { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
      yes: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  });

  // --from is an alias for --draft
  if (values.from && !values.draft) {
    values.draft = values.from;
  }

  return values;
}

/**
 * Print usage information
 */
function printUsage() {
  console.log(`
${colors.bright}Documentation Content Scaffolding${colors.reset}

${colors.bright}Usage:${colors.reset}
  yarn docs:create --draft <path>     Prepare context from draft file
  yarn docs:create --from <path>      Alias for --draft
  yarn docs:create --execute          Execute proposal and create files

${colors.bright}Options:${colors.reset}
  --draft <path>    Path to draft markdown file
  --from <path>     Alias for --draft
  --execute         Execute the proposal (create files)
  --dry-run         Show what would be created without creating
  --yes             Skip confirmation prompt
  --help            Show this help message

${colors.bright}Workflow:${colors.reset}
  1. Create a draft markdown file with your content
  2. Run: yarn docs:create --draft path/to/draft.md
  3. Run: /scaffold-content (Claude command)
  4. Run: yarn docs:create --execute

${colors.bright}Examples:${colors.reset}
  # Prepare context for Claude
  yarn docs:create --draft drafts/new-feature.md
  yarn docs:create --from drafts/new-feature.md

  # Execute proposal after Claude analysis
  yarn docs:create --execute

  # Preview what would be created
  yarn docs:create --execute --dry-run
`);
}

/**
 * Phase 1: Prepare context from draft
 */
async function preparePhase(draftPath) {
  log('\n🔍 Analyzing draft and repository structure...', 'bright');

  // Validate draft exists
  if (!fileExists(draftPath)) {
    log(`✗ Draft file not found: ${draftPath}`, 'red');
    process.exit(1);
  }

  try {
    // Prepare context
    const context = prepareContext(draftPath);

    // Write context to temp file
    writeJson(CONTEXT_FILE, context);

    // Print summary
    log(
      `\n✓ Loaded draft content (${context.draft.content.split('\n').length} lines)`,
      'green'
    );
    log(
      `✓ Analyzed ${Object.keys(context.products).length} products from data/products.yml`,
      'green'
    );
    log(
      `✓ Found ${context.structure.existingPaths.length} pages in content/influxdb3/`,
      'green'
    );
    log(
      `✓ Prepared context → ${CONTEXT_FILE.replace(REPO_ROOT, '.')}`,
      'green'
    );

    // Print next steps
    log('');
    divider();
    log(
      'Next: Run /scaffold-content to analyze and propose structure',
      'bright'
    );
    divider();
    log('');
  } catch (error) {
    log(`\n✗ Error preparing context: ${error.message}`, 'red');
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Phase 2: Execute proposal
 */
async function executePhase(options) {
  log('\n📝 Reading proposal...', 'bright');

  // Check if proposal exists
  if (!fileExists(PROPOSAL_FILE)) {
    log(`\n✗ Proposal file not found: ${PROPOSAL_FILE}`, 'red');
    log('Did you run /scaffold-content yet?', 'yellow');
    process.exit(1);
  }

  try {
    // Read proposal
    const proposal = readJson(PROPOSAL_FILE);

    // Validate proposal
    const validation = validateProposal(proposal);

    if (!validation.valid) {
      log('\n✗ Invalid proposal:', 'red');
      validation.errors.forEach((err) => log(`  • ${err}`, 'red'));
      process.exit(1);
    }

    if (validation.warnings.length > 0) {
      log('\n⚠ Warnings:', 'yellow');
      validation.warnings.forEach((warn) => log(`  • ${warn}`, 'yellow'));
    }

    // Show preview
    log('\nPreview:', 'bright');
    divider();
    log(
      `Will create ${proposal.files.length} file${proposal.files.length !== 1 ? 's' : ''}:`
    );
    proposal.files.forEach((file) => {
      const icon = file.type === 'shared-content' ? '📄' : '📋';
      log(`  ${icon} ${file.path}`, 'cyan');
    });
    divider();

    // Dry run mode
    if (options['dry-run']) {
      log('\n✓ Dry run complete (no files created)', 'green');
      return;
    }

    // Confirm unless --yes flag
    if (!options.yes) {
      log('\nProceed with creating files? (y/n): ', 'yellow');

      // Read user input
      const stdin = process.stdin;
      stdin.setRawMode(true);
      stdin.setEncoding('utf8');

      const response = await new Promise((resolve) => {
        stdin.once('data', (key) => {
          stdin.setRawMode(false);
          resolve(key.toLowerCase());
        });
      });

      console.log(''); // New line after input

      if (response !== 'y') {
        log('✗ Cancelled by user', 'yellow');
        process.exit(0);
      }
    }

    // Execute proposal
    log('\n📁 Creating files...', 'bright');
    const result = executeProposal(proposal);

    // Report results
    if (result.created.length > 0) {
      log('');
      result.created.forEach((file) => {
        log(`✓ Created ${file}`, 'green');
      });
    }

    if (result.errors.length > 0) {
      log('\n✗ Errors:', 'red');
      result.errors.forEach((err) => log(`  • ${err}`, 'red'));
    }

    // Print next steps
    if (result.created.length > 0) {
      log('\n🎉 Done! Next steps:', 'bright');
      log('1. Review generated frontmatter');
      log('2. Test: npx hugo server');
      log('3. Commit: git add content/');
    }

    if (result.errors.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    log(`\n✗ Error executing proposal: ${error.message}`, 'red');
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Main entry point
 */
async function main() {
  const options = parseArguments();

  // Show help
  if (options.help) {
    printUsage();
    process.exit(0);
  }

  // Determine phase
  if (options.draft) {
    // Phase 1: Prepare context
    await preparePhase(options.draft);
  } else if (options.execute || options['dry-run']) {
    // Phase 2: Execute proposal
    await executePhase(options);
  } else {
    // No valid options provided
    log('Error: Must specify --draft or --execute', 'red');
    log('Run with --help for usage information\n');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    log(`\nFatal error: ${error.message}`, 'red');
    console.error(error.stack);
    process.exit(1);
  });
}

export { preparePhase, executePhase };
