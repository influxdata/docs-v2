/**
 * InfluxData Documentation E2E Test Runner
 *
 * This script automates running Cypress end-to-end tests for the InfluxData documentation site.
 * It handles starting a local Hugo server, mapping content files to their URLs, running Cypress tests,
 * and reporting broken links.
 *
 * Usage: node run-e2e-specs.js [file paths...] [--spec test    // Display broken links report
    const brokenLinksCount = displayBrokenLinksReport();
    
    // Check if we might have special case failures
    const hasSpecialCaseFailures = 
      results && 
      results.totalFailed > 0 && 
      brokenLinksCount === 0;
      
    if (hasSpecialCaseFailures) {
      console.warn(
        `ℹ️ Note: Tests failed (${results.totalFailed}) but no broken links were reported. This may be due to special case URLs (like Reddit) that return expected status codes.`
      );
    }
    
    if (
      (results && results.totalFailed && results.totalFailed > 0 && !hasSpecialCaseFailures) ||
      brokenLinksCount > 0
    ) {
      console.error(
        `⚠️ Tests failed: ${results.totalFailed || 0} test(s) failed, ${brokenLinksCount || 0} broken links found`
      );
      cypressFailed = true;
      exitCode = 1; *
 * Example: node run-e2e-specs.js content/influxdb/v2/write-data.md --spec cypress/e2e/content/article-links.cy.js
 */

import { spawn } from 'child_process';
import process from 'process';
import fs from 'fs';
import path from 'path';
import cypress from 'cypress';
import net from 'net';
import matter from 'gray-matter';
import { displayBrokenLinksReport, initializeReport } from './link-reporter.js';
import {
  HUGO_PORT,
  HUGO_LOG_FILE,
  startHugoServer,
  waitForHugoReady,
} from './hugo-server.js';

const MAP_SCRIPT = path.resolve('cypress/support/map-files-to-urls.js');
const URLS_FILE = '/tmp/test_subjects.txt';

/**
 * Parses command line arguments into file and spec arguments
 * @param {string[]} argv - Command line arguments (process.argv)
 * @returns {Object} Object containing fileArgs and specArgs arrays
 */
function parseArgs(argv) {
  const fileArgs = [];
  const specArgs = [];
  let i = 2; // Start at index 2 to skip 'node' and script name

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

// Check if port is already in use
async function isPortInUse(port) {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        tester.close();
        resolve(false);
      })
      .listen(port, '127.0.0.1');
  });
}

/**
 * Extract source information from frontmatter
 * @param {string} filePath - Path to the markdown file
 * @returns {string|null} Source information if present
 */
function getSourceFromFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return data.source || null;
  } catch (err) {
    console.warn(
      `Warning: Could not extract frontmatter from ${filePath}: ${err.message}`
    );
    return null;
  }
}

