/**
 * Comment Generator for Link Validation Results
 * Standardizes PR comment generation across workflows
 * Includes cache performance metrics and optimization info
 */

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

/**
 * Normalize broken link data from different report formats
 * @param {Object|Array} reportData - Raw report data
 * @returns {Array} - Normalized array of broken links
 */
function normalizeBrokenLinks(reportData) {
  if (!reportData) return [];

  let links = [];

  if (Array.isArray(reportData)) {
    reportData.forEach((item) => {
      if (item.links && Array.isArray(item.links)) {
        // Format: { sourceFile: "file.md", links: [...] }
        item.links.forEach((link) => {
          links.push({
            sourceFile: item.sourceFile || item.page || 'Unknown',
            url: link.url || link.href,
            linkText: link.linkText || link.url || link.href,
            status: link.status,
            error: link.error,
            type: link.type,
          });
        });
      } else {
        // Format: direct link object
        links.push({
          sourceFile: item.sourceFile || item.page || 'Unknown',
          url: item.url || item.href,
          linkText: item.linkText || item.url || item.href,
          status: item.status,
          error: item.error,
          type: item.type,
        });
      }
    });
  }

  return links;
}

/**
 * Group broken links by source file
 * @param {Array} brokenLinks - Array of normalized broken links
 * @returns {Object} - Object with source files as keys
 */
function groupLinksBySource(brokenLinks) {
  const bySource = {};

  brokenLinks.forEach((link) => {
    const source = link.sourceFile || 'Unknown';
    if (!bySource[source]) {
      bySource[source] = [];
    }
    bySource[source].push(link);
  });

  return bySource;
}

/**
 * Generate markdown comment for PR
 * @param {Array} allBrokenLinks - Array of all broken links
 * @param {Object} options - Generation options
 * @returns {string} - Markdown comment content
 */
/**
 * Load cache statistics from reports directory
 * @param {string} reportsDir - Directory containing reports
 * @returns {Object|null} Cache statistics or null if not found
 */
