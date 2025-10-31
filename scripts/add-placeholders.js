#!/usr/bin/env node

/**
 * Add placeholder syntax to code blocks
 *
 * This script finds UPPERCASE placeholders in code blocks and:
 * 1. Adds `{ placeholders="PATTERN1|PATTERN2" }` attribute to code blocks
 * 2. Wraps placeholder descriptions with `{{% code-placeholder-key %}}`
 *
 * Usage:
 *   node scripts/add-placeholders.js <file.md>
 *   node scripts/add-placeholders.js content/influxdb3/enterprise/admin/upgrade.md
 */

import { readFileSync, writeFileSync } from 'fs';
import { parseArgs } from 'node:util';

// Parse command-line arguments
const { positionals } = parseArgs({
  allowPositionals: true,
  options: {
    dry: {
      type: 'boolean',
      short: 'd',
      default: false,
    },
  },
});

if (positionals.length === 0) {
  console.error('Usage: node scripts/add-placeholders.js <file.md> [--dry]');
  console.error(
    'Example: node scripts/add-placeholders.js content/influxdb3/enterprise/admin/upgrade.md'
  );
  process.exit(1);
}

const filePath = positionals[0];
const isDryRun = process.argv.includes('--dry') || process.argv.includes('-d');

/**
 * Extract UPPERCASE placeholders from a code block
 * @param {string} code - Code block content
 * @returns {string[]} Array of unique placeholders
 */
function extractPlaceholders(code) {
  // Match UPPERCASE words (at least 2 chars, can include underscores)
  const placeholderPattern = /\b[A-Z][A-Z0-9_]{1,}\b/g;
  const matches = code.match(placeholderPattern) || [];

  // Remove duplicates and common words that aren't placeholders
  const excludeWords = new Set([
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'HEAD',
    'OPTIONS',
    'HTTP',
    'HTTPS',
    'URL',
    'API',
    'CLI',
    'JSON',
    'YAML',
    'TOML',
    'SELECT',
    'FROM',
    'WHERE',
    'AND',
    'OR',
    'NOT',
    'NULL',
    'TRUE',
    'FALSE',
    'ERROR',
    'WARNING',
    'INFO',
    'DEBUG',
  ]);

  return [...new Set(matches)].filter((word) => !excludeWords.has(word)).sort();
}

/**
 * Add placeholders attribute to a code block
 * @param {string} codeBlock - Code block with fence
 * @param {string} indent - Leading whitespace from fence line
 * @returns {string} Code block with placeholders attribute
 */
function addPlaceholdersAttribute(codeBlock, indent = '') {
  const lines = codeBlock.split('\n');
  const fenceLine = lines[0];
  const codeContent = lines.slice(1, -1).join('\n');

  // Check if already has placeholders attribute
  if (fenceLine.includes('placeholders=')) {
    return codeBlock;
  }

  // Extract placeholders from code
  const placeholders = extractPlaceholders(codeContent);

  if (placeholders.length === 0) {
    return codeBlock;
  }

  // Extract language from fence (handle indented fences)
  const langMatch = fenceLine.match(/^\s*```(\w+)?/);
  const lang = langMatch && langMatch[1] ? langMatch[1] : '';

  // Build new fence line with placeholders attribute
  const placeholdersStr = placeholders.join('|');
  const newFenceLine = lang
    ? `${indent}\`\`\`${lang} { placeholders="${placeholdersStr}" }`
    : `${indent}\`\`\` { placeholders="${placeholdersStr}" }`;

  return [newFenceLine, ...lines.slice(1)].join('\n');
}

/**
 * Wrap placeholder descriptions with code-placeholder-key shortcode
 * @param {string} line - Line potentially containing placeholder description
 * @returns {string} Line with shortcode wrapper if placeholder found
 */
function wrapPlaceholderDescription(line) {
  // Match patterns like "- **`PLACEHOLDER`**: description" or "   - **`PLACEHOLDER`**: description"
  const pattern = /^(\s*-\s*)\*\*`([A-Z][A-Z0-9_]+)`\*\*(:\s*)/;
  const match = line.match(pattern);

  if (!match) {
    return line;
  }

  // Check if already wrapped
  if (line.includes('{{% code-placeholder-key %}}')) {
    return line;
  }

  const prefix = match[1];
  const placeholder = match[2];
  const suffix = match[3];
  const description = line.substring(match[0].length);

  return `${prefix}{{% code-placeholder-key %}}\`${placeholder}\`{{% /code-placeholder-key %}}${suffix}${description}`;
}

/**
 * Process markdown content
 * @param {string} content - Markdown content
 * @returns {string} Processed content
 */
function processMarkdown(content) {
  const lines = content.split('\n');
  const result = [];
  let inCodeBlock = false;
  let codeBlockLines = [];
  let inReplaceSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track "Replace the following:" sections
    if (line.trim().match(/^Replace the following:?$/i)) {
      inReplaceSection = true;
      result.push(line);
      continue;
    }

    // Exit replace section on non-list-item line (but allow empty lines within list)
    if (
      inReplaceSection &&
      line.trim() !== '' &&
      !line.trim().startsWith('-') &&
      !line.match(/^#{1,6}\s/)
    ) {
      inReplaceSection = false;
    }

    // Handle code blocks (including indented)
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        codeBlockLines = [line];
      } else {
        // End of code block
        codeBlockLines.push(line);
        const codeBlock = codeBlockLines.join('\n');
        const indent = line.match(/^(\s*)/)[1];
        const processedBlock = addPlaceholdersAttribute(codeBlock, indent);
        result.push(processedBlock);
        inCodeBlock = false;
        codeBlockLines = [];
      }
    } else if (inCodeBlock) {
      // Inside code block
      codeBlockLines.push(line);
    } else if (inReplaceSection) {
      // Process placeholder descriptions
      result.push(wrapPlaceholderDescription(line));
    } else {
      // Regular line
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Main function
 */
function main() {
  try {
    // Read file
    const content = readFileSync(filePath, 'utf-8');

    // Process content
    const processedContent = processMarkdown(content);

    if (isDryRun) {
      console.log('=== DRY RUN - Changes that would be made ===\n');
      console.log(processedContent);
    } else {
      // Write back to file
      writeFileSync(filePath, processedContent, 'utf-8');
      console.log(`✓ Updated ${filePath}`);
      console.log('Added placeholder syntax to code blocks and descriptions');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
