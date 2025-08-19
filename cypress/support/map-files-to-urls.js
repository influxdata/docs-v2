#!/usr/bin/env node

import process from 'process';
import fs from 'fs';
import { execSync } from 'child_process';
import matter from 'gray-matter';
import { filePathToUrl } from '../../.github/scripts/utils/url-transformer.js';

// Get file paths from command line arguments
const filePaths = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

// Parse options
const debugMode = process.argv.includes('--debug'); // deprecated, no longer used
const jsonMode = process.argv.includes('--json');

// Separate shared content files and regular content files
const sharedContentFiles = filePaths.filter(
  (file) =>
    file.startsWith('content/shared/') &&
    (file.endsWith('.md') || file.endsWith('.html'))
);

const regularContentFiles = filePaths.filter(
  (file) =>
    file.startsWith('content/') &&
    !file.startsWith('content/shared/') &&
    (file.endsWith('.md') || file.endsWith('.html'))
);

// Find pages that reference shared content files in their frontmatter
function findPagesReferencingSharedContent(sharedFilePath) {
  try {
    // Remove the leading "content/" to match how it would appear in frontmatter
    const relativePath = sharedFilePath.replace(/^content\//, '');

    // Use grep to find files that reference this shared content in frontmatter
    // Look for source: <path> pattern in YAML frontmatter
    const grepCmd = `grep -l "source: .*${relativePath}" --include="*.md" --include="*.html" -r content/`;

    // Execute grep command and parse results
    const result = execSync(grepCmd, { encoding: 'utf8' }).trim();

    if (!result) {
      return [];
    }

    return result.split('\n').filter(Boolean);
  } catch (error) {
    // grep returns non-zero exit code when no matches are found
    if (error.status === 1) {
      return [];
    }
    console.error(
      `Error finding references to ${sharedFilePath}: ${error.message}`
    );
    return [];
  }
}

/**
 * Extract source from frontmatter or use the file path as source
 * @param {string} filePath - Path to the file
 * @returns {string} Source path
 */
function extractSourceFromFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);

      // If source is specified in frontmatter, return it
      if (data.source) {
        if (data.source.startsWith('/shared')) {
          return 'content' + data.source;
        }
        return data.source;
      }
    }

    // If no source in frontmatter or can't read file, use the file path itself
    return filePath;
  } catch (error) {
    console.error(`Error extracting source from ${filePath}: ${error.message}`);
    return filePath;
  }
}

// Process shared content files to find pages that reference them
let pagesToTest = [...regularContentFiles];

if (sharedContentFiles.length > 0) {
  console.log(
    `Processing ${sharedContentFiles.length} shared content files...`
  );

  for (const sharedFile of sharedContentFiles) {
    const referencingPages = findPagesReferencingSharedContent(sharedFile);

    if (referencingPages.length > 0) {
      console.log(
        `Found ${referencingPages.length} pages referencing ${sharedFile}`
      );
      // Add referencing pages to the list of pages to test (avoid duplicates)
      pagesToTest = [...new Set([...pagesToTest, ...referencingPages])];
    } else {
      console.log(`No pages found referencing ${sharedFile}`);
    }
  }
}

if (pagesToTest.length === 0) {
  console.log('No content files to map.');
  process.exit(0);
}

// Map file paths to URL paths and source information
function mapFilePathToUrlAndSource(filePath) {
  // Map to URL using shared utility
  const url = filePathToUrl(filePath);

  // Extract source
  const source = extractSourceFromFile(filePath);

  return { url, source };
}

const mappedFiles = pagesToTest.map(mapFilePathToUrlAndSource);

if (jsonMode) {
  console.log(JSON.stringify(mappedFiles, null, 2));
} else {
  // Print URL and source info in a format that's easy to parse
  mappedFiles.forEach((item) => console.log(`${item.url}|${item.source}`));
}
