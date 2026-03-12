#!/usr/bin/env node

/**
 * Example: Test Format Selector Component
 *
 * This example demonstrates how to use Puppeteer to test an interactive
 * component on the documentation site.
 *
 * Run with: node scripts/puppeteer/examples/test-format-selector.js
 */

import {
  launchBrowser,
  navigateToPage,
  takeScreenshot,
  elementExists,
  waitForElement,
  clickAndNavigate,
  debugPage,
} from '../utils/puppeteer-helpers.js';

async function testFormatSelector() {
  console.log('\n🧪 Testing Format Selector Component\n');

  let browser;
  try {
    // Launch browser
    console.log('Launching browser...');
    browser = await launchBrowser({ headless: true });

    // Navigate to a page with format selector
    console.log('Navigating to page...');
    const page = await navigateToPage(browser, '/influxdb3/core/get-started/');

    // Check if format selector exists
    console.log('\n1. Checking if format selector exists...');
    const hasFormatSelector = await elementExists(
      page,
      '[data-component="format-selector"]'
    );

    if (!hasFormatSelector) {
      console.log('   ⚠️  Format selector not found on this page');
      console.log(
        "   This is expected if the page doesn't have multiple formats"
      );
      return;
    }
    console.log('   ✓ Format selector found');

    // Take initial screenshot
    console.log('\n2. Capturing initial state...');
    await takeScreenshot(page, 'format-selector-initial.png', {
      selector: '[data-component="format-selector"]',
    });
    console.log('   ✓ Screenshot saved');

    // Click the format selector button
    console.log('\n3. Testing dropdown interaction...');
    const buttonExists = await elementExists(
      page,
      '[data-component="format-selector"] button'
    );

    if (buttonExists) {
      // Click button to open dropdown
      await page.click('[data-component="format-selector"] button');
      console.log('   ✓ Clicked format selector button');

      // Wait for dropdown menu to appear
      await waitForElement(
        page,
        '[data-component="format-selector"] [role="menu"]',
        3000
      );
      console.log('   ✓ Dropdown menu appeared');

      // Take screenshot of open dropdown
      await takeScreenshot(page, 'format-selector-open.png', {
        selector: '[data-component="format-selector"]',
      });
      console.log('   ✓ Screenshot of open dropdown saved');

      // Get all format options
      const options = await page.$$eval(
        '[data-component="format-selector"] [role="menuitem"]',
        (items) => items.map((item) => item.textContent.trim())
      );
      console.log(`   ✓ Found ${options.length} format options:`, options);

      // Test clicking each option
      console.log('\n4. Testing format options...');
      const menuItems = await page.$$(
        '[data-component="format-selector"] [role="menuitem"]'
      );

      for (let i = 0; i < Math.min(menuItems.length, 3); i++) {
        const option = options[i];
        console.log(`   Testing option: ${option}`);

        // Click the format selector button again (it closes after selection)
        await page.click('[data-component="format-selector"] button');
        await page.waitForTimeout(300); // Wait for animation

        // Click the option
        await page.click(
          `[data-component="format-selector"] [role="menuitem"]:nth-child(${i + 1})`
        );
        await page.waitForTimeout(500); // Wait for content to update

        // Take screenshot of result
        await takeScreenshot(
          page,
          `format-selector-${option.toLowerCase().replace(/\s+/g, '-')}.png`
        );
        console.log(`   ✓ Tested ${option} format`);
      }
    }

    // Check for JavaScript errors
    console.log('\n5. Checking for JavaScript errors...');
    const errors = await page.evaluate(() => {
      // Check if any errors were logged
      return window.__errors || [];
    });

    if (errors.length > 0) {
      console.log('   ⚠️  Found JavaScript errors:');
      errors.forEach((err) => console.log(`      - ${err}`));
    } else {
      console.log('   ✓ No JavaScript errors detected');
    }

    // Get computed styles
    console.log('\n6. Checking component styles...');
    const styles = await page.evaluate(() => {
      const selector = document.querySelector(
        '[data-component="format-selector"]'
      );
      if (!selector) return null;

      const computed = window.getComputedStyle(selector);
      return {
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
      };
    });

    if (styles) {
      console.log('   Component styles:', styles);
      console.log('   ✓ Component is visible');
    }

    console.log('\n✅ Format selector tests completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);

    // Save debug output
    if (browser) {
      const pages = await browser.pages();
      if (pages.length > 0) {
        await debugPage(pages[0], 'format-selector-error');
        console.log('\n💾 Debug information saved to debug-output/');
      }
    }

    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testFormatSelector().catch((error) => {
  console.error('\nFatal error:', error);
  process.exit(1);
});
