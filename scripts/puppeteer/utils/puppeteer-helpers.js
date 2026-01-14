/**
 * Puppeteer Helper Utilities for AI Agent Development
 *
 * This module provides reusable functions for AI agents to debug and test
 * the documentation site during development.
 *
 * Usage:
 *   import { launchBrowser, navigateToPage, takeScreenshot } from './utils/puppeteer-helpers.js';
 *
 *   const browser = await launchBrowser();
 *   const page = await navigateToPage(browser, '/influxdb3/core/');
 *   await takeScreenshot(page, 'debug-screenshot.png');
 *   await browser.close();
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

/**
 * Launch a browser instance
 *
 * @param {Object} options - Browser launch options
 * @param {boolean} options.headless - Run in headless mode (default: true)
 * @param {boolean} options.devtools - Open DevTools (default: false)
 * @param {number} options.slowMo - Slow down operations by ms (default: 0)
 * @returns {Promise<Browser>} Puppeteer browser instance
 */
export async function launchBrowser(options = {}) {
  const {
    headless = true,
    devtools = false,
    slowMo = 0,
    executablePath = null,
  } = options;

  const launchOptions = {
    headless: headless ? 'new' : false,
    devtools,
    slowMo,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security', // Allow cross-origin requests for local development
    ],
  };

  // Use system Chrome if available (useful when PUPPETEER_SKIP_DOWNLOAD was used)
  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  try {
    return await puppeteer.launch(launchOptions);
  } catch (error) {
    console.error('Failed to launch browser:', error.message);
    console.log('\nTroubleshooting:');
    console.log(
      '1. If Puppeteer browser not installed, set executablePath to system Chrome'
    );
    console.log('2. Common paths:');
    console.log(
      '   - macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    );
    console.log('   - Linux: /usr/bin/google-chrome');
    console.log(
      '   - Windows: C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    );
    console.log(
      '3. Or install Puppeteer browser: PUPPETEER_SKIP_DOWNLOAD=false yarn add puppeteer'
    );
    throw error;
  }
}

/**
 * Navigate to a page on the local Hugo server
 *
 * @param {Browser} browser - Puppeteer browser instance
 * @param {string} urlPath - URL path (e.g., '/influxdb3/core/')
 * @param {Object} options - Navigation options
 * @param {string} options.baseUrl - Base URL (default: 'http://localhost:1313')
 * @param {number} options.timeout - Navigation timeout in ms (default: 30000)
 * @param {string} options.waitUntil - When to consider navigation succeeded (default: 'networkidle2')
 * @returns {Promise<Page>} Puppeteer page instance
 */
export async function navigateToPage(browser, urlPath, options = {}) {
  const {
    baseUrl = 'http://localhost:1313',
    timeout = 30000,
    waitUntil = 'networkidle2',
  } = options;

  const page = await browser.newPage();

  // Set viewport size
  await page.setViewport({ width: 1280, height: 720 });

  // Enable console logging from the page
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`[Browser ${type}]:`, msg.text());
    }
  });

  // Log page errors
  page.on('pageerror', (error) => {
    console.error('[Page Error]:', error.message);
  });

  const fullUrl = `${baseUrl}${urlPath}`;
  console.log(`Navigating to: ${fullUrl}`);

  try {
    await page.goto(fullUrl, { waitUntil, timeout });
    console.log('✓ Page loaded successfully');
    return page;
  } catch (error) {
    console.error(`Failed to navigate to ${fullUrl}:`, error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure Hugo server is running: yarn hugo server');
    console.log('2. Check if the URL path is correct');
    console.log('3. Try increasing timeout if page is slow to load');
    throw error;
  }
}

/**
 * Take a screenshot of the page or a specific element
 *
 * @param {Page} page - Puppeteer page instance
 * @param {string} outputPath - Output file path
 * @param {Object} options - Screenshot options
 * @param {string} options.selector - CSS selector to screenshot specific element
 * @param {boolean} options.fullPage - Capture full page (default: false)
 * @param {Object} options.clip - Clip region {x, y, width, height}
 * @returns {Promise<void>}
 */
