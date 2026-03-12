#!/usr/bin/env node

/**
 * Interactive Browser Debugger for AI Agents
 *
 * This script launches a browser in non-headless mode so AI agents can
 * visually debug issues during development.
 *
 * Usage:
 *   yarn debug:browser [url-path] [options]
 *
 * Examples:
 *   yarn debug:browser /influxdb3/core/
 *   yarn debug:browser /influxdb3/core/ --devtools
 *   yarn debug:browser /influxdb3/core/ --slow-mo 100
 *
 * Options:
 *   --devtools     Open Chrome DevTools
 *   --slow-mo NUM  Slow down by NUM milliseconds
 *   --viewport WxH Set viewport size (default: 1280x720)
 *   --base-url URL Set base URL (default: http://localhost:1313)
 *   --chrome PATH  Path to Chrome executable
 */

import {
  launchBrowser,
  navigateToPage,
  debugPage,
} from './utils/puppeteer-helpers.js';

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const urlPath = args.find((arg) => !arg.startsWith('--')) || '/';
  const devtools = args.includes('--devtools');
  const slowMo = parseInt(
    args.find((arg) => arg.startsWith('--slow-mo'))?.split('=')[1] || '0',
    10
  );
  const viewport =
    args.find((arg) => arg.startsWith('--viewport'))?.split('=')[1] ||
    '1280x720';
  const baseUrl =
    args.find((arg) => arg.startsWith('--base-url'))?.split('=')[1] ||
    'http://localhost:1313';
  const chromePath = args
    .find((arg) => arg.startsWith('--chrome'))
    ?.split('=')[1];

  const [width, height] = viewport.split('x').map(Number);

  console.log('\n🔍 Interactive Browser Debugger');
  console.log('================================\n');

  let browser;
  try {
    // Launch browser
    console.log('Launching browser...');
    browser = await launchBrowser({
      headless: false,
      devtools,
      slowMo,
      executablePath: chromePath,
    });

    // Navigate to page
    const page = await navigateToPage(browser, urlPath, { baseUrl });

    // Set viewport
    await page.setViewport({ width, height });
    console.log(`Viewport set to: ${width}x${height}`);

    // Enable console logging
    page.on('console', (msg) => {
      console.log(`[Browser Console ${msg.type()}]:`, msg.text());
    });

    page.on('pageerror', (error) => {
      console.error('[Page Error]:', error.message);
    });

    console.log('\n✓ Browser ready for debugging');
    console.log('\nThe browser will remain open for manual inspection.');
    console.log('Press Ctrl+C to close the browser and exit.\n');

    // Keep the browser open until user interrupts
    await new Promise((resolve) => {
      process.on('SIGINT', () => {
        console.log('\nClosing browser...');
        resolve();
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
      console.log('✓ Browser closed');
    }
  }
}

main();
