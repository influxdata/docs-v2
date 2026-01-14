#!/usr/bin/env node

/**
 * Main CLI entry point for docs tools
 * Supports subcommands: create, edit, placeholders
 *
 * Usage:
 *   docs create <draft-path> [options]
 *   docs edit <url> [options]
 *   docs placeholders <file.md> [options]
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
  placeholders: 'add-placeholders.js',
};

/**
 * Print usage information
 */
function printUsage() {
  console.log(`
Usage: docs <command> [options]

Commands:
  create <draft-path>     Create new documentation from draft
  edit <url>              Edit existing documentation (non-blocking)
  placeholders <file.md>  Add placeholder syntax to code blocks
  test                    Run test suite to verify CLI functionality

Examples:
  docs create drafts/new-feature.md --products influxdb3_core
  docs edit https://docs.influxdata.com/influxdb3/core/admin/
  docs edit /influxdb3/core/admin/ --wait
  docs edit /influxdb3/core/admin/ --list
  docs placeholders content/influxdb3/core/admin/upgrade.md
  docs test

For command-specific help:
  docs create --help
  docs edit --help
  docs placeholders --help

Note: 'docs edit' is non-blocking by default (agent-friendly).
      Use --wait flag for interactive editing sessions.
`);
}

// Handle test command (async, so don't continue)
if (subcommand === 'test') {
  runTests();
} else if (!subcommand || subcommand === '--help' || subcommand === '-h') {
  // Handle no subcommand or help
  printUsage();
  process.exit(subcommand ? 0 : 1);
} else if (!subcommands[subcommand]) {
  // Validate subcommand
  console.error(`Error: Unknown command '${subcommand}'`);
  console.error(`Run 'docs --help' for usage information`);
  process.exit(1);
} else {
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
}

/**
 * Test function to verify docs CLI functionality
 * Run with: npx docs test
 */
function runTests() {
  import('child_process').then(({ execSync }) => {
    const tests = [];
    const testResults = [];

    console.log('\n🧪 Testing docs CLI functionality...\n');

    // Test 1: docs --help
    tests.push({
      name: 'docs --help',
      command: 'npx docs --help',
      expectedInOutput: [
        'create <draft-path>',
        'edit <url>',
        'placeholders <file.md>',
      ],
    });

    // Test 2: docs create --help
    tests.push({
      name: 'docs create --help',
      command: 'npx docs create --help',
      expectedInOutput: [
        'Documentation Content Scaffolding',
        '--products',
        'Pipe to external agent',
      ],
    });

    // Test 3: docs edit --help (updated to check for new flags)
    tests.push({
      name: 'docs edit --help',
      command: 'npx docs edit --help',
      expectedInOutput: [
        'Documentation File Opener',
        '--list',
        '--wait',
        '--editor',
      ],
    });

    // Test 4: docs placeholders --help
    tests.push({
      name: 'docs placeholders --help',
      command: 'npx docs placeholders --help',
      expectedInOutput: [
        'Add placeholder syntax',
        '--dry',
        'code-placeholder-key',
      ],
    });

    // Test 5: docs placeholders with missing args shows error
    tests.push({
      name: 'docs placeholders (no args)',
      command: 'npx docs placeholders 2>&1',
      expectedInOutput: ['Error: Missing file path'],
      expectFailure: true,
    });

    // Test 6: Verify symlink exists
    tests.push({
      name: 'symlink exists',
      command: 'ls -la node_modules/.bin/docs',
      expectedInOutput: ['scripts/docs-cli.js'],
    });

    // Test 7: Unknown command shows error
    tests.push({
      name: 'unknown command',
      command: 'npx docs invalid-command 2>&1',
      expectedInOutput: ['Error: Unknown command'],
      expectFailure: true,
    });

    // Run tests
    for (const test of tests) {
      try {
        const output = execSync(test.command, {
          encoding: 'utf8',
          stdio: 'pipe',
        });

        const passed = test.expectedInOutput.every((expected) =>
          output.includes(expected)
        );

        if (passed) {
          console.log(`✅ ${test.name}`);
          testResults.push({ name: test.name, passed: true });
        } else {
          console.log(`❌ ${test.name} - Expected output not found`);
          console.log(`   Expected: ${test.expectedInOutput.join(', ')}`);
          testResults.push({
            name: test.name,
            passed: false,
            reason: 'Expected output not found',
          });
        }
      } catch (error) {
        if (test.expectFailure) {
          // Expected to fail - check if error output contains expected strings
          const errorOutput =
            error.stderr?.toString() || error.stdout?.toString() || '';
          const passed = test.expectedInOutput.every((expected) =>
            errorOutput.includes(expected)
          );

          if (passed) {
            console.log(`✅ ${test.name} (expected failure)`);
            testResults.push({ name: test.name, passed: true });
          } else {
            console.log(`❌ ${test.name} - Expected error message not found`);
            console.log(`   Expected: ${test.expectedInOutput.join(', ')}`);
            testResults.push({
              name: test.name,
              passed: false,
              reason: 'Expected error message not found',
            });
          }
        } else {
          console.log(`❌ ${test.name} - Command failed unexpectedly`);
          console.log(`   Error: ${error.message}`);
          testResults.push({
            name: test.name,
            passed: false,
            reason: error.message,
          });
        }
      }
    }

    const passed = testResults.filter((r) => r.passed).length;
    const failed = testResults.filter((r) => !r.passed).length;

    console.log(`\n📊 Test Results: ${passed}/${tests.length} passed`);

    if (failed > 0) {
      console.log(`\n❌ Failed tests:`);
      testResults
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`   - ${r.name}: ${r.reason}`);
        });
      process.exit(1);
    } else {
      console.log(`\n✅ All tests passed!\n`);
      process.exit(0);
    }
  });
}
