/**
 * Essential tests for editor resolution
 *
 * Run with: node scripts/docs-cli/__tests__/editor-resolver.test.js
 */

import { resolveEditor } from '../lib/editor-resolver.js';
import process from 'node:process';

// Simple test framework
let testCount = 0;
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  testCount++;
  try {
    fn();
    passCount++;
    console.log(`✅ ${name}`);
  } catch (error) {
    failCount++;
    console.log(`❌ ${name}`);
    console.log(`   ${error.message}`);
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertThrows(fn, expectedMessage) {
  try {
    fn();
    throw new Error('Expected function to throw');
  } catch (error) {
    if (expectedMessage && !error.message.includes(expectedMessage)) {
      throw new Error(
        `Expected error message to include "${expectedMessage}", got "${error.message}"`
      );
    }
  }
}

// Save original env
const originalEnv = { ...process.env };

console.log('\n🧪 Testing Editor Resolver\n');

// Test 1: Explicit --editor flag has priority
delete process.env.DOCS_EDITOR;
delete process.env.VISUAL;
process.env.EDITOR = 'nano';
test('Uses explicit --editor flag first', () => {
  // Assuming vi exists on the system
  const result = resolveEditor({ editor: 'vi' });
  assertEquals(result, 'vi');
});

// Test 2: Falls back to DOCS_EDITOR
delete process.env.VISUAL;
process.env.DOCS_EDITOR = 'vi';
process.env.EDITOR = 'nano';
test('Falls back to DOCS_EDITOR', () => {
  const result = resolveEditor();
  assertEquals(result, 'vi');
});

// Test 3: Falls back to EDITOR
delete process.env.DOCS_EDITOR;
delete process.env.VISUAL;
process.env.EDITOR = 'vi';
test('Falls back to EDITOR', () => {
  const result = resolveEditor();
  assertEquals(result, 'vi');
});

// Test 4: Handles compound commands with arguments
process.env.EDITOR = 'vi';
test('Handles compound commands with arguments', () => {
  const result = resolveEditor({ editor: 'vi --wait' });
  assertEquals(result, 'vi --wait');
});

// Restore environment
process.env = originalEnv;

// Summary
console.log(`\n📊 Results: ${passCount}/${testCount} passed`);
if (failCount > 0) {
  console.log(`❌ ${failCount} test(s) failed\n`);
  process.exit(1);
} else {
  console.log(`✅ All tests passed!\n`);
  process.exit(0);
}