export async function takeScreenshot(page, outputPath, options = {}) {
  const { selector, fullPage = false, clip } = options;

  // Ensure output directory exists
  const dir = path.dirname(outputPath);
  await fs.mkdir(dir, { recursive: true });

  const screenshotOptions = {
    path: outputPath,
    fullPage,
  };

  if (clip) {
    screenshotOptions.clip = clip;
  }

  try {
    if (selector) {
      const element = await page.$(selector);
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      await element.screenshot({ path: outputPath });
      console.log(`✓ Screenshot saved (element: ${selector}): ${outputPath}`);
    } else {
      await page.screenshot(screenshotOptions);
      console.log(`✓ Screenshot saved: ${outputPath}`);
    }
  } catch (error) {
    console.error('Failed to take screenshot:', error.message);
    throw error;
  }
}

/**
 * Get page metrics and performance data
 *
 * @param {Page} page - Puppeteer page instance
 * @returns {Promise<Object>} Performance metrics
 */
export async function getPageMetrics(page) {
  const metrics = await page.metrics();

  const performanceData = await page.evaluate(() => {
    const perfData = window.performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded:
        perfData?.domContentLoadedEventEnd -
        perfData?.domContentLoadedEventStart,
      loadComplete: perfData?.loadEventEnd - perfData?.loadEventStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
      firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime,
    };
  });

  return {
    ...metrics,
    performance: performanceData,
  };
}

/**
 * Check for JavaScript errors on the page
 *
 * @param {Page} page - Puppeteer page instance
 * @returns {Promise<Array>} Array of error messages
 */
export async function getPageErrors(page) {
  const errors = [];

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  return errors;
}

/**
 * Get all links on the page
 *
 * @param {Page} page - Puppeteer page instance
 * @returns {Promise<Array>} Array of link objects {href, text}
 */
export async function getPageLinks(page) {
  return await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    return links.map((link) => ({
      href: link.href,
      text: link.textContent.trim(),
      isExternal: !link.href.startsWith(window.location.origin),
    }));
  });
}

/**
 * Check if an element exists on the page
 *
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector
 * @returns {Promise<boolean>} True if element exists
 */
export async function elementExists(page, selector) {
  return (await page.$(selector)) !== null;
}

/**
 * Wait for an element to appear on the page
 *
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in ms (default: 5000)
 * @returns {Promise<ElementHandle>} Element handle
 */
export async function waitForElement(page, selector, timeout = 5000) {
  try {
    return await page.waitForSelector(selector, { timeout });
  } catch (error) {
    console.error(`Element not found within ${timeout}ms: ${selector}`);
    throw error;
  }
}

/**
 * Get text content of an element
 *
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector
 * @returns {Promise<string>} Text content
 */
export async function getElementText(page, selector) {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  return await page.evaluate((el) => el.textContent, element);
}

/**
 * Click an element and wait for navigation
 *
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector
 * @param {Object} options - Click options
 * @returns {Promise<void>}
 */
export async function clickAndNavigate(page, selector, options = {}) {
  const { waitUntil = 'networkidle2' } = options;

  await Promise.all([
    page.waitForNavigation({ waitUntil }),
    page.click(selector),
  ]);
}

/**
 * Test a component's interactive behavior
 *
 * @param {Page} page - Puppeteer page instance
 * @param {string} componentSelector - Component selector
 * @param {Function} testFn - Test function to run
 * @returns {Promise<any>} Test function result
 */
export async function testComponent(page, componentSelector, testFn) {
  const component = await page.$(componentSelector);
  if (!component) {
    throw new Error(`Component not found: ${componentSelector}`);
  }

  console.log(`Testing component: ${componentSelector}`);
  return await testFn(page, component);
}

/**
 * Capture console logs from the page
 *
 * @param {Page} page - Puppeteer page instance
 * @returns {Array} Array to store console logs
 */
export function captureConsoleLogs(page) {
  const logs = [];

  page.on('console', (msg) => {
    logs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    });
  });

  return logs;
}

