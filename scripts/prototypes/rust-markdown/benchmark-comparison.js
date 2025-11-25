#!/usr/bin/env node
/**
 * Benchmark comparison: JavaScript (turndown.js) vs Rust (html2md)
 *
 * Tests conversion performance on different dataset sizes.
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import { createRequire } from 'module';
import { execSync } from 'child_process';
import path from 'path';

const require = createRequire(import.meta.url);
const { convertToMarkdown } = require('../../lib/markdown-converter.cjs');

// Test scenarios
const scenarios = [
  {
    name: 'Small (7 files)',
    path: 'public/influxdb3/core/get-started',
  },
  {
    name: 'Medium (357 files)',
    path: 'public/influxdb3/core',
  },
  {
    name: 'Large (all influxdb3)',
    path: 'public/influxdb3',
  },
];

/**
 * Benchmark JavaScript conversion
 */
async function benchmarkJavaScript(dirPath) {
  const htmlFiles = await glob(`${dirPath}/**/index.html`, {
    ignore: ['**/node_modules/**', '**/api-docs/**'],
  });

  console.log(`  Found ${htmlFiles.length} files`);

  const startTime = Date.now();
  let successCount = 0;
  let errorCount = 0;

  for (const htmlPath of htmlFiles) {
    try {
      const html = await fs.readFile(htmlPath, 'utf-8');
      const urlPath = htmlPath.replace(/^public/, '').replace(/\/index\.html$/, '/');
      const markdown = await convertToMarkdown(html, urlPath);

      if (markdown) {
        successCount++;
      } else {
        errorCount++;
      }
    } catch (err) {
      errorCount++;
    }
  }

  const duration = (Date.now() - startTime) / 1000;
  const throughput = successCount / duration;

  return {
    count: htmlFiles.length,
    success: successCount,
    errors: errorCount,
    duration,
    throughput,
  };
}

/**
 * Benchmark Rust conversion
 */
function benchmarkRust(dirPath) {
  const rustBinary = path.join(process.cwd(), 'target/release/rust-markdown');

  try {
    // Run benchmark and capture output
    const output = execSync(
      `${rustBinary} benchmark ${dirPath} 2>&1`,
      { encoding: 'utf-8' }
    );

    // Parse results from output
    const filesMatch = output.match(/Files processed:\s+(\d+)/);
    const errorsMatch = output.match(/Errors:\s+(\d+)/);
    const conversionTimeMatch = output.match(/Conversion time:\s+([\d.]+)s/);
    const throughputMatch = output.match(/Throughput:\s+([\d.]+)\s+files\/sec/);

    return {
      count: filesMatch ? parseInt(filesMatch[1]) : 0,
      success: filesMatch ? parseInt(filesMatch[1]) : 0,
      errors: errorsMatch ? parseInt(errorsMatch[1]) : 0,
      duration: conversionTimeMatch ? parseFloat(conversionTimeMatch[1]) : 0,
      throughput: throughputMatch ? parseFloat(throughputMatch[1]) : 0,
    };
  } catch (err) {
    console.error('Rust benchmark failed:', err.message);
    return null;
  }
}

/**
 * Main benchmark runner
 */
async function main() {
  console.log('🔬 Benchmark Comparison: JavaScript vs Rust\n');
  console.log('════════════════════════════════════════════\n');

  const results = [];

  for (const scenario of scenarios) {
    console.log(`📊 ${scenario.name}`);
    console.log(`   Path: ${scenario.path}\n`);

    // JavaScript benchmark
    console.log('  JavaScript (turndown.js):');
    const jsResult = await benchmarkJavaScript(scenario.path);
    console.log(`    Duration:    ${jsResult.duration.toFixed(2)}s`);
    console.log(`    Throughput:  ${jsResult.throughput.toFixed(1)} files/sec`);
    console.log(`    Processed:   ${jsResult.success}/${jsResult.count}\n`);

    // Rust benchmark
    console.log('  Rust (html2md):');
    const rustResult = benchmarkRust(scenario.path);
    if (rustResult) {
      console.log(`    Duration:    ${rustResult.duration.toFixed(2)}s`);
      console.log(`    Throughput:  ${rustResult.throughput.toFixed(1)} files/sec`);
      console.log(`    Processed:   ${rustResult.success}/${rustResult.count}\n`);

      const speedup = rustResult.throughput / jsResult.throughput;
      const timeSaved = jsResult.duration - rustResult.duration;

      console.log(`  ⚡ Speedup: ${speedup.toFixed(1)}× faster`);
      console.log(`  ⏱️  Time saved: ${timeSaved.toFixed(2)}s\n`);

      results.push({
        scenario: scenario.name,
        files: jsResult.count,
        jsDuration: jsResult.duration,
        jsThroughput: jsResult.throughput,
        rustDuration: rustResult.duration,
        rustThroughput: rustResult.throughput,
        speedup,
        timeSaved,
      });
    }

    console.log('────────────────────────────────────────────\n');
  }

  // Summary table
  console.log('════════════════════════════════════════════');
  console.log('📊 Summary');
  console.log('════════════════════════════════════════════\n');

  console.table(results.map(r => ({
    'Scenario': r.scenario,
    'Files': r.files,
    'JS Time (s)': r.jsDuration.toFixed(2),
    'Rust Time (s)': r.rustDuration.toFixed(2),
    'Speedup': `${r.speedup.toFixed(1)}×`,
    'Time Saved (s)': r.timeSaved.toFixed(2),
  })));

  // Calculate potential full-site impact
  const avgSpeedup = results.reduce((sum, r) => sum + r.speedup, 0) / results.length;
  const estimatedFullSiteTime = 105 / avgSpeedup; // Current full build is ~105s

  console.log('\n📈 Projected Full Site (5000+ files):');
  console.log(`   Current (JS):     105s`);
  console.log(`   Estimated (Rust): ${estimatedFullSiteTime.toFixed(1)}s`);
  console.log(`   Time saved:       ${(105 - estimatedFullSiteTime).toFixed(1)}s\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
