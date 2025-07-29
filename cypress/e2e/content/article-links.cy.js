/// <reference types="cypress" />

describe('Article', () => {
  let subjects = Cypress.env('test_subjects')
    ? Cypress.env('test_subjects')
        .split(',')
        .filter((s) => s.trim() !== '')
    : [];
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

    // Only run incremental validation if we have source file paths
    if (sourceFilePaths.length > 0) {
      cy.log('🔄 Running incremental validation analysis...');

      // Run incremental validation with proper error handling
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

              cy.log(
                `📊 Cache Analysis: ${results.cacheStats.hitRate}% hit rate`
              );
              cy.log(
                `🔄 Testing ${subjects.length} pages (${results.cacheStats.cacheHits} cached)`
              );
            });
          } else {
            // All files are cached, no validation needed
            subjects = [];
            cy.log('✨ All files cached - skipping validation');
            cy.log(
              `📊 Cache hit rate: ${results.cacheStats.hitRate}% (${results.cacheStats.cacheHits}/${results.cacheStats.totalFiles} files cached)`
            );
          }
        })
        .catch((error) => {
          cy.log('❌ Incremental validation failed: ' + error.message);
          cy.log(
            '🔄 Falling back to test all provided subjects without cache optimization'
          );

          // Set fallback mode but don't fail the test
          validationStrategy = {
            fallback: true,
            error: error.message,
            unchanged: [],
            changed: sourceFilePaths.map((filePath) => ({
              filePath,
              error: 'fallback',
            })),
            total: sourceFilePaths.length,
          };

          cy.log(`📋 Testing ${subjects.length} pages in fallback mode`);
        });
    } else {
      cy.log('⚠️ No source file paths available, using all provided subjects');

      // Set a simple validation strategy when no source data is available
      validationStrategy = {
        noSourceData: true,
        unchanged: [],
        changed: [],
        total: subjects.length,
      };

      cy.log(
        `📋 Testing ${subjects.length} pages without incremental validation`
      );
    }
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
  // Add debugging information about test subjects
  it('Test Setup Validation', function () {
    cy.log(`📋 Test Configuration:`);
    cy.log(`   • Test subjects count: ${subjects.length}`);
    cy.log(`   • Validation strategy: ${validationStrategy || 'Not set'}`);

    // Check if we're in fallback mode due to cache system issues
    if (validationStrategy && validationStrategy.fallback) {
      cy.log('⚠️ Running in fallback mode due to cache system error');
      cy.log(`   • Error: ${validationStrategy.error}`);
      cy.log('   • All files will be tested without cache optimization');

      // In fallback mode, if we have no subjects, that might be expected
      if (subjects.length === 0) {
        cy.log('ℹ️ No subjects to test in fallback mode');
        cy.log(
          '   This indicates no test subjects were provided to the runner'
        );
      } else {
        cy.log(`✅ Testing ${subjects.length} subjects in fallback mode`);
      }
    } else if (subjects.length === 0) {
      cy.log('ℹ️ No test subjects to validate - analyzing reason:');

      // Check if this is due to cache optimization
      const testSubjectsData = Cypress.env('test_subjects_data');
      if (
        testSubjectsData &&
        testSubjectsData !== '[]' &&
        testSubjectsData !== ''
      ) {
        cy.log('✅ Cache optimization is active - all files were cached');
        try {
          const urlToSourceData = JSON.parse(testSubjectsData);
          cy.log(`📊 Files processed: ${urlToSourceData.length}`);
          cy.log(
            '💡 This means all links have been validated recently and are cached'
          );
          cy.log('🎯 No new validation needed - this is the expected outcome');
        } catch (e) {
          cy.log(
            '✅ Cache optimization active (could not parse detailed data)'
          );
        }
      } else {
        cy.log('⚠️ No test subjects data available');
        cy.log('   Possible reasons:');
        cy.log('   • No files were provided to test');
        cy.log('   • File mapping failed during setup');
        cy.log('   • No files matched the test criteria');
        cy.log(
          '   This is not necessarily an error - may be expected for some runs'
        );
      }
    } else {
      cy.log(`✅ Ready to test ${subjects.length} pages`);
      subjects.slice(0, 5).forEach((subject) => cy.log(`   • ${subject}`));
      if (subjects.length > 5) {
        cy.log(`   ... and ${subjects.length - 5} more pages`);
      }
    }

    // Check for truly problematic scenarios
    if (!validationStrategy && subjects.length === 0) {
      const testSubjectsData = Cypress.env('test_subjects_data');
      if (
        !testSubjectsData ||
        testSubjectsData === '' ||
        testSubjectsData === '[]'
      ) {
        cy.log('❌ Critical setup issue detected:');
        cy.log('   • No validation strategy');
        cy.log('   • No test subjects');
        cy.log('   • No test subjects data');
        cy.log('   This indicates a fundamental configuration problem');

        // Only fail in this truly problematic case
        throw new Error(
          'Critical test setup failure: No strategy, subjects, or data available'
        );
      }
    }

    // Always pass if we get to this point - the setup is valid
    cy.log('✅ Test setup validation completed successfully');
  });

  subjects.forEach((subject) => {
    it(`${subject} has valid internal links`, function () {
      // Add error handling for page visit failures
      cy.visit(`${subject}`, { timeout: 20000 })
        .then(() => {
          cy.log(`✅ Successfully loaded page: ${subject}`);
        })
        .catch((error) => {
          cy.log(`❌ Failed to load page: ${subject}`);
          cy.log(`   • Error: ${error.message}`);
          cy.log('💡 This could indicate:');
          cy.log('   • Hugo server not running or crashed');
          cy.log('   • Invalid URL or routing issue');
          cy.log('   • Network connectivity problems');
          throw error; // Re-throw to fail the test properly
        });

      // Test internal links
      cy.get('article, .api-content')
        .then(($article) => {
          // Find links without failing the test if none are found
          const $links = $article.find('a[href^="/"]');
          if ($links.length === 0) {
            cy.log('No internal links found on this page');
            return;
          }

          cy.log(`🔍 Testing ${$links.length} internal links on ${subject}`);

          // Now test each link
          cy.wrap($links).each(($a) => {
            const href = $a.attr('href');
            const linkText = $a.text().trim();

            try {
              testLink(href, linkText, subject);
            } catch (error) {
              cy.log(`❌ Error testing link ${href}: ${error.message}`);
              throw error; // Re-throw to fail the test
            }
          });
        })
        .catch((error) => {
          cy.log(`❌ Error finding article content on ${subject}`);
          cy.log(`   • Error: ${error.message}`);
          cy.log('💡 This could indicate:');
          cy.log('   • Page structure changed (missing article/.api-content)');
          cy.log('   • Page failed to render properly');
          cy.log('   • JavaScript errors preventing DOM updates');
          throw error;
        });
    });

    it(`${subject} has valid anchor links`, function () {
      cy.visit(`${subject}`)
        .then(() => {
          cy.log(`✅ Successfully loaded page for anchor testing: ${subject}`);
        })
        .catch((error) => {
          cy.log(`❌ Failed to load page for anchor testing: ${subject}`);
          cy.log(`   • Error: ${error.message}`);
          throw error;
        });

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

        cy.log(`🔗 Testing ${$anchorLinks.length} anchor links on ${subject}`);

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

      cy.visit(`${subject}`)
        .then(() => {
          cy.log(
            `✅ Successfully loaded page for external link testing: ${subject}`
          );
        })
        .catch((error) => {
          cy.log(
            `❌ Failed to load page for external link testing: ${subject}`
          );
          cy.log(`   • Error: ${error.message}`);
          throw error;
        });

      // Define allowed external domains to test
      const allowedExternalDomains = ['github.com', 'kapa.ai'];

      // Test external links
      cy.get('article, .api-content')
        .then(($article) => {
          // Find links without failing the test if none are found
          const $links = $article.find('a[href^="http"]');
          if ($links.length === 0) {
            cy.log('No external links found on this page');
            return;
          }

          cy.log(
            `🔍 Found ${$links.length} total external links on ${subject}`
          );

          // Filter links to only include allowed domains
          const $allowedLinks = $links.filter((_, el) => {
            const href = el.getAttribute('href');
            try {
              const url = new URL(href);
              return allowedExternalDomains.some(
                (domain) =>
                  url.hostname === domain || url.hostname.endsWith(`.${domain}`)
              );
            } catch (urlError) {
              cy.log(`⚠️ Invalid URL found: ${href}`);
              return false;
            }
          });

          if ($allowedLinks.length === 0) {
            cy.log('No links to allowed external domains found on this page');
            cy.log(
              `   • Allowed domains: ${allowedExternalDomains.join(', ')}`
            );
            return;
          }

          cy.log(
            `🌐 Testing ${$allowedLinks.length} links to allowed external domains`
          );
          cy.wrap($allowedLinks).each(($a) => {
            const href = $a.attr('href');
            const linkText = $a.text().trim();

            try {
              testLink(href, linkText, subject);
            } catch (error) {
              cy.log(
                `❌ Error testing external link ${href}: ${error.message}`
              );
              throw error;
            }
          });
        })
        .catch((error) => {
          cy.log(`❌ Error processing external links on ${subject}`);
          cy.log(`   • Error: ${error.message}`);
          throw error;
        });
    });
  });
});
