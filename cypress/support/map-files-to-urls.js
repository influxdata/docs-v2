#!/usr/bin/env node

import process from 'process';
import fs from 'fs';
import matter from 'gray-matter';
import { filePathToUrl } from '../../.github/scripts/utils/url-transformer.js';
import {
  findPagesReferencingSharedContent,
  categorizeContentFiles,
} from '../../scripts/lib/content-utils.js';

// Get file paths from command line arguments
const filePaths = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

// Parse options
const jsonMode = process.argv.includes('--json');

// Separate shared content files and regular content files
const { shared: sharedContentFiles, regular: regularContentFiles } =
  categorizeContentFiles(filePaths);

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
