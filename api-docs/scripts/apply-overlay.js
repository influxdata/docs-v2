#!/usr/bin/env node
/**
 * Apply OpenAPI Overlay to Base Spec
 *
 * Implements a subset of the OpenAPI Overlay Specification v1.0.0
 * to merge product-specific overlays onto a shared base spec.
 *
 * Supported overlay actions:
 * - target: $.info.title (update info title)
 * - target: $.info.description (update info description)
 * - target: $.servers[0].description (update server description)
 * - target: $.servers[0].variables.*.description (update variable description)
 * - target: $.paths['/path'].method (add/update operation)
 * - target: $.paths['/path'] (add entire path)
 *
 * Usage:
 *   node apply-overlay.js <base.yml> <overlay.yml> -o <output.yml>
 *
 * @module apply-overlay
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

/**
 * Parse a JSONPath-like target string
 * @param {string} target - JSONPath expression (e.g., "$.info.title")
 * @returns {string[]} - Path segments
 */
function parseTarget(target) {
  // Remove leading $. and split by . or bracket notation
  const cleaned = target.replace(/^\$\.?/, '');
  const segments = [];
  let current = '';
  let inBracket = false;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === '[' && !inBracket) {
      if (current) segments.push(current);
      current = '';
      inBracket = true;
    } else if (char === ']' && inBracket) {
      // Remove quotes from bracket content
      segments.push(current.replace(/^['"]|['"]$/g, ''));
      current = '';
      inBracket = false;
    } else if (char === '.' && !inBracket) {
      if (current) segments.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) segments.push(current);

  return segments;
}

/**
 * Get a value from an object using path segments
 * @param {object} obj - Source object
 * @param {string[]} segments - Path segments
 * @returns {*} - Value at path
 */
function getPath(obj, segments) {
  let current = obj;
  for (const segment of segments) {
    if (current === undefined || current === null) return undefined;
    // Handle array index
    if (/^\d+$/.test(segment)) {
      current = current[parseInt(segment, 10)];
    } else {
      current = current[segment];
    }
  }
  return current;
}

/**
 * Set a value in an object using path segments
 * @param {object} obj - Target object
 * @param {string[]} segments - Path segments
 * @param {*} value - Value to set
 */
function setPath(obj, segments, value) {
  let current = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    const nextSegment = segments[i + 1];

    // Handle array index
    if (/^\d+$/.test(segment)) {
      const idx = parseInt(segment, 10);
      if (current[idx] === undefined) {
        current[idx] = /^\d+$/.test(nextSegment) ? [] : {};
      }
      current = current[idx];
    } else {
      if (current[segment] === undefined) {
        current[segment] = /^\d+$/.test(nextSegment) ? [] : {};
      }
      current = current[segment];
    }
  }

  const lastSegment = segments[segments.length - 1];
  if (/^\d+$/.test(lastSegment)) {
    current[parseInt(lastSegment, 10)] = value;
  } else {
    current[lastSegment] = value;
  }
}

/**
 * Deep merge two objects
 * @param {object} target - Target object
 * @param {object} source - Source object to merge
 * @returns {object} - Merged object
 */
function deepMerge(target, source) {
  if (typeof source !== 'object' || source === null) {
    return source;
  }
  if (typeof target !== 'object' || target === null) {
    return source;
  }

  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * Apply overlay actions to base spec
 * @param {object} base - Base OpenAPI spec
 * @param {object} overlay - Overlay spec with actions
 * @returns {object} - Merged spec
 */
function applyOverlay(base, overlay) {
  const result = JSON.parse(JSON.stringify(base)); // Deep clone

  if (!overlay.actions || !Array.isArray(overlay.actions)) {
    console.warn('Warning: No actions found in overlay');
    return result;
  }

  for (const action of overlay.actions) {
    if (!action.target) {
      console.warn('Warning: Action missing target, skipping');
      continue;
    }

    const segments = parseTarget(action.target);

    if (action.update !== undefined) {
      // Get existing value at path
      const existing = getPath(result, segments);

      if (
        existing !== undefined &&
        typeof existing === 'object' &&
        typeof action.update === 'object'
      ) {
        // Merge objects
        setPath(result, segments, deepMerge(existing, action.update));
      } else {
        // Replace value
        setPath(result, segments, action.update);
      }

      console.log(`Applied: ${action.target}`);
    } else if (action.remove === true) {
      // Remove is not implemented yet
      console.warn(
        `Warning: remove action not implemented for ${action.target}`
      );
    }
  }

  return result;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let baseFile = null;
  let overlayFile = null;
  let outputFile = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-o' || args[i] === '--output') {
      outputFile = args[++i];
    } else if (!baseFile) {
      baseFile = args[i];
    } else if (!overlayFile) {
      overlayFile = args[i];
    }
  }

  if (!baseFile || !overlayFile) {
    console.error(
      'Usage: node apply-overlay.js <base.yml> <overlay.yml> -o <output.yml>'
    );
    process.exit(1);
  }

  // Read files
  console.log(`Base: ${baseFile}`);
  console.log(`Overlay: ${overlayFile}`);

  const baseContent = fs.readFileSync(baseFile, 'utf8');
  const overlayContent = fs.readFileSync(overlayFile, 'utf8');

  const base = yaml.load(baseContent);
  const overlay = yaml.load(overlayContent);

  // Apply overlay
  const result = applyOverlay(base, overlay);

  // Output
  const outputYaml = yaml.dump(result, {
    lineWidth: -1, // Don't wrap lines
    noRefs: true, // Don't use YAML references
    quotingType: "'",
    forceQuotes: false,
  });

  if (outputFile) {
    fs.writeFileSync(outputFile, outputYaml);
    console.log(`Output: ${outputFile}`);
  } else {
    console.log(outputYaml);
  }
}

main();
