#!/usr/bin/env node

// Script: run-e2e-specs.mjs
// Purpose: Map file paths to URLs, start Hugo, run Cypress tests (specifiable), handle errors.

import { spawn } from 'child_process';
import process from 'process';
import fs from 'fs';
import path from 'path';
import cypress from 'cypress';
import http from 'http';

const MAP_SCRIPT = path.resolve('cypress/support/map-files-to-urls.mjs');
const URLS_FILE = '/tmp/test_subjects.txt';
const HUGO_PORT = 1315;
const HUGO_LOG_FILE = '/tmp/hugo_server.log';
const BROKEN_LINKS_FILE = '/tmp/broken_links_report.json';

function parseArgs(argv) {
  const fileArgs = [];
  const specArgs = [];
  let i = 2;
  while (i < argv.length) {
    if (argv[i] === '--spec') {
      i++;
      if (i < argv.length) {
        specArgs.push(argv[i]);
        i++;
      }
    } else {
      fileArgs.push(argv[i]);
      i++;
    }
  }
  return { fileArgs, specArgs };
}

// Check if Hugo server is responsive
async function waitForHugoReady(timeoutMs = 30000) {
  console.log(`Waiting for Hugo server to be ready on http://localhost:${HUGO_PORT}...`);
  
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    // Poll the server
    function checkServer() {
      const req = http.get(`http://localhost:${HUGO_PORT}`, (res) => {
        if (res.statusCode === 200) {
          console.log(`Hugo server is responding with 200 OK on port ${HUGO_PORT}`);
          resolve();
        } else {
          // If we get a response but not 200, try again after delay
          const elapsed = Date.now() - startTime;
          if (elapsed > timeoutMs) {
            reject(new Error(`Hugo server responded with status ${res.statusCode} after timeout`));
          } else {
            console.log(`Hugo server responded with ${res.statusCode}, retrying...`);
            setTimeout(checkServer, 1000);
          }
        }
      });
      
      req.on('error', (err) => {
        // Connection errors are expected while server is starting
        const elapsed = Date.now() - startTime;
        if (elapsed > timeoutMs) {
          reject(new Error(`Timed out waiting for Hugo server: ${err.message}`));
        } else {
          // Try again after a delay
          setTimeout(checkServer, 1000);
        }
      });
      
      req.end();
    }
    
    // Start polling
    checkServer();
  });
}