/**
 * Get computed styles for an element
 *
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector
 * @param {Array<string>} properties - CSS properties to get
 * @returns {Promise<Object>} Computed styles object
 */
export async function getComputedStyles(page, selector, properties = []) {
  return await page.evaluate(
    (sel, props) => {
      const element = document.querySelector(sel);
      if (!element) return null;

      const styles = window.getComputedStyle(element);
      if (props.length === 0) {
        return Object.fromEntries(
          Array.from(styles).map((prop) => [
            prop,
            styles.getPropertyValue(prop),
          ])
        );
      }

      return Object.fromEntries(
        props.map((prop) => [prop, styles.getPropertyValue(prop)])
      );
    },
    selector,
    properties
  );
}

/**
 * Check responsive design at different viewports
 *
 * @param {Page} page - Puppeteer page instance
 * @param {Array<Object>} viewports - Array of {width, height, name} objects
 * @param {Function} testFn - Test function to run at each viewport
 * @returns {Promise<Array>} Test results for each viewport
 */
export async function testResponsive(page, viewports, testFn) {
  const results = [];

  for (const viewport of viewports) {
    console.log(
      `Testing at ${viewport.name || `${viewport.width}x${viewport.height}`}`
    );
    await page.setViewport({ width: viewport.width, height: viewport.height });
    const result = await testFn(page, viewport);
    results.push({ viewport, result });
  }

  return results;
}

/**
 * Compare two screenshots for visual regression
 *
 * @param {string} baselinePath - Path to baseline screenshot
 * @param {string} currentPath - Path to current screenshot
 * @param {string} diffPath - Path to save diff image
 * @param {Object} options - Comparison options
 * @returns {Promise<Object>} Comparison result {match, diffPixels, diffPercentage}
 */
export async function compareScreenshots(
  baselinePath,
  currentPath,
  diffPath,
  options = {}
) {
  const { threshold = 0.1 } = options;

  // This function requires pixelmatch - will be implemented when pixelmatch is available
  try {
    const { default: pixelmatch } = await import('pixelmatch');
    const { PNG } = await import('pngjs');

    const baseline = PNG.sync.read(await fs.readFile(baselinePath));
    const current = PNG.sync.read(await fs.readFile(currentPath));
    const { width, height } = baseline;
    const diff = new PNG({ width, height });

    const diffPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      width,
      height,
      { threshold }
    );

    const diffPercentage = (diffPixels / (width * height)) * 100;

    if (diffPath) {
      await fs.writeFile(diffPath, PNG.sync.write(diff));
    }

    return {
      match: diffPixels === 0,
      diffPixels,
      diffPercentage,
    };
  } catch (error) {
    console.warn(
      'Screenshot comparison requires pixelmatch and pngjs packages'
    );
    console.warn(
      'Install with: PUPPETEER_SKIP_DOWNLOAD=true yarn add -D pixelmatch pngjs'
    );
    throw error;
  }
}

/**
 * Debug helper: Save page HTML and screenshot
 *
 * @param {Page} page - Puppeteer page instance
 * @param {string} debugName - Debug session name
 * @returns {Promise<void>}
 */
export async function debugPage(page, debugName = 'debug') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const debugDir = `debug-output/${debugName}-${timestamp}`;

  await fs.mkdir(debugDir, { recursive: true });

  // Save HTML
  const html = await page.content();
  await fs.writeFile(`${debugDir}/page.html`, html);

  // Save screenshot
  await takeScreenshot(page, `${debugDir}/screenshot.png`, { fullPage: true });

  // Save console logs if captured
  const consoleLogs = await page.evaluate(() => {
    return window.__consoleLogs || [];
  });
  await fs.writeFile(
    `${debugDir}/console-logs.json`,
    JSON.stringify(consoleLogs, null, 2)
  );

  console.log(`✓ Debug output saved to: ${debugDir}`);
  console.log(`  - page.html`);
  console.log(`  - screenshot.png`);
  console.log(`  - console-logs.json`);
}
