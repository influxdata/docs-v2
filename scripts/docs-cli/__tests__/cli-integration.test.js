#!/usr/bin/env node

/**
 * Integration tests for docs CLI commands
 *
 * These tests verify that commands can be loaded and executed without
 * import/module resolution errors. They catch issues like:
 * - Bad relative import paths (e.g., ./lib/ vs ../../lib/)
 * - Missing dependencies
 * - Syntax errors
 *
 * Run with: node scripts/docs-cli/__tests__/cli-integration.test.js
 */

import { spawn } from 'child_process';
import { writeFileSync, unlinkSync, mkdirSync, rmdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for output
const colors = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

let passed = 0;
let failed = 0;

/**
 * Run a CLI command and check for success/failure
 */
function runCommand(args, options = {}) {
  return new Promise((resolve) => {
    const cliPath = join(__dirname, '..', 'docs-cli.js');
    const proc = spawn('node', [cliPath, ...args], {
      cwd: join(__dirname, '..', '..', '..'), // repo root
      timeout: options.timeout || 10000,
      env: { ...process.env, ...options.env },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });

    proc.on('error', (err) => {
      resolve({ code: -1, stdout, stderr: err.message });
    });

    // Handle timeout
    setTimeout(() => {
      proc.kill();
      resolve({ code: -1, stdout, stderr: 'Timeout' });
    }, options.timeout || 10000);
  });
}

function test(name, assertion) {
  if (assertion) {
    console.log(colors.green(`✅ ${name}`));
    passed++;
  } else {
    console.log(colors.red(`❌ ${name}`));
    failed++;
  }
}

async function testCommandHelp(command, description) {
  const result = await runCommand([command, '--help']);
  const success = result.code === 0 && !result.stderr.includes('Error');
  test(`${command} --help: ${description}`, success);
  if (!success) {
    console.log(colors.yellow(`   stdout: ${result.stdout.slice(0, 200)}`));
    console.log(colors.red(`   stderr: ${result.stderr.slice(0, 500)}`));
  }
  return success;
}

async function testCommandExecution(command, args, description, validator) {
  const result = await runCommand([command, ...args]);
  const success = validator(result);
  test(`${command} execution: ${description}`, success);
  if (!success) {
    console.log(colors.yellow(`   exit code: ${result.code}`));
    console.log(colors.yellow(`   stdout: ${result.stdout.slice(0, 200)}`));
    console.log(colors.red(`   stderr: ${result.stderr.slice(0, 500)}`));
  }
  return success;
}

async function runTests() {
  console.log(colors.cyan('\n🧪 CLI Integration Tests\n'));
  console.log('Testing that all commands load without import errors...\n');

  // Test 1: Main help loads
  await testCommandHelp('--help', 'main CLI help loads');

  // Test 2-6: Each command's help loads (catches import errors)
  await testCommandHelp('create', 'loads without import errors');
  await testCommandHelp('edit', 'loads without import errors');
  await testCommandHelp('placeholders', 'loads without import errors');
  await testCommandHelp('audit', 'loads without import errors');
  await testCommandHelp('release-notes', 'loads without import errors');

  // Test 7: Alias works
  await testCommandHelp('add-placeholders', 'alias resolves correctly');

  // Test 8: Unknown command gives proper error
  const unknownResult = await runCommand(['nonexistent-command']);
  test(
    'unknown command: returns error message',
    unknownResult.code !== 0 && unknownResult.stderr.includes('Unknown command')
  );

  // Test 9: Create command actually executes (not just --help)
  // Create a temp draft file
  const tempDir = join(__dirname, '..', '..', '..', '.tmp-test');
  const tempDraft = join(tempDir, 'test-draft.md');

  try {
    mkdirSync(tempDir, { recursive: true });
    writeFileSync(tempDraft, '# Test Draft\n\nThis is test content.');

    // Run create with --context-only to avoid interactive prompts
    // This exercises the actual code paths, not just argument parsing
    await testCommandExecution(
      'create',
      [tempDraft, '--context-only'],
      'executes with draft file (context preparation)',
      (result) => {
        // Must succeed (exit code 0)
        if (result.code !== 0) {
          console.log(
            colors.red(`   Command failed with exit code ${result.code}`)
          );
          return false;
        }
        // Check for actual errors (not progress messages which may go to stderr)
        const hasError =
          result.stderr.includes('Error:') ||
          result.stderr.includes('ERR_') ||
          result.stderr.includes('Cannot find module');
        if (hasError) {
          console.log(colors.red(`   Error detected in output`));
          return false;
        }
        return true;
      }
    );
  } finally {
    // Cleanup
    try {
      unlinkSync(tempDraft);
    } catch {}
    try {
      rmdirSync(tempDir);
    } catch {}
  }

  // Test 10: Edit command actually executes
  await testCommandExecution(
    'edit',
    ['/influxdb3/core/get-started/', '--list'],
    'executes with URL (list mode)',
    (result) => {
      // Must succeed (exit code 0) with no errors
      if (result.code !== 0) {
        console.log(
          colors.red(`   Command failed with exit code ${result.code}`)
        );
        return false;
      }
      if (result.stderr && result.stderr.trim()) {
        console.log(colors.red(`   Unexpected stderr output`));
        return false;
      }
      return true;
    }
  );

  // Test 11: Placeholders command actually executes
  // Create a temp file with a code block to test
  const tempPlaceholderFile = join(tempDir, 'test-placeholders.md');
  try {
    mkdirSync(tempDir, { recursive: true });
    writeFileSync(
      tempPlaceholderFile,
      '# Test\n\n```sql\nSELECT * FROM MY_TABLE\n```\n'
    );

    await testCommandExecution(
      'placeholders',
      [tempPlaceholderFile, '--dry'],
      'executes with dry-run on test file',
      (result) => {
        // Must succeed (exit code 0) with no errors
        if (result.code !== 0) {
          console.log(
            colors.red(`   Command failed with exit code ${result.code}`)
          );
          return false;
        }
        if (result.stderr && result.stderr.trim()) {
          console.log(colors.red(`   Unexpected stderr output`));
          return false;
        }
        return true;
      }
    );
  } finally {
    try {
      unlinkSync(tempPlaceholderFile);
    } catch {}
    try {
      rmdirSync(tempDir);
    } catch {}
  }

  // Test 12: Create command errors helpfully when piping without --products
  // Simulates piping by checking for the error message in stderr
  await testCommandExecution(
    'create',
    ['content/influxdb3/core/_index.md'],
    'errors helpfully when piping without --products',
    (result) => {
      // When run in this test harness, stdout is not a TTY (similar to piping)
      // Should exit with error about needing --products
      const hasProductError =
        result.stderr.includes('Cannot show interactive product selection') ||
        result.stderr.includes('--products');
      return result.code !== 0 && hasProductError;
    }
  );

  // Test 13: Create command works when --products is provided (even when piping)
  await testCommandExecution(
    'create',
    ['content/influxdb3/core/_index.md', '--products', 'influxdb3_core'],
    'succeeds with --products flag when piping',
    (result) => {
      // Should succeed and output prompt text
      if (result.code !== 0) {
        console.log(
          colors.red(`   Command failed with exit code ${result.code}`)
        );
        return false;
      }
      // Should contain prompt text in stdout
      const hasPrompt = result.stdout.includes(
        'expert InfluxData documentation'
      );
      if (!hasPrompt) {
        console.log(colors.red(`   Expected prompt text in stdout`));
        return false;
      }
      return true;
    }
  );

  // Test 14: release-notes --products flag parsing
  await testCommandExecution(
    'release-notes',
    ['v3.7.0', 'v3.8.0', '--products', 'influxdb3_core', '--no-fetch'],
    '--products flag parses correctly',
    (result) => {
      // Should attempt to use the product (may fail due to missing repo, but parsing worked)
      const parsedCorrectly =
        result.stderr.includes('influxdb3_core') ||
        result.stderr.includes('Using cached clone') ||
        result.stderr.includes('Cloning');
      return parsedCorrectly;
    }
  );

  // Test 15: release-notes --repos flag parsing
  await testCommandExecution(
    'release-notes',
    ['v1.0.0', 'v1.1.0', '--repos', '/nonexistent/path', '--no-fetch'],
    '--repos flag parses correctly',
    (result) => {
      // Should error about path not found (parsing worked, validation caught it)
      return (
        result.code !== 0 && result.stderr.includes('Repository path not found')
      );
    }
  );

  // Test 16: release-notes error when no repos specified
  await testCommandExecution(
    'release-notes',
    ['v3.7.0', 'v3.8.0'],
    'errors when no --products or --repos specified',
    (result) => {
      return (
        result.code !== 0 &&
        result.stderr.includes('No repositories specified') &&
        result.stderr.includes('--products') &&
        result.stderr.includes('--repos')
      );
    }
  );

  // Test 17: audit command with --products flag (version defaults to main)
  await testCommandExecution(
    'audit',
    ['--products', 'influxdb3_core'],
    '--products flag parses correctly',
    (result) => {
      // Should attempt to run audit (may fail due to missing auditor module)
      const parsedCorrectly =
        result.stderr.includes('influxdb3_core') ||
        result.stderr.includes('Resolved products') ||
        result.stderr.includes('Using cached clone') ||
        result.stderr.includes('Running CLI audit') ||
        result.stderr.includes('Cannot find module'); // Expected - auditor not in test env
      return parsedCorrectly;
    }
  );

  // Test 18: audit --repos flag parsing
  await testCommandExecution(
    'audit',
    ['--repos', '/nonexistent/path'],
    '--repos flag parses correctly',
    (result) => {
      // Should error about path not found (parsing worked, validation caught it)
      return (
        result.code !== 0 && result.stderr.includes('Repository path not found')
      );
    }
  );

  // Test 19: audit error when no products or repos specified
  await testCommandExecution(
    'audit',
    [],
    'errors when no --products or --repos specified',
    (result) => {
      return (
        result.code !== 0 &&
        result.stderr.includes('No products or repositories specified') &&
        result.stderr.includes('--products') &&
        result.stderr.includes('--repos')
      );
    }
  );

  // Test 20: audit with invalid product key
  await testCommandExecution(
    'audit',
    ['--products', 'invalid_product'],
    'errors on invalid product key',
    (result) => {
      return (
        result.code !== 0 &&
        result.stderr.includes('Could not resolve product identifier')
      );
    }
  );

  // Summary
  console.log(colors.cyan(`\n📊 Results: ${passed}/${passed + failed} passed`));

  if (failed > 0) {
    console.log(colors.red(`\n❌ ${failed} test(s) failed\n`));
    process.exit(1);
  } else {
    console.log(colors.green('\n✅ All integration tests passed!\n'));
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error(colors.red('Test runner error:'), err);
  process.exit(1);
});
