/**
 * Helper functions for debugging without source maps
 * Example usage:
 * In your code, you can use these functions like this:
 * ```javascript
 * import { debugLog, debugBreak, debugInspect } from './debug-helpers.js';
 *
 * const data = debugInspect(someData, 'Data');
 * debugLog('Processing data', 'myFunction');
 *
 * function processData() {
 *   // Add a breakpoint that works with DevTools
 *   debugBreak();
 *
 *   // Your existing code...
 * }
 * ```
 *
 * @fileoverview DEVELOPMENT USE ONLY - Functions should not be committed to production
 */

/* eslint-disable no-debugger */
/* eslint-disable-next-line */
// NOTE: These functions are detected by ESLint rules to prevent committing debug code

export function debugLog(message, context = '') {
  const contextStr = context ? `[${context}]` : '';
  console.log(`DEBUG${contextStr}: ${message}`);
}

export function debugBreak() {
  debugger;
}

export function debugInspect(value, label = 'Inspect') {
  console.log(`DEBUG[${label}]:`, value);
  return value;
}
