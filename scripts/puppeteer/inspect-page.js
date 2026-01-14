#!/usr/bin/env node

/**
 * Page Inspector for AI Agents
 *
 * This script inspects a page and provides detailed information for debugging:
 * - Page metadata
 * - Performance metrics
 * - Console errors
 * - Links analysis
 * - Component detection
 *
 * Usage:
 *   yarn debug:inspect <url-path> [options]
 *
 * Examples:
 *   yarn debug:inspect /influxdb3/core/
 *   yarn debug:inspect /influxdb3/core/ --output report.json
 *   yarn debug:inspect /influxdb3/core/ --screenshot
 *
 * Options:
 *   --output PATH       Save report to JSON file
 *   --screenshot        Also capture a screenshot
 *   --base-url URL      Set base URL (default: http://localhost:1313)
 *   --chrome PATH       Path to Chrome executable
 */

import {
  launchBrowser,
  navigateToPage,
  takeScreenshot,
  getPageMetrics,
  getPageLinks,
  elementExists,
  getElementText,
} from './utils/puppeteer-helpers.js';
import fs from 'fs/promises';

async function inspectPage(page) {
  console.log('Inspecting page...\n');

  const report = {};

  // 1. Page metadata
  console.log('1. Gathering page metadata...');
  report.metadata = await page.evaluate(() => ({
    title: document.title,
    url: window.location.href,
    description: document.querySelector('meta[name="description"]')?.content,
    viewport: document.querySelector('meta[name="viewport"]')?.content,
    lang: document.documentElement.lang,
  }));

  // 2. Performance metrics
  console.log('2. Collecting performance metrics...');
  report.performance = await getPageMetrics(page);

  // 3. Console errors
  console.log('3. Checking for console errors...');
  const errors = [];
  page.on('pageerror', (error) => {
    errors.push({ type: 'pageerror', message: error.message });
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console', message: msg.text() });
    }
  });
  // Wait a bit for errors to accumulate
  await page.waitForTimeout(1000);
  report.errors = errors;

  // 4. Links analysis
  console.log('4. Analyzing links...');
  const links = await getPageLinks(page);
  report.links = {
    total: links.length,
    internal: links.filter((l) => !l.isExternal).length,
    external: links.filter((l) => l.isExternal).length,
    list: links,
  };

  // 5. Component detection
  console.log('5. Detecting components...');
  const components = await page.evaluate(() => {
    const componentElements = document.querySelectorAll('[data-component]');
    return Array.from(componentElements).map((el) => ({
      type: el.getAttribute('data-component'),
      id: el.id,
      classes: Array.from(el.classList),
    }));
  });
  report.components = components;

  // 6. Hugo shortcode detection
  console.log('6. Checking for shortcode remnants...');
  const shortcodeRemnants = await page.evaluate(() => {
    const html = document.documentElement.outerHTML;
    const patterns = [
      /\{\{<[^>]+>\}\}/g,
      /\{\{%[^%]+%\}\}/g,
      /\{\{-?[^}]+-?\}\}/g,
    ];

    const findings = [];
    patterns.forEach((pattern, index) => {
      const matches = html.match(pattern);
      if (matches) {
        findings.push({
          pattern: pattern.toString(),
          count: matches.length,
          samples: matches.slice(0, 3),
        });
      }
    });

    return findings;
  });
  report.shortcodeRemnants = shortcodeRemnants;

  // 7. Accessibility quick check
  console.log('7. Running basic accessibility checks...');
  report.accessibility = await page.evaluate(() => {
    return {
      hasMainLandmark: !!document.querySelector('main'),
      hasH1: !!document.querySelector('h1'),
      h1Text: document.querySelector('h1')?.textContent,
      imagesWithoutAlt: Array.from(document.querySelectorAll('img:not([alt])'))
        .length,
      linksWithoutText: Array.from(
        document.querySelectorAll('a:not([aria-label])')
      ).filter((a) => !a.textContent.trim()).length,
    };
  });

  // 8. Content structure
  console.log('8. Analyzing content structure...');
  report.contentStructure = await page.evaluate(() => {
    const headings = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ).map((h) => ({
      level: parseInt(h.tagName.substring(1)),
      text: h.textContent.trim(),
    }));

    const codeBlocks = Array.from(document.querySelectorAll('pre code')).map(
      (block) => ({
        language: Array.from(block.classList)
          .find((c) => c.startsWith('language-'))
          ?.substring(9),
        lines: block.textContent.split('\n').length,
      })
    );

    return {
      headings,
      codeBlocks: {
        total: codeBlocks.length,
        byLanguage: codeBlocks.reduce((acc, block) => {
          const lang = block.language || 'unknown';
          acc[lang] = (acc[lang] || 0) + 1;
          return acc;
        }, {}),
      },
    };
  });

  return report;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0].startsWith('--')) {
    console.error('Error: URL path is required');
    console.log('\nUsage: yarn debug:inspect <url-path> [options]');
    console.log('\nExample: yarn debug:inspect /influxdb3/core/ --screenshot');
    process.exit(1);
  }

  // Parse arguments
  const urlPath = args.find((arg) => !arg.startsWith('--'));
  const outputPath = args
    .find((arg) => arg.startsWith('--output'))
    ?.split('=')[1];
  const takeScreenshotFlag = args.includes('--screenshot');
  const baseUrl =
    args.find((arg) => arg.startsWith('--base-url'))?.split('=')[1] ||
    'http://localhost:1313';
  const chromePath = args
    .find((arg) => arg.startsWith('--chrome'))
    ?.split('=')[1];

  console.log('\n🔍 Page Inspector');
  console.log('=================\n');
  console.log(`Inspecting: ${baseUrl}${urlPath}\n`);

  let browser;
  try {
    // Launch browser
    browser = await launchBrowser({
      headless: true,
      executablePath: chromePath,
    });

    // Navigate to page
    const page = await navigateToPage(browser, urlPath, { baseUrl });

    // Inspect page
    const report = await inspectPage(page);

    // Take screenshot if requested
    if (takeScreenshotFlag) {
      const screenshotPath = outputPath
        ? outputPath.replace('.json', '.png')
        : `inspect-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
      await takeScreenshot(page, screenshotPath);
      report.screenshot = screenshotPath;
    }

    // Display report
    console.log('\n📊 Inspection Report');
    console.log('===================\n');

    console.log('Metadata:');
    console.log(`  Title: ${report.metadata.title}`);
    console.log(`  URL: ${report.metadata.url}`);
    console.log(`  Description: ${report.metadata.description || 'N/A'}\n`);

    console.log('Performance:');
    console.log(
      `  DOM Content Loaded: ${report.performance.performance?.domContentLoaded?.toFixed(2) || 'N/A'}ms`
    );
    console.log(
      `  Load Complete: ${report.performance.performance?.loadComplete?.toFixed(2) || 'N/A'}ms`
    );
    console.log(
      `  First Paint: ${report.performance.performance?.firstPaint?.toFixed(2) || 'N/A'}ms`
    );
    console.log(
      `  FCP: ${report.performance.performance?.firstContentfulPaint?.toFixed(2) || 'N/A'}ms\n`
    );

    console.log('Errors:');
    if (report.errors.length > 0) {
      report.errors.forEach((err) => {
        console.log(`  ❌ [${err.type}] ${err.message}`);
      });
    } else {
      console.log('  ✓ No errors detected');
    }
    console.log('');

    console.log('Links:');
    console.log(`  Total: ${report.links.total}`);
    console.log(`  Internal: ${report.links.internal}`);
    console.log(`  External: ${report.links.external}\n`);

    console.log('Components:');
    if (report.components.length > 0) {
      report.components.forEach((comp) => {
        console.log(`  - ${comp.type}${comp.id ? ` (id: ${comp.id})` : ''}`);
      });
    } else {
      console.log('  None detected');
    }
    console.log('');

    console.log('Shortcode Remnants:');
    if (report.shortcodeRemnants.length > 0) {
      console.log('  ⚠️  Found shortcode remnants:');
      report.shortcodeRemnants.forEach((finding) => {
        console.log(`    - ${finding.count} matches for ${finding.pattern}`);
        finding.samples.forEach((sample) => {
          console.log(`      "${sample}"`);
        });
      });
    } else {
      console.log('  ✓ No shortcode remnants detected');
    }
    console.log('');

    console.log('Accessibility:');
    console.log(
      `  Main landmark: ${report.accessibility.hasMainLandmark ? '✓' : '❌'}`
    );
    console.log(`  H1 present: ${report.accessibility.hasH1 ? '✓' : '❌'}`);
    if (report.accessibility.h1Text) {
      console.log(`  H1 text: "${report.accessibility.h1Text}"`);
    }
    console.log(
      `  Images without alt: ${report.accessibility.imagesWithoutAlt}`
    );
    console.log(
      `  Links without text: ${report.accessibility.linksWithoutText}\n`
    );

    console.log('Content Structure:');
    console.log(`  Headings: ${report.contentStructure.headings.length}`);
    console.log(`  Code blocks: ${report.contentStructure.codeBlocks.total}`);
    if (Object.keys(report.contentStructure.codeBlocks.byLanguage).length > 0) {
      console.log('  Languages:');
      Object.entries(report.contentStructure.codeBlocks.byLanguage).forEach(
        ([lang, count]) => {
          console.log(`    - ${lang}: ${count}`);
        }
      );
    }
    console.log('');

    // Save report if requested
    if (outputPath) {
      await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
      console.log(`\n✓ Report saved to: ${outputPath}`);
    }

    console.log('');
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
