#!/usr/bin/env node

/**
 * Link Extractor for Documentation Files
 * Extracts all links from markdown and HTML files with metadata for caching and incremental validation
 */

import fs from 'fs';
import crypto from 'crypto';
import matter from 'gray-matter';
import path from 'path';
import process from 'process';

/**
 * Extract links from markdown content
 * @param {string} content - File content
 * @param {string} filePath - Path to the file
 * @returns {Array} Array of link objects with metadata
 */
function extractMarkdownLinks(content, filePath) {
  const links = [];
  const lines = content.split('\n');

  // Track reference-style link definitions
  const referenceLinks = new Map();

  // First pass: collect reference definitions
  content.replace(/^\s*\[([^\]]+)\]:\s*(.+)$/gm, (match, ref, url) => {
    referenceLinks.set(ref.toLowerCase(), url.trim());
    return match;
  });

  // Process each line for links
  lines.forEach((line, lineIndex) => {
    const lineNumber = lineIndex + 1;

    // Standard markdown links
    let match;
    const standardLinkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    while ((match = standardLinkRegex.exec(line)) !== null) {
      const linkText = match[1];
      const url = match[2];
      const columnStart = match.index;

      links.push({
        url: url.trim(),
        text: linkText,
        type: 'markdown',
        line: lineNumber,
        column: columnStart,
        context: line.trim(),
        hash: generateLinkHash(url.trim(), filePath, lineNumber),
      });
    }

    // Reference-style links
    const refLinkRegex = /\[([^\]]*)\]\[([^\]]*)\]/g;
    while ((match = refLinkRegex.exec(line)) !== null) {
      const linkText = match[1];
      const refKey = (match[2] || linkText).toLowerCase();
      const url = referenceLinks.get(refKey);

      if (url) {
        const columnStart = match.index;
        links.push({
          url: url,
          text: linkText,
          type: 'markdown-reference',
          line: lineNumber,
          column: columnStart,
          context: line.trim(),
          reference: refKey,
          hash: generateLinkHash(url, filePath, lineNumber),
        });
      }
    }

    // Autolinks
    const autolinkRegex = /<(https?:\/\/[^>]+)>/g;
    while ((match = autolinkRegex.exec(line)) !== null) {
      const url = match[1];
      const columnStart = match.index;

      links.push({
        url: url,
        text: url,
        type: 'autolink',
        line: lineNumber,
        column: columnStart,
        context: line.trim(),
        hash: generateLinkHash(url, filePath, lineNumber),
      });
    }

    // Bare URLs (basic detection, avoid false positives)
    const bareUrlRegex = /(?:^|[\s\n])(https?:\/\/[^\s\)]+)/g;
    while ((match = bareUrlRegex.exec(line)) !== null) {
      const url = match[1];
      const columnStart = match.index + match[0].length - url.length;

      // Skip if this URL is already captured in a proper markdown link
      const alreadyCaptured = links.some(
        (link) =>
          link.line === lineNumber &&
          Math.abs(link.column - columnStart) < 10 &&
          link.url === url
      );

      if (!alreadyCaptured) {
        links.push({
          url: url,
          text: url,
          type: 'bare-url',
          line: lineNumber,
          column: columnStart,
          context: line.trim(),
          hash: generateLinkHash(url, filePath, lineNumber),
        });
      }
    }
  });

  return links;
}

/**
 * Extract links from HTML content
 * @param {string} content - File content
 * @param {string} filePath - Path to the file
 * @returns {Array} Array of link objects with metadata
 */
function extractHtmlLinks(content, filePath) {
  const links = [];
  const lines = content.split('\n');

  lines.forEach((line, lineIndex) => {
    const lineNumber = lineIndex + 1;
    let match;

    const htmlLinkRegex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;
    while ((match = htmlLinkRegex.exec(line)) !== null) {
      const url = match[1];
      const columnStart = match.index;

      // Extract link text if possible
      const fullMatch = match[0];
      const textMatch = fullMatch.match(/>([^<]*)</);
      const linkText = textMatch ? textMatch[1].trim() : url;

      links.push({
        url: url,
        text: linkText,
        type: 'html',
        line: lineNumber,
        column: columnStart,
        context: line.trim(),
        hash: generateLinkHash(url, filePath, lineNumber),
      });
    }
  });

  return links;
}

