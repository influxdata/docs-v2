/**
 * Tests for product resolver module
 *
 * Run with: node scripts/docs-cli/__tests__/product-resolver.test.js
 */

import {
  resolveProduct,
  resolveProducts,
  getValidProductKeys,
  getContentPath,
  getProductInfo,
  validateMutualExclusion,
} from '../lib/product-resolver.js';

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
    throw new Error(message || `Expected "${expected}", got "${actual}"`);
  }
}

function assertDeepEquals(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(message || `Expected ${expectedStr}, got ${actualStr}`);
  }
}

function assertThrows(fn, expectedMessage) {
  try {
    fn();
    throw new Error('Expected function to throw');
  } catch (error) {
    if (error.message === 'Expected function to throw') {
      throw error;
    }
    if (expectedMessage && !error.message.includes(expectedMessage)) {
      throw new Error(
        `Expected error message to include "${expectedMessage}", got "${error.message}"`
      );
    }
  }
}

function assertIncludes(arr, value, message) {
  if (!arr.includes(value)) {
    throw new Error(message || `Expected array to include "${value}"`);
  }
}

console.log('\n🧪 Testing Product Resolver\n');

// ============================================
// resolveProduct() tests
// ============================================

console.log('--- resolveProduct() ---\n');

test('Resolves exact product key: influxdb3_core', () => {
  const result = resolveProduct('influxdb3_core');
  assertEquals(result.key, 'influxdb3_core');
  assertEquals(result.contentPath, 'influxdb3/core');
});

test('Resolves exact product key: influxdb3_enterprise', () => {
  const result = resolveProduct('influxdb3_enterprise');
  assertEquals(result.key, 'influxdb3_enterprise');
  assertEquals(result.contentPath, 'influxdb3/enterprise');
});

test('Resolves exact product key: telegraf', () => {
  const result = resolveProduct('telegraf');
  assertEquals(result.key, 'telegraf');
  assertEquals(result.contentPath, 'telegraf');
});

test('Resolves content path with leading slash: /influxdb3/core', () => {
  const result = resolveProduct('/influxdb3/core');
  assertEquals(result.key, 'influxdb3_core');
  assertEquals(result.contentPath, 'influxdb3/core');
});

test('Resolves content path without leading slash: influxdb3/core', () => {
  const result = resolveProduct('influxdb3/core');
  assertEquals(result.key, 'influxdb3_core');
  assertEquals(result.contentPath, 'influxdb3/core');
});

test('Resolves content path with trailing slash: /influxdb3/core/', () => {
  const result = resolveProduct('/influxdb3/core/');
  assertEquals(result.key, 'influxdb3_core');
  assertEquals(result.contentPath, 'influxdb3/core');
});

test('Resolves content path with content/ prefix: content/influxdb3/core', () => {
  const result = resolveProduct('content/influxdb3/core');
  assertEquals(result.key, 'influxdb3_core');
  assertEquals(result.contentPath, 'influxdb3/core');
});

test('Resolves deep content path: /influxdb3/core/admin/databases/', () => {
  const result = resolveProduct('/influxdb3/core/admin/databases/');
  assertEquals(result.key, 'influxdb3_core');
  assertEquals(result.contentPath, 'influxdb3/core');
});

test('Resolves URL: https://docs.influxdata.com/influxdb3/core/admin/', () => {
  const result = resolveProduct(
    'https://docs.influxdata.com/influxdb3/core/admin/'
  );
  assertEquals(result.key, 'influxdb3_core');
  assertEquals(result.contentPath, 'influxdb3/core');
});

test('Resolves telegraf with version in path: /telegraf/v1.33/', () => {
  const result = resolveProduct('/telegraf/v1.33/');
  assertEquals(result.key, 'telegraf');
  assertEquals(result.contentPath, 'telegraf');
});

test('Resolves influxdb3/enterprise path', () => {
  const result = resolveProduct('/influxdb3/enterprise');
  assertEquals(result.key, 'influxdb3_enterprise');
  assertEquals(result.contentPath, 'influxdb3/enterprise');
});

test('Resolves influxdb3/cloud-serverless path', () => {
  const result = resolveProduct('/influxdb3/cloud-serverless');
  assertEquals(result.key, 'influxdb3_cloud_serverless');
  assertEquals(result.contentPath, 'influxdb3/cloud-serverless');
});

test('Throws on unknown product identifier', () => {
  assertThrows(
    () => resolveProduct('unknown_product'),
    'Could not resolve product identifier'
  );
});

