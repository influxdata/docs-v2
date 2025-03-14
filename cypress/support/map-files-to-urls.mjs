#!/usr/bin/env node

import { execSync } from 'child_process';
import process from 'process';

// Get file paths from command line arguments
const filePaths = process.argv.slice(2);

// Parse options
const debugMode = process.argv.includes('--debug');

// Filter for content files
const contentFiles = filePaths.filter(file => 
  file.startsWith('content/') && (file.endsWith('.md') || file.endsWith('.html'))
);

if (contentFiles.length === 0) {
  console.log('No content files to check.');
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

const urls = contentFiles.map(mapFilePathToUrl);
const urlList = urls.join(',');

console.log(`Testing links in URLs: ${urlList}`);

// Create environment object with the cypress_test_subjects variable
const envVars = {
  ...process.env,
  cypress_test_subjects: urlList,
  NODE_OPTIONS: '--max-http-header-size=80000 --max-old-space-size=4096'
};

// Run Cypress tests with the mapped URLs
try {
  // Choose run mode based on debug flag
  if (debugMode) {
    // For debug mode, set the environment variable and open Cypress
    // The user will need to manually select the test file
    console.log('Opening Cypress in debug mode.');
    console.log('Please select the "article-links.cy.js" test file when Cypress opens.');
    
    execSync('npx cypress open --e2e', {
      stdio: 'inherit',
      env: envVars
    });
  } else {
    // For normal mode, run the test automatically
    execSync(`npx cypress run --spec "cypress/e2e/content/article-links.cy.js"`, {
      stdio: 'inherit',
      env: envVars
    });
  }
} catch (error) {
  console.error('Link check failed');
  process.exit(1);
}