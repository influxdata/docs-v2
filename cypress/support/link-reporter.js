/**
 * Broken Links Reporter
 * Handles collecting, storing, and reporting broken links found during tests
 */
import fs from 'fs';

export const BROKEN_LINKS_FILE = '/tmp/broken_links_report.json';
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
    return fileContent && fileContent !== '[]' ? JSON.parse(fileContent) : [];
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

  if (!brokenLinksReport || brokenLinksReport.length === 0) {
    console.log('✅ No broken links detected');
    return 0;
  }

  // Load sources mapping
  const sourcesMapping = readSourcesMapping();

  // Print a prominent header
  console.error('\n\n' + '='.repeat(80));
  console.error(' 🚨 BROKEN LINKS DETECTED 🚨 ');
  console.error('='.repeat(80));

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
 * Initialize the broken links report file
 * @returns {boolean} True if initialization was successful
 */
export function initializeReport() {
  try {
    fs.writeFileSync(BROKEN_LINKS_FILE, '[]', 'utf8');
    return true;
  } catch (err) {
    console.error(`Error initializing broken links report: ${err.message}`);
    return false;
  }
}
