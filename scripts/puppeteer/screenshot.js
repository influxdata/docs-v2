#!/usr/bin/env node

/**
 * Screenshot Utility for AI Agents
 *
 * This script takes screenshots of documentation pages for debugging and validation.
 *
 * Usage:
 *   yarn debug:screenshot <url-path> [options]
 *
 * Examples:
 *   yarn debug:screenshot /influxdb3/core/
 *   yarn debug:screenshot /influxdb3/core/ --output debug.png
 *   yarn debug:screenshot /influxdb3/core/ --full-page
 *   yarn debug:screenshot /influxdb3/core/ --selector .article--content
 *   yarn debug:screenshot /influxdb3/core/ --viewport 375x667
 *
 * Options:
 *   --output PATH       Output file path (default: screenshot-{timestamp}.png)
 *   --full-page         Capture full page scroll
 *   --selector SELECTOR Capture specific element
 *   --viewport WxH      Set viewport size (default: 1280x720)
 *   --base-url URL      Set base URL (default: http://localhost:1313)
 *   --chrome PATH       Path to Chrome executable
 */

import {
  launchBrowser,
  navigateToPage,
  takeScreenshot,
} from './utils/puppeteer-helpers.js';
import path from 'path';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0].startsWith('--')) {
    console.error('Error: URL path is required');
    console.log('\nUsage: yarn debug:screenshot <url-path> [options]');
    console.log(
      '\nExample: yarn debug:screenshot /influxdb3/core/ --full-page'
    );
    process.exit(1);
  }

  // Parse arguments
  const urlPath = args.find((arg) => !arg.startsWith('--'));
  const output =
    args.find((arg) => arg.startsWith('--output'))?.split('=')[1] ||
    `screenshot-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
  const fullPage = args.includes('--full-page');
  const selector = args
    .find((arg) => arg.startsWith('--selector'))
    ?.split('=')[1];
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

  console.log('\n📸 Screenshot Utility');
  console.log('=====================\n');
  console.log(`URL: ${baseUrl}${urlPath}`);
  console.log(`Viewport: ${width}x${height}`);
  console.log(`Output: ${output}`);
  if (fullPage) console.log('Mode: Full page');
  if (selector) console.log(`Element: ${selector}`);
  console.log('');

  let browser;
  try {
    // Launch browser
    browser = await launchBrowser({
      headless: true,
      executablePath: chromePath,
    });

    // Navigate to page
    const page = await navigateToPage(browser, urlPath, { baseUrl });

    // Set viewport
    await page.setViewport({ width, height });

    // Take screenshot
    await takeScreenshot(page, output, { fullPage, selector });

    console.log('\n✓ Screenshot captured successfully\n');
  } catch (error) {
    console.error('\nError:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
