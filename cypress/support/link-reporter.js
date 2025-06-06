/**
 * Broken Links Reporter
 * Handles collecting, storing, and reporting broken links found during tests
 */
import fs from 'fs';

export const BROKEN_LINKS_FILE = '/tmp/broken_links_report.json';
export const FIRST_BROKEN_LINK_FILE = '/tmp/first_broken_link.json';
const SOURCES_FILE = '/tmp/test_subjects_sources.json';

/**
 * Reads the broken links report from the file system
 * @returns {Array} Parsed report data or empty array if file doesn't exist
 */
export function readBrokenLinksReport() {
  if (!fs.existsSync(BROKEN_LINKS_FILE)) {
    return [];
  }

  try {
    const fileContent = fs.readFileSync(BROKEN_LINKS_FILE, 'utf8');

    // Check if the file is empty or contains only an empty array
    if (!fileContent || fileContent.trim() === '' || fileContent === '[]') {
      return [];
    }

    // Try to parse the JSON content
    try {
      const parsedContent = JSON.parse(fileContent);

      // Ensure the parsed content is an array
      if (!Array.isArray(parsedContent)) {
        console.error('Broken links report is not an array');
        return [];
      }

      return parsedContent;
    } catch (parseErr) {
      console.error(
        `Error parsing broken links report JSON: ${parseErr.message}`
      );
      return [];
    }
  } catch (err) {
    console.error(`Error reading broken links report: ${err.message}`);
    return [];
  }
}

/**
 * Reads the sources mapping file
 * @returns {Object} A mapping from URLs to their source files
 */
function readSourcesMapping() {
  try {
    if (fs.existsSync(SOURCES_FILE)) {
      const sourcesData = JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf8'));
      return sourcesData.reduce((acc, item) => {
        if (item.url && item.source) {
          acc[item.url] = item.source;
        }
        return acc;
      }, {});
    }
  } catch (err) {
    console.warn(`Warning: Could not read sources mapping: ${err.message}`);
  }
  return {};
}

/**
 * Formats and displays the broken links report to the console
 * @param {Array} brokenLinksReport - The report data to display
 * @returns {number} The total number of broken links found
 */
export function displayBrokenLinksReport(brokenLinksReport = null) {
  // If no report provided, read from file
  if (!brokenLinksReport) {
    brokenLinksReport = readBrokenLinksReport();
  }

  // Check both the report and first broken link file to determine if we have broken links
  const firstBrokenLink = readFirstBrokenLink();

  // Only report "no broken links" if both checks pass
  if (
    (!brokenLinksReport || brokenLinksReport.length === 0) &&
    !firstBrokenLink
  ) {
    console.log('✅ No broken links detected in the validation report');
    return 0;
  }

  // Special case: check if the single broken link file could be missing from the report
  if (
    firstBrokenLink &&
    (!brokenLinksReport || brokenLinksReport.length === 0)
  ) {
    console.error(
      '\n⚠️ Warning: First broken link record exists but no links in the report.'
    );
    console.error('This could indicate a reporting issue.');
  }

  // Load sources mapping
  const sourcesMapping = readSourcesMapping();

  // Print a prominent header
  console.error('\n\n' + '='.repeat(80));
  console.error(' 🚨 BROKEN LINKS DETECTED 🚨 ');
  console.error('='.repeat(80));

  // Show first failing link if available
  if (firstBrokenLink) {
    console.error('\n🔴 FIRST FAILING LINK:');
    console.error(`  URL: ${firstBrokenLink.url}`);
    console.error(`  Status: ${firstBrokenLink.status}`);
    console.error(`  Type: ${firstBrokenLink.type}`);
    console.error(`  Page: ${firstBrokenLink.page}`);
    if (firstBrokenLink.linkText) {
      console.error(
        `  Link text: "${firstBrokenLink.linkText.substring(0, 50)}${firstBrokenLink.linkText.length > 50 ? '...' : ''}"`
      );
    }
    console.error('-'.repeat(40));
  }

  let totalBrokenLinks = 0;

  brokenLinksReport.forEach((report) => {
    console.error(`\n📄 PAGE: ${report.page}`);

    // Add source information if available
    const source = sourcesMapping[report.page];
    if (source) {
      console.error(`  PAGE CONTENT SOURCE: ${source}`);
    }

    console.error('-'.repeat(40));

    report.links.forEach((link) => {
      console.error(`• ${link.url}`);
      console.error(`  - Status: ${link.status}`);
      console.error(`  - Type: ${link.type}`);
      if (link.linkText) {
        console.error(
          `  - Link text: "${link.linkText.substring(0, 50)}${link.linkText.length > 50 ? '...' : ''}"`
        );
      }
      console.error('');
      totalBrokenLinks++;
    });
  });

  // Print a prominent summary footer
  console.error('='.repeat(80));
  console.error(`📊 TOTAL BROKEN LINKS FOUND: ${totalBrokenLinks}`);
  console.error('='.repeat(80) + '\n');

  return totalBrokenLinks;
}

/**
 * Reads the first broken link info from the file system
 * @returns {Object|null} First broken link data or null if not found
 */
export function readFirstBrokenLink() {
  if (!fs.existsSync(FIRST_BROKEN_LINK_FILE)) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(FIRST_BROKEN_LINK_FILE, 'utf8');

    // Check if the file is empty or contains whitespace only
    if (!fileContent || fileContent.trim() === '') {
      return null;
    }

    // Try to parse the JSON content
    try {
      return JSON.parse(fileContent);
    } catch (parseErr) {
      console.error(
        `Error parsing first broken link JSON: ${parseErr.message}`
      );
      return null;
    }
  } catch (err) {
    console.error(`Error reading first broken link: ${err.message}`);
    return null;
  }
}

/**
 * Initialize the broken links report files
 * @returns {boolean} True if initialization was successful
 */
export function initializeReport() {
  try {
    // Create an empty array for the broken links report
    fs.writeFileSync(BROKEN_LINKS_FILE, '[]', 'utf8');

    // Reset the first broken link file by creating an empty file
    // Using empty string as a clear indicator that no broken link has been recorded yet
    fs.writeFileSync(FIRST_BROKEN_LINK_FILE, '', 'utf8');

    console.debug('🔄 Initialized broken links reporting system');
    return true;
  } catch (err) {
    console.error(`Error initializing broken links report: ${err.message}`);
    return false;
  }
}
