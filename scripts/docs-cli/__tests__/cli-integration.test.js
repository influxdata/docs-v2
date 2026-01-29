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
      cwd: join(__dirname, '..', '..', '..'),  // repo root
      timeout: options.timeout || 10000,
      env: { ...process.env, ...options.env },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => { stdout += data.toString(); });
    proc.stderr.on('data', (data) => { stderr += data.toString(); });

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
  test('unknown command: returns error message',
    unknownResult.code !== 0 &&
    unknownResult.stderr.includes('Unknown command'));

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
        // Should either succeed or fail gracefully (not with import errors)
        const hasImportError = result.stderr.includes('Cannot find module') ||
                               result.stderr.includes('ERR_MODULE_NOT_FOUND');
        if (hasImportError) {
          console.log(colors.red('   Import error detected - bad module path!'));
          return false;
        }
        return true;
      }
    );
  } finally {
    // Cleanup
    try { unlinkSync(tempDraft); } catch {}
    try { rmdirSync(tempDir); } catch {}
  }

  // Test 10: Edit command actually executes
  await testCommandExecution(
    'edit',
    ['/influxdb3/core/get-started/', '--list'],
    'executes with URL (list mode)',
    (result) => {
      const hasImportError = result.stderr.includes('Cannot find module') ||
                             result.stderr.includes('ERR_MODULE_NOT_FOUND');
      if (hasImportError) {
        console.log(colors.red('   Import error detected - bad module path!'));
        return false;
      }
      // Should find files or report not found - either is fine
      return true;
    }
  );

  // Test 11: Placeholders command actually executes
  await testCommandExecution(
    'placeholders',
    ['--dry', 'nonexistent-file.md'],
    'executes with dry-run (handles missing file gracefully)',
    (result) => {
      const hasImportError = result.stderr.includes('Cannot find module') ||
                             result.stderr.includes('ERR_MODULE_NOT_FOUND');
      if (hasImportError) {
        console.log(colors.red('   Import error detected - bad module path!'));
        return false;
      }
      return true;
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
