#!/usr/bin/env node

/**
 * Documentation file opener
 * Opens existing documentation pages in your default editor
 *
 * Usage:
 *   docs edit <url>                    # Non-blocking (default)
 *   docs edit <url> --wait             # Wait for editor to close
 *   docs edit <url> --list             # List files without opening
 *   docs edit <url> --editor vim       # Use specific editor
 */

import { parseArgs } from 'node:util';
import process from 'node:process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { parseDocumentationURL, urlToFilePaths } from './lib/url-parser.js';
import { getSourceFromFrontmatter } from './lib/content-utils.js';
import { resolveEditor } from './lib/editor-resolver.js';
import { spawnEditor, shouldWait } from './lib/process-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Repository root
const REPO_ROOT = join(__dirname, '..');

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
 * Parse command line arguments
 */
function parseArguments() {
  const { values, positionals } = parseArgs({
    options: {
      help: { type: 'boolean', default: false },
      list: { type: 'boolean', default: false },
      wait: { type: 'boolean', default: false },
      editor: { type: 'string' },
    },
    allowPositionals: true,
  });

  // First positional argument is the URL
  if (positionals.length > 0 && !values.url) {
    values.url = positionals[0];
  }

  return values;
}

/**
 * Print usage information
 */
function printUsage() {
  console.log(`
${colors.bright}Documentation File Opener${colors.reset}

${colors.bright}Usage:${colors.reset}
  docs edit <url>                    Open in editor (non-blocking)
  docs edit <url> --wait             Wait for editor to close
  docs edit <url> --list             List files without opening
  docs edit <url> --editor <cmd>     Use specific editor

${colors.bright}Arguments:${colors.reset}
  <url>             Documentation URL or path

${colors.bright}Options:${colors.reset}
  --list            List matching files without opening
  --wait            Block until editor closes (for interactive use)
  --editor <cmd>    Override default editor
  --help            Show this help message

${colors.bright}Examples:${colors.reset}
  # Quick edit (CLI exits immediately, editor runs in background)
  docs edit https://docs.influxdata.com/influxdb3/core/admin/databases/
  docs edit /influxdb3/core/admin/databases/

  # Interactive edit (CLI waits for you to close editor)
  docs edit /influxdb3/core/admin/databases/ --wait

  # Use specific editor
  docs edit /influxdb3/core/admin/databases/ --editor nano

  # List files only (useful for scripting)
  docs edit /influxdb3/core/admin/databases/ --list

${colors.bright}Editor Configuration:${colors.reset}
  The editor is selected in this order:
  1. --editor flag
  2. DOCS_EDITOR environment variable
  3. VISUAL environment variable
  4. EDITOR environment variable
  5. System default (vim, nano, etc.)

  Examples:
    export EDITOR=vim
    export EDITOR=nano
    export DOCS_EDITOR="code --wait"

${colors.bright}Notes:${colors.reset}
  - Default behavior is non-blocking (agent-friendly)
  - Use --wait flag for interactive editing sessions
  - Multiple files may open if content is shared across products
`);
}

/**
 * Find matching files for a URL
 */
function findFiles(url) {
  try {
    // Parse URL
    const parsed = parseDocumentationURL(url);
    log(`\n🔍 Analyzing URL: ${url}`, 'bright');
    log(`   Product: ${parsed.namespace}/${parsed.product || 'N/A'}`, 'cyan');
    log(`   Section: ${parsed.section || 'N/A'}`, 'cyan');

    // Get potential file paths
    const potentialPaths = urlToFilePaths(parsed);
    const foundFiles = [];

    for (const relativePath of potentialPaths) {
      const fullPath = join(REPO_ROOT, relativePath);
      if (existsSync(fullPath)) {
        foundFiles.push(relativePath);
      }
    }

    return { parsed, foundFiles };
  } catch (error) {
    log(`\n✗ Error parsing URL: ${error.message}`, 'red');
    process.exit(1);
  }
}

/**
 * Check if file uses shared content
 * @param {string} filePath - Relative path from repo root
 * @returns {string|null} Path to shared source file or null
 */
function checkSharedContent(filePath) {
  const fullPath = join(REPO_ROOT, filePath);
  return getSourceFromFrontmatter(fullPath);
}

/**
 * Open files in editor
 */
function openInEditor(files, options = {}) {
  try {
    // Resolve editor command
    const editor = resolveEditor({ editor: options.editor });
    const wait = shouldWait(options.wait);

    log(`\n📝 Opening ${files.length} file(s) in ${editor}...`, 'bright');

    if (!wait) {
      log('   Editor will open in background (CLI exits immediately)', 'cyan');
      log('   Use --wait flag to block until editor closes', 'cyan');
    }

    // Convert to absolute paths
    const absolutePaths = files.map((f) => join(REPO_ROOT, f));

    // Spawn editor
    spawnEditor(editor, absolutePaths, {
      wait,
      onError: (error) => {
        log(`\n✗ Failed to open editor: ${error.message}`, 'red');
        log('\nTroubleshooting:', 'yellow');
        log('  1. Set EDITOR environment variable:', 'cyan');
        log('     export EDITOR=vim', 'cyan');
        log('  2. Or use --editor flag:', 'cyan');
        log('     docs edit <url> --editor nano', 'cyan');
        process.exit(1);
      },
    });

    // In non-blocking mode, give process time to spawn before exit
    if (!wait) {
      setTimeout(() => {
        log('✓ Editor launched\n', 'green');
        process.exit(0);
      }, 100);
    }
  } catch (error) {
    log(`\n✗ ${error.message}`, 'red');
    process.exit(1);
  }
}

/**
 * Main entry point
 */
async function main() {
  const options = parseArguments();

  // Show help
  if (options.help || !options.url) {
    printUsage();
    process.exit(0);
  }

  // Find files
  const { foundFiles } = findFiles(options.url);

  if (foundFiles.length === 0) {
    log('\n✗ No files found for this URL', 'red');
    log('\nThe page may not exist yet. To create new content, use:', 'yellow');
    log('  docs create <draft-path> --products <product>', 'cyan');
    process.exit(1);
  }

  // Display found files
  log('\n✓ Found files:', 'green');
  const allFiles = new Set();

  for (const file of foundFiles) {
    allFiles.add(file);
    log(`  • ${file}`, 'cyan');

    // Check for shared content
    const sharedSource = checkSharedContent(file);
    if (sharedSource) {
      if (existsSync(join(REPO_ROOT, sharedSource))) {
        allFiles.add(sharedSource);
        log(
          `  • ${sharedSource} ${colors.yellow}(shared source)${colors.reset}`,
          'cyan'
        );
      }
    }
  }

  const filesToOpen = Array.from(allFiles);

  // List only mode
  if (options.list) {
    log(`\n✓ Found ${filesToOpen.length} file(s)`, 'green');
    process.exit(0);
  }

  // Open in editor
  openInEditor(filesToOpen, {
    wait: options.wait,
    editor: options.editor,
  });
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    log(`\nFatal error: ${error.message}`, 'red');
    console.error(error.stack);
    process.exit(1);
  });
}

export { findFiles, openInEditor };