/**
 * Generate a unique hash for a link
 * @param {string} url - The URL
 * @param {string} filePath - File path
 * @param {number} line - Line number
 * @returns {string} Hash string
 */
function generateLinkHash(url, filePath, line) {
  const data = `${filePath}:${line}:${url.trim()}`;
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Generate a hash for file content
 * @param {string} content - File content
 * @returns {string} Hash string
 */
function generateFileHash(content) {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Categorize link types for validation
 * @param {string} url - The URL to categorize
 * @returns {Object} Link category information
 */
function categorizeLinkType(url) {
  const trimmedUrl = url.trim();

  // External links
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return {
      category: 'external',
      protocol: trimmedUrl.startsWith('https://') ? 'https' : 'http',
      needsValidation: true,
    };
  }

  // Internal absolute links
  if (trimmedUrl.startsWith('/')) {
    return {
      category: 'internal-absolute',
      needsValidation: true,
    };
  }

  // Relative links
  if (
    trimmedUrl.startsWith('./') ||
    trimmedUrl.startsWith('../') ||
    (!trimmedUrl.startsWith('#') && !trimmedUrl.includes('://'))
  ) {
    return {
      category: 'internal-relative',
      needsValidation: true,
    };
  }

  // Fragment/anchor links
  if (trimmedUrl.startsWith('#')) {
    return {
      category: 'fragment',
      needsValidation: true, // May need validation for internal page anchors
    };
  }

  // Special protocols (mailto, tel, etc.)
  if (trimmedUrl.includes('://') && !trimmedUrl.startsWith('http')) {
    return {
      category: 'special-protocol',
      needsValidation: false,
    };
  }

  return {
    category: 'unknown',
    needsValidation: true,
  };
}

/**
 * Extract all links from a file
 * @param {string} filePath - Path to the file
 * @returns {Object} File analysis with links and metadata
 */
function extractLinksFromFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const fileHash = generateFileHash(content);
    const extension = path.extname(filePath).toLowerCase();

    let links = [];
    let frontmatter = {};
    let bodyContent = content;

    // Parse frontmatter for .md files
    if (extension === '.md') {
      try {
        const parsed = matter(content);
        frontmatter = parsed.data || {};
        bodyContent = parsed.content;
      } catch (err) {
        console.warn(
          `Warning: Could not parse frontmatter in ${filePath}: ${err.message}`
        );
      }

      // Extract links from markdown content
      links = extractMarkdownLinks(bodyContent, filePath);
    } else if (extension === '.html') {
      // Extract links from HTML content
      links = extractHtmlLinks(content, filePath);
    } else {
      console.warn(`Warning: Unsupported file type for ${filePath}`);
      return null;
    }

    // Categorize and enhance links
    const enhancedLinks = links.map((link) => ({
      ...link,
      ...categorizeLinkType(link.url),
      filePath,
    }));

    // Calculate statistics
    const stats = {
      totalLinks: enhancedLinks.length,
      externalLinks: enhancedLinks.filter((l) => l.category === 'external')
        .length,
      internalLinks: enhancedLinks.filter((l) =>
        l.category.startsWith('internal')
      ).length,
      fragmentLinks: enhancedLinks.filter((l) => l.category === 'fragment')
        .length,
      linksNeedingValidation: enhancedLinks.filter((l) => l.needsValidation)
        .length,
    };

    return {
      filePath,
      fileHash,
      extension,
      frontmatter,
      links: enhancedLinks,
      stats,
      extractedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error extracting links from ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Main function for CLI usage
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node link-extractor.js <file1> [file2] [...]');
    console.error('       node link-extractor.js --help');
    process.exit(1);
  }

  if (args[0] === '--help') {
    console.log(`
Link Extractor for Documentation Files

Usage:
  node link-extractor.js <file1> [file2] [...]  Extract links from files
  node link-extractor.js --help                 Show this help

Options:
  --json          Output results as JSON
  --stats-only    Show only statistics
  --filter TYPE   Filter links by category (external, internal-absolute, internal-relative, fragment)

Examples:
  node link-extractor.js content/influxdb3/core/install.md
  node link-extractor.js --json content/**/*.md
  node link-extractor.js --stats-only --filter external content/influxdb3/**/*.md
`);
    process.exit(0);
  }

  const jsonOutput = args.includes('--json');
  const statsOnly = args.includes('--stats-only');
  const filterType = args.includes('--filter')
    ? args[args.indexOf('--filter') + 1]
    : null;

  const files = args.filter(
    (arg) => !arg.startsWith('--') && arg !== filterType
  );
  const results = [];

  for (const filePath of files) {
    const result = extractLinksFromFile(filePath);
    if (result) {
      // Apply filter if specified
      if (filterType) {
        result.links = result.links.filter(
          (link) => link.category === filterType
        );
        // Recalculate stats after filtering
        result.stats = {
          totalLinks: result.links.length,
          externalLinks: result.links.filter((l) => l.category === 'external')
            .length,
          internalLinks: result.links.filter((l) =>
            l.category.startsWith('internal')
          ).length,
          fragmentLinks: result.links.filter((l) => l.category === 'fragment')
            .length,
          linksNeedingValidation: result.links.filter((l) => l.needsValidation)
            .length,
        };
      }

      results.push(result);
    }
  }

  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  } else if (statsOnly) {
    console.log('\nLink Extraction Statistics:');
    console.log('==========================');

    let totalFiles = 0;
    let totalLinks = 0;
    let totalExternal = 0;
    let totalInternal = 0;
    let totalFragment = 0;
    let totalNeedingValidation = 0;

    results.forEach((result) => {
      totalFiles++;
      totalLinks += result.stats.totalLinks;
      totalExternal += result.stats.externalLinks;
      totalInternal += result.stats.internalLinks;
      totalFragment += result.stats.fragmentLinks;
      totalNeedingValidation += result.stats.linksNeedingValidation;

      console.log(
        `${result.filePath}: ${result.stats.totalLinks} links (${result.stats.linksNeedingValidation} need validation)`
      );
    });

    console.log('\nSummary:');
    console.log(`  Total files: ${totalFiles}`);
    console.log(`  Total links: ${totalLinks}`);
    console.log(`  External links: ${totalExternal}`);
    console.log(`  Internal links: ${totalInternal}`);
    console.log(`  Fragment links: ${totalFragment}`);
    console.log(`  Links needing validation: ${totalNeedingValidation}`);
  } else {
    results.forEach((result) => {
      console.log(`\nFile: ${result.filePath}`);
      console.log(`Hash: ${result.fileHash}`);
      console.log(`Links found: ${result.stats.totalLinks}`);
      console.log(
        `Links needing validation: ${result.stats.linksNeedingValidation}`
      );

      if (result.links.length > 0) {
        console.log('\nLinks:');
        result.links.forEach((link, index) => {
          console.log(`  ${index + 1}. [${link.category}] ${link.url}`);
          console.log(`     Line ${link.line}, Column ${link.column}`);
          console.log(`     Text: "${link.text}"`);
          console.log(`     Hash: ${link.hash}`);
          if (link.reference) {
            console.log(`     Reference: ${link.reference}`);
          }
          console.log('');
        });
      }
    });
  }
}

// Export functions for use as a module
export {
  extractLinksFromFile,
  extractMarkdownLinks,
  extractHtmlLinks,
  generateFileHash,
  generateLinkHash,
  categorizeLinkType,
};

// Run main function if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
