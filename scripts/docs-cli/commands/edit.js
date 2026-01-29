#!/usr/bin/env node

/**
 * Documentation file editor
 * Opens existing documentation pages in your default editor
 *
 * Usage:
 *   docs edit <url>                    # Non-blocking (default)
 *   docs edit <url> --wait             # Wait for editor to close
 *   docs edit <url> --list             # List files without opening
 *   docs edit <url> --editor vim       # Use specific editor
 */

import { join } from 'path';
import { existsSync } from 'fs';
import { parseDocumentationURL, urlToFilePaths } from '../lib/url-parser.js';
import { getSourceFromFrontmatter } from '../lib/content-utils.js';
import { resolveEditor } from '../lib/editor-resolver.js';
import { spawnEditor, shouldWait } from '../lib/process-manager.js';
import { findDocsV2Root } from '../lib/config-loader.js';

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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printUsage() {
  console.log(`
${colors.bright}Documentation File Editor${colors.reset}

Usage:
  docs edit <url>                    Open in editor (non-blocking)
  docs edit <url> --wait             Wait for editor to close
  docs edit <url> --list             List files without opening
  docs edit <url> --editor <cmd>     Use specific editor

Arguments:
  <url>             Documentation URL or path

Options:
  --list            List matching files without opening
  --wait            Block until editor closes (for interactive use)
  --editor <cmd>    Override default editor
  --help            Show this help message

Examples:
  # Quick edit (CLI exits immediately, editor runs in background)
  docs edit https://docs.influxdata.com/influxdb3/core/admin/databases/
  docs edit /influxdb3/core/admin/databases/

  # Interactive edit (CLI waits for you to close editor)
  docs edit /influxdb3/core/admin/databases/ --wait

  # Use specific editor
  docs edit /influxdb3/core/admin/databases/ --editor nano

  # List files only (useful for scripting)
  docs edit /influxdb3/core/admin/databases/ --list

Editor Configuration:
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

Notes:
  - Default behavior is non-blocking (agent-friendly)
  - Use --wait flag for interactive editing sessions
  - Multiple files may open if content is shared across products
`);
}

function findFiles(url, repoRoot) {
  try {
    const parsed = parseDocumentationURL(url);
    log(`\n🔍 Analyzing URL: ${url}`, 'bright');
    log(`   Product: ${parsed.namespace}/${parsed.product || 'N/A'}`, 'cyan');
    log(`   Section: ${parsed.section || 'N/A'}`, 'cyan');

    const potentialPaths = urlToFilePaths(parsed);
    const foundFiles = [];

    for (const relativePath of potentialPaths) {
      const fullPath = join(repoRoot, relativePath);
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

function checkSharedContent(filePath, repoRoot) {
  const fullPath = join(repoRoot, filePath);
  return getSourceFromFrontmatter(fullPath);
}

function openInEditor(files, repoRoot, options = {}) {
  try {
    const editor = resolveEditor({ editor: options.editor });
    const wait = shouldWait(options.wait);

    log(`\n📝 Opening ${files.length} file(s) in ${editor}...`, 'bright');

    if (!wait) {
      log('   Editor will open in background (CLI exits immediately)', 'cyan');
      log('   Use --wait flag to block until editor closes', 'cyan');
    }

    const absolutePaths = files.map((f) => join(repoRoot, f));

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

export default async function edit(args) {
  const positionals = args.args || [];
  
  // Parse options
  let url = null;
  let listOnly = false;
  let wait = false;
  let editor = null;

  for (const arg of positionals) {
    if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else if (arg === '--list') {
      listOnly = true;
    } else if (arg === '--wait') {
      wait = true;
    } else if (arg.startsWith('--editor=')) {
      editor = arg.split('=')[1];
    } else if (!url) {
      url = arg;
    }
  }

  if (!url) {
    printUsage();
    process.exit(1);
  }

  // Find docs-v2 repository
  const repoRoot = findDocsV2Root();
  if (!repoRoot) {
    log('\n✗ Could not find docs-v2 repository', 'red');
    log('\nThe edit command needs access to the docs-v2 repository.', 'yellow');
    log('');
    log('Options:', 'bright');
    log('  1. Run from within docs-v2 repository', 'cyan');
    log('  2. Set DOCS_V2_PATH in .env file', 'cyan');
    log('  3. Place docs-v2 in a common location:', 'cyan');
    log('     ~/github/influxdata/docs-v2', 'cyan');
    log('     ~/Documents/github/influxdata/docs-v2', 'cyan');
    log('');
    process.exit(1);
  }

  log(`\n📂 Using docs-v2 repository: ${repoRoot}`, 'cyan');

  // Find files
  const { foundFiles } = findFiles(url, repoRoot);

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
    const sharedSource = checkSharedContent(file, repoRoot);
    if (sharedSource) {
      if (existsSync(join(repoRoot, sharedSource))) {
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
  if (listOnly) {
    log(`\n✓ Found ${filesToOpen.length} file(s)`, 'green');
    process.exit(0);
  }

  // Open in editor
  openInEditor(filesToOpen, repoRoot, { wait, editor });
}
