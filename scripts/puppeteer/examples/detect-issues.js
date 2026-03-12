#!/usr/bin/env node

/**
 * Example: Detect Common Issues
 *
 * This script demonstrates how to use Puppeteer to detect common issues
 * in documentation pages:
 * - Shortcode remnants (Hugo shortcodes that didn't render)
 * - Broken images
 * - Missing alt text
 * - JavaScript errors
 * - Slow page load
 *
 * Run with: node scripts/puppeteer/examples/detect-issues.js <url-path>
 */

import {
  launchBrowser,
  navigateToPage,
  takeScreenshot,
  getPageMetrics,
} from '../utils/puppeteer-helpers.js';

async function detectIssues(urlPath) {
  console.log('\n🔍 Detecting Common Issues\n');
  console.log(`Page: ${urlPath}\n`);

  const issues = [];
  let browser;

  try {
    // Launch browser
    browser = await launchBrowser({ headless: true });
    const page = await navigateToPage(browser, urlPath);

    // 1. Check for shortcode remnants
    console.log('1. Checking for shortcode remnants...');
    const shortcodeRemnants = await page.evaluate(() => {
      const html = document.documentElement.outerHTML;
      const patterns = [
        { name: 'Hugo shortcode open', regex: /\{\{<[^>]+>\}\}/g },
        { name: 'Hugo shortcode percent', regex: /\{\{%[^%]+%\}\}/g },
        { name: 'Hugo variable', regex: /\{\{\s*\.[^\s}]+\s*\}\}/g },
      ];

      const findings = [];
      patterns.forEach(({ name, regex }) => {
        const matches = html.match(regex);
        if (matches) {
          findings.push({
            type: name,
            count: matches.length,
            samples: matches.slice(0, 3),
          });
        }
      });

      return findings;
    });

    if (shortcodeRemnants.length > 0) {
      shortcodeRemnants.forEach((finding) => {
        issues.push({
          severity: 'high',
          type: 'shortcode-remnant',
          message: `Found ${finding.count} instances of ${finding.type}`,
          samples: finding.samples,
        });
      });
      console.log(
        `   ⚠️  Found ${shortcodeRemnants.length} types of shortcode remnants`
      );
    } else {
      console.log('   ✓ No shortcode remnants detected');
    }

    // 2. Check for broken images
    console.log('\n2. Checking for broken images...');
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => ({
          src: img.src,
          alt: img.alt,
        }));
    });

    if (brokenImages.length > 0) {
      issues.push({
        severity: 'high',
        type: 'broken-images',
        message: `Found ${brokenImages.length} broken images`,
        details: brokenImages,
      });
      console.log(`   ⚠️  Found ${brokenImages.length} broken images`);
    } else {
      console.log('   ✓ All images loaded successfully');
    }

    // 3. Check for images without alt text
    console.log('\n3. Checking for accessibility issues...');
    const missingAltText = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img:not([alt])'));
      return images.map((img) => img.src);
    });

    if (missingAltText.length > 0) {
      issues.push({
        severity: 'medium',
        type: 'missing-alt-text',
        message: `Found ${missingAltText.length} images without alt text`,
        details: missingAltText,
      });
      console.log(
        `   ⚠️  Found ${missingAltText.length} images without alt text`
      );
    } else {
      console.log('   ✓ All images have alt text');
    }

    // 4. Check for empty links
    const emptyLinks = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll('a:not([aria-label])')
      );
      return links
        .filter((link) => !link.textContent.trim())
        .map((link) => link.href);
    });

    if (emptyLinks.length > 0) {
      issues.push({
        severity: 'medium',
        type: 'empty-links',
        message: `Found ${emptyLinks.length} links without text`,
        details: emptyLinks,
      });
      console.log(`   ⚠️  Found ${emptyLinks.length} links without text`);
    } else {
      console.log('   ✓ All links have text or aria-label');
    }

    // 5. Check for JavaScript errors
    console.log('\n4. Checking for JavaScript errors...');
    const jsErrors = [];
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });

    // Wait a bit for errors to accumulate
    await page.waitForTimeout(2000);

    if (jsErrors.length > 0) {
      issues.push({
        severity: 'high',
        type: 'javascript-errors',
        message: `Found ${jsErrors.length} JavaScript errors`,
        details: jsErrors,
      });
      console.log(`   ⚠️  Found ${jsErrors.length} JavaScript errors`);
    } else {
      console.log('   ✓ No JavaScript errors detected');
    }

    // 6. Check page performance
    console.log('\n5. Checking page performance...');
    const metrics = await getPageMetrics(page);
    const loadTime = metrics.performance?.loadComplete || 0;
    const fcp = metrics.performance?.firstContentfulPaint || 0;

    if (loadTime > 3000) {
      issues.push({
        severity: 'medium',
        type: 'slow-load',
        message: `Page load time is ${loadTime.toFixed(0)}ms (> 3000ms)`,
      });
      console.log(`   ⚠️  Slow page load: ${loadTime.toFixed(0)}ms`);
    } else {
      console.log(`   ✓ Page load time: ${loadTime.toFixed(0)}ms`);
    }

    if (fcp > 1500) {
      issues.push({
        severity: 'low',
        type: 'slow-fcp',
        message: `First Contentful Paint is ${fcp.toFixed(0)}ms (> 1500ms)`,
      });
      console.log(`   ⚠️  Slow FCP: ${fcp.toFixed(0)}ms`);
    } else {
      console.log(`   ✓ First Contentful Paint: ${fcp.toFixed(0)}ms`);
    }

    // 7. Check for missing heading hierarchy
    console.log('\n6. Checking heading structure...');
    const headingIssues = await page.evaluate(() => {
      const headings = Array.from(
        document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      );
      const issues = [];

      // Check for multiple h1s
      const h1s = headings.filter((h) => h.tagName === 'H1');
      if (h1s.length === 0) {
        issues.push('No h1 found');
      } else if (h1s.length > 1) {
        issues.push(`Multiple h1s found (${h1s.length})`);
      }

      // Check for skipped heading levels
      let prevLevel = 0;
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1));
        if (prevLevel > 0 && level > prevLevel + 1) {
          issues.push(`Skipped from h${prevLevel} to h${level}`);
        }
        prevLevel = level;
      });

      return issues;
    });

    if (headingIssues.length > 0) {
      issues.push({
        severity: 'low',
        type: 'heading-structure',
        message: 'Heading structure issues detected',
        details: headingIssues,
      });
      console.log('   ⚠️  Heading structure issues:');
      headingIssues.forEach((issue) => console.log(`      - ${issue}`));
    } else {
      console.log('   ✓ Heading structure is correct');
    }

    // Take screenshot if issues found
    if (issues.length > 0) {
      console.log('\n📸 Taking screenshot for reference...');
      await takeScreenshot(page, `issues-detected-${Date.now()}.png`, {
        fullPage: true,
      });
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('SUMMARY');
    console.log('='.repeat(50) + '\n');

    if (issues.length === 0) {
      console.log('✅ No issues detected!\n');
    } else {
      const high = issues.filter((i) => i.severity === 'high').length;
      const medium = issues.filter((i) => i.severity === 'medium').length;
      const low = issues.filter((i) => i.severity === 'low').length;

      console.log(`Found ${issues.length} issue(s):\n`);
      console.log(`  High:   ${high}`);
      console.log(`  Medium: ${medium}`);
      console.log(`  Low:    ${low}\n`);

      console.log('Details:\n');
      issues.forEach((issue, index) => {
        const icon =
          issue.severity === 'high'
            ? '🔴'
            : issue.severity === 'medium'
              ? '🟡'
              : '🔵';
        console.log(
          `${index + 1}. ${icon} [${issue.severity.toUpperCase()}] ${issue.message}`
        );

        if (issue.samples && issue.samples.length > 0) {
          console.log('   Samples:');
          issue.samples.forEach((sample) => {
            console.log(`   - "${sample}"`);
          });
        }

        if (
          issue.details &&
          issue.details.length > 0 &&
          issue.details.length <= 5
        ) {
          console.log('   Details:');
          issue.details.forEach((detail) => {
            const str =
              typeof detail === 'string' ? detail : JSON.stringify(detail);
            console.log(`   - ${str}`);
          });
        }

        console.log('');
      });
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return issues;
}

// CLI
const urlPath = process.argv[2] || '/';
detectIssues(urlPath).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
