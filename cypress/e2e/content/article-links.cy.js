/// <reference types="cypress" />

describe('Article', () => {
  let subjects = Cypress.env('test_subjects').split(',');
  let validationStrategy = null;

  // Always use HEAD for downloads to avoid timeouts
  const useHeadForDownloads = true;

  // Set up initialization for tests
  before(() => {
    // Initialize the broken links report
    cy.task('initializeBrokenLinksReport');

    // Get source file paths for incremental validation
    const testSubjectsData = Cypress.env('test_subjects_data');
    let sourceFilePaths = subjects; // fallback to subjects if no data available

    if (testSubjectsData) {
      try {
        const urlToSourceData = JSON.parse(testSubjectsData);
        // Extract source file paths from the structured data
        sourceFilePaths = urlToSourceData.map((item) => item.source);
      } catch (e) {
        console.warn(
          'Could not parse test_subjects_data, using subjects as fallback'
        );
      }
    }

    // Run incremental validation analysis with source file paths
    cy.task('runIncrementalValidation', sourceFilePaths)
      .then((results) => {
        validationStrategy = results.validationStrategy;

        // Save cache statistics and validation strategy for reporting
        cy.task('saveCacheStatistics', results.cacheStats);
        cy.task('saveValidationStrategy', validationStrategy);

        // Update subjects to only test files that need validation
        if (results.filesToValidate.length > 0) {
          // Convert file paths to URLs using shared utility via Cypress task
          const urlPromises = results.filesToValidate.map((file) =>
            cy.task('filePathToUrl', file.filePath)
          );

          cy.wrap(Promise.all(urlPromises)).then((urls) => {
            subjects = urls;

            cy.log(`📊 Cache Analysis: ${results.cacheStats.hitRate}% hit rate`);
            cy.log(
              `🔄 Testing ${subjects.length} pages (${results.cacheStats.cacheHits} cached)`
            );
          });
        } else {
          // All files are cached, no validation needed
          subjects = [];
          cy.log('✨ All files cached - skipping validation');
        }
      })
      .catch((error) => {
        cy.log('❌ Error during incremental validation task: ' + error.message);
        Cypress.fail('Incremental validation task failed. See logs for details.');
      });
  });

  // Helper function to identify download links
  function isDownloadLink(href) {
    // Check for common download file extensions
    const downloadExtensions = [
      '.pdf',
      '.zip',
      '.tar.gz',
      '.tgz',
      '.rar',
      '.exe',
      '.dmg',
      '.pkg',
      '.deb',
      '.rpm',
      '.xlsx',
      '.csv',
      '.doc',
      '.docx',
      '.ppt',
      '.pptx',
    ];

    // Check for download domains or paths
    const downloadDomains = ['dl.influxdata.com', 'downloads.influxdata.com'];

    // Check if URL contains a download extension
    const hasDownloadExtension = downloadExtensions.some((ext) =>
      href.toLowerCase().endsWith(ext)
    );

    // Check if URL is from a download domain
    const isFromDownloadDomain = downloadDomains.some((domain) =>
      href.toLowerCase().includes(domain)
    );

    // Return true if either condition is met
    return hasDownloadExtension || isFromDownloadDomain;
  }

  // Helper function to make appropriate request based on link type
  function testLink(href, linkText = '', pageUrl) {
    // Common request options for both methods
    const requestOptions = {
      failOnStatusCode: true,
      timeout: 15000, // Increased timeout for reliability
      followRedirect: true, // Explicitly follow redirects
      retryOnNetworkFailure: true, // Retry on network issues
      retryOnStatusCodeFailure: true, // Retry on 5xx errors
    };

    function handleFailedLink(url, status, type, redirectChain = '') {
      // Report the broken link
      cy.task('reportBrokenLink', {
        url: url + redirectChain,
        status,
        type,
        linkText,
        page: pageUrl,
      });

      // Throw error for broken links
      throw new Error(
        `BROKEN ${type.toUpperCase()} LINK: ${url} (status: ${status})${redirectChain} on ${pageUrl}`
      );
    }

    if (useHeadForDownloads && isDownloadLink(href)) {
      cy.log(`** Testing download link with HEAD: ${href} **`);
      cy.request({
        method: 'HEAD',
        url: href,
        ...requestOptions,
      }).then((response) => {
        // Check final status after following any redirects
        if (response.status >= 400) {
          // Build redirect info string if available
          const redirectInfo =
            response.redirects && response.redirects.length > 0
              ? ` (redirected to: ${response.redirects.join(' -> ')})`
              : '';

          handleFailedLink(href, response.status, 'download', redirectInfo);
        }
      });
    } else {
      cy.log(`** Testing link: ${href} **`);
      cy.log(JSON.stringify(requestOptions));
      cy.request({
        url: href,
        ...requestOptions,
      }).then((response) => {
        // Check final status after following any redirects
        if (response.status >= 400) {
          // Build redirect info string if available
          const redirectInfo =
            response.redirects && response.redirects.length > 0
              ? ` (redirected to: ${response.redirects.join(' -> ')})`
              : '';

          handleFailedLink(href, response.status, 'regular', redirectInfo);
        }
      });
    }
  }

  // Test implementation for subjects
  subjects.forEach((subject) => {
    it(`${subject} has valid internal links`, function () {
      cy.visit(`${subject}`, { timeout: 20000 });

      // Test internal links
      cy.get('article, .api-content').then(($article) => {
        // Find links without failing the test if none are found
        const $links = $article.find('a[href^="/"]');
        if ($links.length === 0) {
          cy.log('No internal links found on this page');
          return;
        }

        // Now test each link
        cy.wrap($links).each(($a) => {
          const href = $a.attr('href');
          const linkText = $a.text().trim();
          testLink(href, linkText, subject);
        });
      });
    });

    it(`${subject} has valid anchor links`, function () {
      cy.visit(`${subject}`);

      // Define selectors for anchor links to ignore, such as behavior triggers
      const ignoreLinks = ['.tabs a[href^="#"]', '.code-tabs a[href^="#"]'];

      const anchorSelector =
        'a[href^="#"]:not(' + ignoreLinks.join('):not(') + ')';

      cy.get('article, .api-content').then(($article) => {
        const $anchorLinks = $article.find(anchorSelector);
        if ($anchorLinks.length === 0) {
          cy.log('No anchor links found on this page');
          return;
        }

        cy.wrap($anchorLinks).each(($a) => {
          const href = $a.prop('href');
          const linkText = $a.text().trim();

          if (href && href.length > 1) {
            // Get just the fragment part
            const url = new URL(href);
            const anchorId = url.hash.substring(1); // Remove the # character

            if (!anchorId) {
              cy.log(`Skipping empty anchor in ${href}`);
              return;
            }

            // Use DOM to check if the element exists
            cy.window().then((win) => {
              const element = win.document.getElementById(anchorId);
              if (!element) {
                cy.task('reportBrokenLink', {
                  url: `#${anchorId}`,
                  status: 404,
                  type: 'anchor',
                  linkText,
                  page: subject,
                });
                cy.log(`⚠️ Missing anchor target: #${anchorId}`);
              }
            });
          }
        });
      });
    });

    it(`${subject} has valid external links`, function () {
      // Check if we should skip external links entirely
      if (Cypress.env('skipExternalLinks') === true) {
        cy.log(
          'Skipping all external links as configured by skipExternalLinks'
        );
        return;
      }

      cy.visit(`${subject}`);

      // Define allowed external domains to test
      const allowedExternalDomains = ['github.com', 'kapa.ai'];

      // Test external links
      cy.get('article, .api-content').then(($article) => {
        // Find links without failing the test if none are found
        const $links = $article.find('a[href^="http"]');
        if ($links.length === 0) {
          cy.log('No external links found on this page');
          return;
        }

        // Filter links to only include allowed domains
        const $allowedLinks = $links.filter((_, el) => {
          const href = el.getAttribute('href');
          try {
            const url = new URL(href);
            return allowedExternalDomains.some(
              (domain) =>
                url.hostname === domain || url.hostname.endsWith(`.${domain}`)
            );
          } catch (e) {
            return false;
          }
        });

        if ($allowedLinks.length === 0) {
          cy.log('No links to allowed external domains found on this page');
          return;
        }

        cy.log(
          `Found ${$allowedLinks.length} links to allowed external domains to test`
        );
        cy.wrap($allowedLinks).each(($a) => {
          const href = $a.attr('href');
          const linkText = $a.text().trim();
          testLink(href, linkText, subject);
        });
      });
    });
  });
});