test('Throws on empty input', () => {
  assertThrows(() => resolveProduct(''), 'Product identifier is required');
});

test('Throws on null input', () => {
  assertThrows(() => resolveProduct(null), 'Product identifier is required');
});

test('Error message includes suggestions for similar products', () => {
  try {
    resolveProduct('influxdb');
  } catch (error) {
    assertIncludes(
      error.message,
      'Did you mean',
      'Error should include suggestions'
    );
  }
});

// ============================================
// resolveProducts() tests
// ============================================

console.log('\n--- resolveProducts() ---\n');

test('Resolves single product key', () => {
  const result = resolveProducts('influxdb3_core');
  assertEquals(result.length, 1);
  assertEquals(result[0].key, 'influxdb3_core');
});

test('Resolves comma-separated product keys', () => {
  const result = resolveProducts('influxdb3_core,influxdb3_enterprise');
  assertEquals(result.length, 2);
  assertEquals(result[0].key, 'influxdb3_core');
  assertEquals(result[1].key, 'influxdb3_enterprise');
});

test('Resolves comma-separated paths', () => {
  const result = resolveProducts('/influxdb3/core,/influxdb3/enterprise');
  assertEquals(result.length, 2);
  assertEquals(result[0].key, 'influxdb3_core');
  assertEquals(result[1].key, 'influxdb3_enterprise');
});

test('Resolves mixed keys and paths', () => {
  const result = resolveProducts('influxdb3_core,/influxdb3/enterprise');
  assertEquals(result.length, 2);
  assertEquals(result[0].key, 'influxdb3_core');
  assertEquals(result[1].key, 'influxdb3_enterprise');
});

test('Handles whitespace around commas', () => {
  const result = resolveProducts('influxdb3_core , influxdb3_enterprise');
  assertEquals(result.length, 2);
  assertEquals(result[0].key, 'influxdb3_core');
  assertEquals(result[1].key, 'influxdb3_enterprise');
});

test('Throws on empty input', () => {
  assertThrows(() => resolveProducts(''), 'Product identifiers are required');
});

// ============================================
// getValidProductKeys() tests
// ============================================

console.log('\n--- getValidProductKeys() ---\n');

test('Returns a Set of valid product keys', () => {
  const keys = getValidProductKeys();
  assertEquals(keys instanceof Set, true);
  assertEquals(keys.has('influxdb3_core'), true);
  assertEquals(keys.has('influxdb3_enterprise'), true);
  assertEquals(keys.has('telegraf'), true);
});

// ============================================
// getContentPath() tests
// ============================================

console.log('\n--- getContentPath() ---\n');

test('Returns content path for known product key', () => {
  const path = getContentPath('influxdb3_core');
  assertEquals(path, 'influxdb3/core');
});

test('Returns null for unknown product key', () => {
  const path = getContentPath('unknown_product');
  assertEquals(path, null);
});

// ============================================
// getProductInfo() tests
// ============================================

console.log('\n--- getProductInfo() ---\n');

test('Returns product info for known product key', () => {
  const info = getProductInfo('influxdb3_core');
  assertEquals(info.key, 'influxdb3_core');
  assertEquals(info.contentPath, 'influxdb3/core');
  assertEquals(typeof info.description, 'string');
});

test('Returns null for unknown product key', () => {
  const info = getProductInfo('unknown_product');
  assertEquals(info, null);
});

// ============================================
// validateMutualExclusion() tests
// ============================================

console.log('\n--- validateMutualExclusion() ---\n');

test('Does not exit when only products provided', () => {
  // Should not throw or exit
  validateMutualExclusion({ products: 'influxdb3_core', repos: null });
});

test('Does not exit when only repos provided', () => {
  // Should not throw or exit
  validateMutualExclusion({ products: null, repos: '/path/to/repo' });
});

test('Does not exit when neither provided', () => {
  // Should not throw or exit
  validateMutualExclusion({ products: null, repos: null });
});

// Note: We can't easily test process.exit() in this simple framework
// In a real test framework, we'd mock process.exit

// ============================================
// Summary
// ============================================

console.log(`\n📊 Results: ${passCount}/${testCount} passed`);
if (failCount > 0) {
  console.log(`❌ ${failCount} test(s) failed\n`);
  process.exit(1);
} else {
  console.log(`✅ All tests passed!\n`);
  process.exit(0);
}