/**
 * Ensures a directory exists, creating it if necessary
 * Also creates an empty file to ensure the directory is not empty
 * @param {string} dirPath - The directory path to ensure exists
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);

      // Create an empty .gitkeep file to ensure the directory exists and isn't empty
      fs.writeFileSync(path.join(dirPath, '.gitkeep'), '');
    } catch (err) {
      console.warn(
        `Warning: Could not create directory ${dirPath}: ${err.message}`
      );
    }
  }
}

async function main() {
  // Keep track of processes to cleanly shut down
  let hugoProc = null;
  let exitCode = 0;
  let hugoStarted = false;

  // Add this signal handler to ensure cleanup on unexpected termination
  const cleanupAndExit = (code = 1) => {
    console.log(`Performing cleanup before exit with code ${code}...`);
    if (hugoProc && hugoStarted) {
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

  // Separate content files from non-content files
  const contentFiles = fileArgs.filter((file) => file.startsWith('content/'));
  const nonContentFiles = fileArgs.filter(
    (file) => !file.startsWith('content/')
  );

  // Log what we're processing
  if (contentFiles.length > 0) {
    console.log(
      `Processing ${contentFiles.length} content files for URL mapping...`
    );
  }

  if (nonContentFiles.length > 0) {
    console.log(
      `Found ${nonContentFiles.length} non-content files that will be passed directly to tests...`
    );
  }

  let urlList = [];

  // Only run the mapper if we have content files
  if (contentFiles.length > 0) {
    // 1. Map file paths to URLs and write to file
    const mapProc = spawn('node', [MAP_SCRIPT, ...contentFiles], {
      stdio: ['ignore', 'pipe', 'inherit'],
    });

    const mappingOutput = [];
    mapProc.stdout.on('data', (chunk) => {
      mappingOutput.push(chunk.toString());
    });

    await new Promise((res) => mapProc.on('close', res));

    // Process the mapping output
    urlList = mappingOutput
      .join('')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        // Parse the URL|SOURCE format
        if (line.includes('|')) {
          const [url, source] = line.split('|');
          return { url, source };
        } else if (line.startsWith('/')) {
          // Handle URLs without source (should not happen with our new code)
          return { url: line, source: null };
        } else {
          // Skip log messages
          return null;
        }
      })
      .filter(Boolean); // Remove null entries
  }

  // Add non-content files directly to be tested, using their path as both URL and source
  nonContentFiles.forEach((file) => {
    urlList.push({ url: file, source: file });
  });

  // Log the URLs and sources we'll be testing
  console.log(`Found ${urlList.length} items to test:`);
  urlList.forEach(({ url, source }) => {
    console.log(`  URL/FILE: ${url}`);
    console.log(`  SOURCE: ${source}`);
    console.log('---');
  });

  if (urlList.length === 0) {
    console.log('No URLs or files to test.');
    process.exit(0);
  }

  // Write just the URLs/files to the test_subjects file for Cypress
  fs.writeFileSync(URLS_FILE, urlList.map((item) => item.url).join(','));

  // Add source information to a separate file for reference during reporting
  fs.writeFileSync(
    '/tmp/test_subjects_sources.json',
    JSON.stringify(urlList, null, 2)
  );

  // 2. Check if port is in use before starting Hugo
  const portInUse = await isPortInUse(HUGO_PORT);

  if (portInUse) {
    console.log(
      `Port ${HUGO_PORT} is already in use. Checking if Hugo is running...`
    );
    try {
      // Try to connect to verify it's a working server
      await waitForHugoReady(5000); // Short timeout - if it's running, it should respond quickly
      console.log(
        `Hugo server already running on port ${HUGO_PORT}, will use existing instance`
      );
    } catch (err) {
      console.error(
        `Port ${HUGO_PORT} is in use but not responding as expected: ${err.message}`
      );
      console.error('Please stop any processes using this port and try again.');
      process.exit(1);
    }
  } else {
    // Start Hugo server using the imported function
    try {
      console.log(
        `Starting Hugo server (logs will be written to ${HUGO_LOG_FILE})...`
      );

      // Create or clear the log file
      fs.writeFileSync(HUGO_LOG_FILE, '');

      // First, check if Hugo is installed and available
      try {
        // Try running a simple Hugo version command to check if Hugo is available
        const hugoCheck = spawn('hugo', ['version'], { shell: true });
        await new Promise((resolve, reject) => {
          hugoCheck.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`Hugo check failed with code ${code}`));
            }
          });
          hugoCheck.on('error', (err) => reject(err));
        });

        console.log('Hugo is available on the system');
      } catch (checkErr) {
        console.log(
          'Hugo not found on PATH, will use project-local Hugo via yarn'
        );
      }

      // Use the startHugoServer function from hugo-server.js
      hugoProc = await startHugoServer({
        configFile: 'config/testing/config.yml',
        port: HUGO_PORT,
        buildDrafts: true,
        noHTTPCache: true,
        logFile: HUGO_LOG_FILE,
      });

      // Ensure hugoProc is a valid process object with kill method
      if (!hugoProc || typeof hugoProc.kill !== 'function') {
        throw new Error('Failed to get a valid Hugo process object');
      }

      hugoStarted = true;
      console.log(`Started Hugo process with PID: ${hugoProc.pid}`);

      // Wait for Hugo to be ready
      await waitForHugoReady();
      console.log(`Hugo server ready on port ${HUGO_PORT}`);
    } catch (err) {
      console.error(`Error starting or waiting for Hugo: ${err.message}`);
      if (hugoProc && typeof hugoProc.kill === 'function') {
        hugoProc.kill('SIGTERM');
      }
      process.exit(1);
    }
  }

  // 3. Prepare Cypress directories
  try {
    const screenshotsDir = path.resolve('cypress/screenshots');
    const videosDir = path.resolve('cypress/videos');
    const specScreenshotDir = path.join(screenshotsDir, 'article-links.cy.js');

    // Ensure base directories exist
    ensureDirectoryExists(screenshotsDir);
    ensureDirectoryExists(videosDir);

    // Create spec-specific screenshot directory with a placeholder file
    ensureDirectoryExists(specScreenshotDir);

    // Create a dummy screenshot file to prevent trash errors
    const dummyScreenshotPath = path.join(specScreenshotDir, 'dummy.png');
    if (!fs.existsSync(dummyScreenshotPath)) {
      // Create a minimal valid PNG file (1x1 transparent pixel)
      const minimalPng = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
        0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
      ]);
      fs.writeFileSync(dummyScreenshotPath, minimalPng);
      console.log(`Created dummy screenshot file: ${dummyScreenshotPath}`);
    }

    console.log('Cypress directories prepared successfully');
  } catch (err) {
    console.warn(
      `Warning: Error preparing Cypress directories: ${err.message}`
    );
    // Continue execution - this is not a fatal error
  }

  // 4. Run Cypress tests
  let cypressFailed = false;
  try {
    // Initialize/clear broken links report before running tests
    console.log('Initializing broken links report...');
    initializeReport();

    console.log(`Running Cypress tests for ${urlList.length} URLs...`);
    const cypressOptions = {
      reporter: 'junit',
      browser: 'chrome',
      config: {
        baseUrl: `http://localhost:${HUGO_PORT}`,
        video: true,
        trashAssetsBeforeRuns: false, // Prevent trash errors
      },
      env: {
        // Pass URLs as a comma-separated string for backward compatibility
        test_subjects: urlList.map((item) => item.url).join(','),
        // Add new structured data with source information
        test_subjects_data: JSON.stringify(urlList),
        // Skip testing external links (non-influxdata.com URLs)
        skipExternalLinks: true,
      },
    };

    if (specArgs.length > 0) {
      console.log(`Using specified test specs: ${specArgs.join(', ')}`);
      cypressOptions.spec = specArgs.join(',');
    }

    const results = await cypress.run(cypressOptions);

    // Process broken links report
    const brokenLinksCount = displayBrokenLinksReport();

    // Determine why tests failed
    const testFailureCount = results?.totalFailed || 0;

    if (testFailureCount > 0 && brokenLinksCount === 0) {
      console.warn(
        `ℹ️ Note: ${testFailureCount} test(s) failed but no broken links were detected in the report.`
      );
      console.warn(
        `   This usually indicates test errors unrelated to link validation.`
      );

      // We should not consider special case domains (those with expected errors) as failures
      // but we'll still report other test failures
      cypressFailed = true;
      exitCode = 1;
    } else if (brokenLinksCount > 0) {
      console.error(
        `⚠️ Tests failed: ${brokenLinksCount} broken link(s) detected`
      );
      cypressFailed = true;
      exitCode = 1;
    } else if (results) {
      console.log('✅ Tests completed successfully');
    }
  } catch (err) {
    console.error(`❌ Cypress execution error: ${err.message}`);
    console.error(
      `Check Hugo server logs at ${HUGO_LOG_FILE} for any server issues`
    );

    // Still try to display broken links report if available
    displayBrokenLinksReport();

    cypressFailed = true;
    exitCode = 1;
  } finally {
    // Stop Hugo server only if we started it
    if (hugoProc && hugoStarted && typeof hugoProc.kill === 'function') {
      console.log(`Stopping Hugo server (fast shutdown: ${cypressFailed})...`);

      if (cypressFailed) {
        hugoProc.kill('SIGKILL');
        console.log('Hugo server forcibly terminated');
      } else {
        const shutdownTimeout = setTimeout(() => {
          console.error(
            'Hugo server did not shut down gracefully, forcing termination'
          );
          hugoProc.kill('SIGKILL');
          process.exit(exitCode);
        }, 2000);

        hugoProc.kill('SIGTERM');

        hugoProc.on('close', () => {
          clearTimeout(shutdownTimeout);
          console.log('Hugo server shut down successfully');
          process.exit(exitCode);
        });

        // Return to prevent immediate exit
        return;
      }
    } else if (hugoStarted) {
      console.log('Hugo process was started but is not available for cleanup');
    }

    process.exit(exitCode);
  }
}

main().catch((err) => {
  console.error(`Fatal error: ${err}`);
  process.exit(1);
});
