/**
 * Essential tests for process management
 *
 * Run with: node scripts/__tests__/process-manager.test.js
 */

import { shouldWait } from '../lib/process-manager.js';

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
    throw new Error(
      message || `Expected ${expected}, got ${actual}`
    );
  }
}

console.log('\n🧪 Testing Process Manager\n');

// Test default behavior
test('Returns false by default (non-blocking)', () => {
  assertEquals(shouldWait(undefined), false);
});

test('Returns true when --wait flag is set', () => {
  assertEquals(shouldWait(true), true);
});

test('Returns false when --wait=false explicitly', () => {
  assertEquals(shouldWait(false), false);
});

// Summary
console.log(`\n📊 Results: ${passCount}/${testCount} passed`);
if (failCount > 0) {
  console.log(`❌ ${failCount} test(s) failed\n`);
  process.exit(1);
} else {
  console.log(`✅ All tests passed!\n`);
  console.log('Note: Spawn behavior should be tested manually:');
  console.log('  docs edit /some/url --list');
  console.log('  docs edit /some/url --wait --editor echo');
  console.log('');
  process.exit(0);
}