function loadCacheStats(reportsDir) {
  try {
    const cacheStatsFile = path.join(reportsDir, 'cache_statistics.json');
    if (fs.existsSync(cacheStatsFile)) {
      const content = fs.readFileSync(cacheStatsFile, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn(`Warning: Could not load cache stats: ${error.message}`);
  }
  return null;
}

function generateComment(allBrokenLinks, options = {}) {
  const {
    includeSuccessMessage = true,
    includeStats = true,
    includeActionRequired = true,
    maxLinksPerFile = 20,
    cacheStats = null,
    reportsDir = null,
  } = options;

  // Load cache stats if reports directory is provided
  const actualCacheStats =
    cacheStats || (reportsDir ? loadCacheStats(reportsDir) : null);

  let comment = '';

  // Add cache performance metrics at the top
  if (actualCacheStats) {
    comment += '## 📊 Link Validation Performance\n\n';
    comment += `- **Cache Hit Rate:** ${actualCacheStats.hitRate}%\n`;
    comment += `- **Files Cached:** ${actualCacheStats.cacheHits} (skipped validation)\n`;
    comment += `- **Files Validated:** ${actualCacheStats.cacheMisses}\n`;

    if (actualCacheStats.hitRate >= 50) {
      comment +=
        '- **Performance:** 🚀 Cache optimization saved significant validation time!\n';
    } else if (actualCacheStats.hitRate > 0) {
      comment +=
        '- **Performance:** ⚡ Some files were cached, improving validation speed\n';
    }
    comment += '\n';
  }

  if (!allBrokenLinks || allBrokenLinks.length === 0) {
    comment += '## ✅ Link Validation Passed\n\n';
    comment += 'All links in the changed files are valid!';

    if (actualCacheStats && actualCacheStats.hitRate === 100) {
      comment += '\n\n✨ **All files were cached** - no validation was needed!';
    }

    return includeSuccessMessage ? comment : '';
  }

  comment += '## 🔗 Broken Links Found\n\n';

  if (includeStats) {
    comment += `Found ${allBrokenLinks.length} broken link(s) in the changed files:\n\n`;
  }

  // Group by source file
  const bySource = groupLinksBySource(allBrokenLinks);

  // Generate sections for each source file
  for (const [source, links] of Object.entries(bySource)) {
    comment += `### ${source}\n\n`;

    const displayLinks = links.slice(0, maxLinksPerFile);
    const hiddenCount = links.length - displayLinks.length;

    displayLinks.forEach((link) => {
      const url = link.url || 'Unknown URL';
      const linkText = link.linkText || url;
      const status = link.status || 'Unknown';

      comment += `- [ ] **${linkText}** → \`${url}\`\n`;
      comment += `  - Status: ${status}\n`;

      if (link.type) {
        comment += `  - Type: ${link.type}\n`;
      }

      if (link.error) {
        comment += `  - Error: ${link.error}\n`;
      }

      comment += '\n';
    });

    if (hiddenCount > 0) {
      comment += `<details>\n<summary>... and ${hiddenCount} more broken link(s)</summary>\n\n`;

      links.slice(maxLinksPerFile).forEach((link) => {
        const url = link.url || 'Unknown URL';
        const linkText = link.linkText || url;
        const status = link.status || 'Unknown';

        comment += `- [ ] **${linkText}** → \`${url}\` (Status: ${status})\n`;
      });

      comment += '\n</details>\n\n';
    }
  }

  if (includeActionRequired) {
    comment += '\n---\n';
    comment +=
      '**Action Required:** Please fix the broken links before merging this PR.';
  }

  return comment;
}

/**
 * Load and merge broken link reports from artifacts
 * @param {string} reportsDir - Directory containing report artifacts
 * @returns {Array} - Array of all broken links
 */
function loadBrokenLinkReports(reportsDir) {
  const allBrokenLinks = [];

  if (!fs.existsSync(reportsDir)) {
    return allBrokenLinks;
  }

  try {
    const reportDirs = fs.readdirSync(reportsDir);

    for (const dir of reportDirs) {
      if (dir.startsWith('broken-links-')) {
        const reportPath = path.join(
          reportsDir,
          dir,
          'broken_links_report.json'
        );

        if (fs.existsSync(reportPath)) {
          try {
            const reportContent = fs.readFileSync(reportPath, 'utf8');
            const reportData = JSON.parse(reportContent);
            const normalizedLinks = normalizeBrokenLinks(reportData);
            allBrokenLinks.push(...normalizedLinks);
          } catch (e) {
            console.error(`Error reading ${reportPath}: ${e.message}`);
          }
        }
      }
    }
  } catch (e) {
    console.error(
      `Error reading reports directory ${reportsDir}: ${e.message}`
    );
  }

  return allBrokenLinks;
}

/**
 * CLI interface for the comment generator
 */
function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node comment-generator.js [options] <reports-dir>

Options:
  --no-success         Don't include success message when no broken links
  --no-stats           Don't include broken link statistics
  --no-action-required Don't include action required message
  --max-links <n>      Maximum links to show per file (default: 20)
  --output-file <file> Write comment to file instead of stdout
  --help, -h           Show this help message

Examples:
  node comment-generator.js reports/
  node comment-generator.js --max-links 10 --output-file comment.md reports/
`);
    process.exit(0);
  }

  // Parse arguments
  let reportsDir = '';
  const options = {
    includeSuccessMessage: true,
    includeStats: true,
    includeActionRequired: true,
    maxLinksPerFile: 20,
  };
  let outputFile = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--no-success') {
      options.includeSuccessMessage = false;
    } else if (arg === '--no-stats') {
      options.includeStats = false;
    } else if (arg === '--no-action-required') {
      options.includeActionRequired = false;
    } else if (arg === '--max-links' && i + 1 < args.length) {
      options.maxLinksPerFile = parseInt(args[++i]);
    } else if (arg === '--output-file' && i + 1 < args.length) {
      outputFile = args[++i];
    } else if (!arg.startsWith('--')) {
      reportsDir = arg;
    }
  }

  if (!reportsDir) {
    console.error('Error: reports directory is required');
    process.exit(1);
  }

  // Load reports and generate comment with cache stats
  const brokenLinks = loadBrokenLinkReports(reportsDir);
  options.reportsDir = reportsDir;
  const comment = generateComment(brokenLinks, options);

  if (outputFile) {
    fs.writeFileSync(outputFile, comment);
    console.log(`Comment written to ${outputFile}`);
  } else {
    console.log(comment);
  }

  // Exit with error code if there are broken links
  if (brokenLinks.length > 0) {
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}

export {
  generateComment,
  loadBrokenLinkReports,
  normalizeBrokenLinks,
  groupLinksBySource,
};
