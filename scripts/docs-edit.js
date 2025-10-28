#!/usr/bin/env node

/**
 * Documentation file opener
 * Opens existing documentation pages in your default editor
 *
 * Usage:
 *   yarn docs:edit <url>
 *   yarn docs:edit https://docs.influxdata.com/influxdb3/core/admin/databases/
 *   yarn docs:edit /influxdb3/core/admin/databases/
 */

import { parseArgs } from 'node:util';
import process from 'node:process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync } from 'fs';
import { spawn } from 'child_process';
import { parseDocumentationURL, urlToFilePaths } from './lib/url-parser.js';

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
  yarn docs:edit <url>                    Open page in editor
  yarn docs:edit --list <url>             List matching files without opening

${colors.bright}Arguments:${colors.reset}
  <url>             Documentation URL or path

${colors.bright}Options:${colors.reset}
  --list            List matching files without opening
  --help            Show this help message

${colors.bright}Examples:${colors.reset}
  # Open with full URL
  yarn docs:edit https://docs.influxdata.com/influxdb3/core/admin/databases/

  # Open with path only
  yarn docs:edit /influxdb3/core/admin/databases/

  # List files without opening
  yarn docs:edit --list /influxdb3/core/admin/databases/

${colors.bright}Notes:${colors.reset}
  - Opens files in your default editor (set via EDITOR environment variable)
  - If multiple files exist (e.g., shared content variants), opens all of them
  - Falls back to VS Code if EDITOR is not set
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
 */
function checkSharedContent(filePath) {
  const fullPath = join(REPO_ROOT, filePath);

  if (!existsSync(fullPath)) {
    return null;
  }

  const content = readFileSync(fullPath, 'utf8');

  // Check for source: frontmatter
  const sourceMatch = content.match(/^source:\s*(.+)$/m);
  if (sourceMatch) {
    const sourcePath = sourceMatch[1].trim();
    return `content${sourcePath}`;
  }

  return null;
}

/**
 * Open files in editor
 */
function openInEditor(files) {
  // Determine editor
  const editor = process.env.EDITOR || 'code';

  log(`\n📝 Opening ${files.length} file(s) in ${editor}...`, 'bright');

  // Convert to absolute paths
  const absolutePaths = files.map((f) => join(REPO_ROOT, f));

  // Spawn editor process
  const child = spawn(editor, absolutePaths, {
    stdio: 'inherit',
    detached: false,
  });

  child.on('error', (error) => {
    log(`\n✗ Failed to open editor: ${error.message}`, 'red');
    log('\nTry setting the EDITOR environment variable:', 'yellow');
    log('  export EDITOR=vim', 'cyan');
    log('  export EDITOR=code', 'cyan');
    log('  export EDITOR=nano', 'cyan');
    process.exit(1);
  });

  child.on('close', (code) => {
    if (code !== 0 && code !== null) {
      log(`\n✗ Editor exited with code ${code}`, 'yellow');
    }
  });
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
  const { parsed, foundFiles } = findFiles(options.url);

  if (foundFiles.length === 0) {
    log('\n✗ No files found for this URL', 'red');
    log('\nThe page may not exist yet. To create new content, use:', 'yellow');
    log('  yarn docs:create --url <url> --draft <draft-file>', 'cyan');
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
  openInEditor(filesToOpen);
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
