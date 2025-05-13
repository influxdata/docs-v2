#!/usr/bin/env node

import process from 'process';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Get file paths from command line arguments
const filePaths = process.argv.slice(2).filter(arg => !arg.startsWith('--'));

// Parse options
const debugMode = process.argv.includes('--debug'); // deprecated, no longer used
const jsonMode = process.argv.includes('--json');

// Separate shared content files and regular content files
const sharedContentFiles = filePaths.filter(file => 
  file.startsWith('content/shared/') && 
  (file.endsWith('.md') || file.endsWith('.html'))
);

const regularContentFiles = filePaths.filter(file => 
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
    console.error(`Error finding references to ${sharedFilePath}: ${error.message}`);
    return [];
  }
}

// Process shared content files to find pages that reference them
let pagesToTest = [...regularContentFiles];

if (sharedContentFiles.length > 0) {
  console.log(`Processing ${sharedContentFiles.length} shared content files...`);
  
  for (const sharedFile of sharedContentFiles) {
    const referencingPages = findPagesReferencingSharedContent(sharedFile);
    
    if (referencingPages.length > 0) {
      console.log(`Found ${referencingPages.length} pages referencing ${sharedFile}`);
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

// Map file paths to URL paths
function mapFilePathToUrl(filePath) {
  // Remove content/ prefix
  let url = filePath.replace(/^content/, '');
  // Handle _index files (both .html and .md)
  url = url.replace(/\/_index\.(html|md)$/, '/');
  // Handle regular .md files
  url = url.replace(/\.md$/, '/');
  // Handle regular .html files
  url = url.replace(/\.html$/, '/');
  // Ensure URL starts with a slash
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  return url;
}

const urls = pagesToTest.map(mapFilePathToUrl);

if (jsonMode) {
  console.log(JSON.stringify(urls, null, 2));
} else {
  // Print one URL per line (easy for piping to xargs, etc.)
  urls.forEach(url => console.log(url));
}