async function main() {
  // Keep track of processes to cleanly shut down
  let hugoProc = null;
  let exitCode = 0;
  
  // Add this signal handler to ensure cleanup on unexpected termination
  const cleanupAndExit = (code = 1) => {
    console.log(`Performing cleanup before exit with code ${code}...`);
    if (hugoProc) {
      try {
        hugoProc.kill('SIGKILL'); // Use SIGKILL to ensure immediate termination
      } catch (err) {
        console.error(`Error killing Hugo process: ${err.message}`);
      }
    }
    process.exit(code);
  };
  
  // Handle various termination signals
  process.on('SIGINT', () => cleanupAndExit(1));
  process.on('SIGTERM', () => cleanupAndExit(1));
  process.on('uncaughtException', (err) => {
    console.error(`Uncaught exception: ${err.message}`);
    cleanupAndExit(1);
  });

  const { fileArgs, specArgs } = parseArgs(process.argv);
  if (fileArgs.length === 0) {
    console.error('No file paths provided.');
    process.exit(1);
  }

  // 1. Map file paths to URLs and write to file
  const mapProc = spawn('node', [MAP_SCRIPT, ...fileArgs], { stdio: ['ignore', 'pipe', 'inherit'] });
  const urls = [];
  mapProc.stdout.on('data', (chunk) => {
    urls.push(chunk.toString());
  });
  await new Promise((res) => mapProc.on('close', res));
  const urlList = urls.join('').split('\n').map(s => s.trim()).filter(Boolean);
  if (urlList.length === 0) {
    console.log('No URLs to test.');
    process.exit(0);
  }
  fs.writeFileSync(URLS_FILE, urlList.join(','));

  // 2. Start Hugo server with output redirected to log file
  console.log(`Starting Hugo server (logs will be written to ${HUGO_LOG_FILE})...`);
  
  // Create or clear the log file
  fs.writeFileSync(HUGO_LOG_FILE, '');
  
  // Use shell to ensure proper process spawning
  hugoProc = spawn('yarn', ['run', 'hugo', 'server', 
    '--config', 'hugo.testing.yml', 
    '--port', String(HUGO_PORT), 
    '--buildDrafts',
    '--noHTTPCache'], { 
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true, // Use shell to ensure proper startup
    detached: false // Don't detach for better process management
  });

  // Redirect Hugo output to the log file and console
  hugoProc.stdout.on('data', (data) => {
    const output = data.toString();
    fs.appendFileSync(HUGO_LOG_FILE, output);
    process.stdout.write(`Hugo: ${output}`);
  });
  
  hugoProc.stderr.on('data', (data) => {
    const output = data.toString();
    fs.appendFileSync(HUGO_LOG_FILE, output);
    process.stderr.write(`Hugo ERROR: ${output}`);
  });

  // Monitor Hugo process for early exit
  hugoProc.on('error', (err) => {
    console.error(`Failed to start Hugo process: ${err.message}`);
    process.exit(1);
  });

  hugoProc.on('close', (code) => {
    if (code !== null && code !== 0) {
      console.error(`Hugo process exited with code ${code}`);
      process.exit(1);
    }
  });

  try {
    // IMPROVED: Use HTTP polling instead of log file watching
    await waitForHugoReady();
    console.log(`Hugo server ready on port ${HUGO_PORT}`);
  } catch (err) {
    console.error(`Error waiting for Hugo: ${err.message}`);
    if (hugoProc) {
      hugoProc.kill('SIGTERM');
    }
    process.exit(1);
  }

  // Initialize broken links tracking
  let brokenLinksData = [];

  // 3. Run Cypress tests using cypress.run
  let cypressFailed = false;
  try {
    console.log(`Running Cypress tests for ${urlList.length} URLs...`);
    const cypressOptions = {
      reporter: 'junit',
      browser: 'chrome',
      config: {
        baseUrl: `http://localhost:${HUGO_PORT}`,
        video: true,
      },
      env: {
        test_subjects: urlList.join(','),
        broken_links_file: BROKEN_LINKS_FILE,
      }
    };
    
    if (specArgs.length > 0) {
      console.log(`Using specified test specs: ${specArgs.join(', ')}`);
      cypressOptions.spec = specArgs.join(',');
    }
    
    // Create or clear the broken links file before the test run
    fs.writeFileSync(BROKEN_LINKS_FILE, '[]', 'utf8');
    
    const results = await cypress.run(cypressOptions);
    
    // Process broken links report regardless of test result
    displayBrokenLinksReport();
    
    if (results && results.totalFailed && results.totalFailed > 0) {
      console.error(`⚠️ Cypress tests failed: ${results.totalFailed} test(s) failed`);
      cypressFailed = true;
      exitCode = 1;
    } else if (results) {
      console.log('✅ Cypress tests completed successfully');
    }
  } catch (err) {
    console.error(`❌ Cypress execution error: ${err.message}`);
    console.error(`Check Hugo server logs at ${HUGO_LOG_FILE} for any server issues`);
    
    // Still try to display broken links report if available
    displayBrokenLinksReport();
    
    cypressFailed = true;
    exitCode = 1;
  } finally {
    // Stop Hugo server immediately and don't wait for shutdown if there was an error
    if (hugoProc) {
      console.log(`Stopping Hugo server (fast shutdown: ${cypressFailed})...`);
      
      if (cypressFailed) {
        // Don't wait for graceful shutdown if tests failed
        hugoProc.kill('SIGKILL');
        console.log('Hugo server forcibly terminated');
        cleanupAndExit(exitCode);
      } else {
        // Use a shorter timeout and more aggressive termination
        const shutdownTimeout = setTimeout(() => {
          console.error('Hugo server did not shut down gracefully, forcing termination');
          hugoProc.kill('SIGKILL');
          process.exit(exitCode);
        }, 2000); // Shorter timeout of 2s
        
        hugoProc.kill('SIGTERM');
        
        hugoProc.on('close', (code) => {
          clearTimeout(shutdownTimeout);
          console.log('Hugo server shut down successfully');
          process.exit(exitCode);
        });
      }
    } else {
      // No Hugo process, just exit
      process.exit(exitCode);
    }
  }
}

// Function to display broken links report with improved formatting
function displayBrokenLinksReport() {
  if (!fs.existsSync(BROKEN_LINKS_FILE)) {
    return;
  }
  
  try {
    const fileContent = fs.readFileSync(BROKEN_LINKS_FILE, 'utf8');
    if (!fileContent || fileContent === '[]') {
      return; // No broken links found
    }
    
    const brokenLinksReport = JSON.parse(fileContent);
    if (!brokenLinksReport || brokenLinksReport.length === 0) {
      return; // No broken links found
    }
    
    // Print a prominent header
    console.error('\n\n' + '='.repeat(80));
    console.error(' 🚨 BROKEN LINKS DETECTED 🚨 ');
    console.error('='.repeat(80));
    
    let totalBrokenLinks = 0;
    
    brokenLinksReport.forEach(report => {
      console.error(`\n📄 PAGE: ${report.page}`);
      console.error('-'.repeat(40));
      
      report.links.forEach(link => {
        console.error(`• ${link.url}`);
        console.error(`  - Status: ${link.status}`);
        console.error(`  - Type: ${link.type}`);
        if (link.linkText) {
          console.error(`  - Link text: "${link.linkText.substring(0, 50)}${link.linkText.length > 50 ? '...' : ''}"`);
        }
        console.error('');
        totalBrokenLinks++;
      });
    });
    
    // Print a prominent summary footer
    console.error('='.repeat(80));
    console.error(`📊 TOTAL BROKEN LINKS FOUND: ${totalBrokenLinks}`);
    console.error('='.repeat(80) + '\n');
    
  } catch (err) {
    console.error(`Error processing broken links report: ${err.message}`);
  }
}

// Add error handling to the main function call
main().catch((err) => {
  console.error(`Fatal error: ${err}`);
  process.exit(1);
});
