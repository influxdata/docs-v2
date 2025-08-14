/// <reference types="cypress" />

describe('Article', () => {
  let subjects = Cypress.env('test_subjects')
    ? Cypress.env('test_subjects')
        .split(',')
        .filter((s) => s.trim() !== '')
    : [];

  // Cache will be checked during test execution at the URL level

  // Always use HEAD for downloads to avoid timeouts
  const useHeadForDownloads = true;

  // Set up initialization for tests
  before(() => {
    // Initialize the broken links report
    cy.task('initializeBrokenLinksReport');

    // Clean up expired cache entries
    cy.task('cleanupCache').then((cleaned) => {
      if (cleaned > 0) {
        cy.log(`🧹 Cleaned up ${cleaned} expired cache entries`);
      }
    });
  });

  // Display cache statistics after all tests complete
  after(() => {
    cy.task('getCacheStats').then((stats) => {
      cy.log('📊 Link Validation Cache Statistics:');
      cy.log(`   • Cache hits: ${stats.hits}`);
      cy.log(`   • Cache misses: ${stats.misses}`);
      cy.log(`   • New entries stored: ${stats.stores}`);
      cy.log(`   • Hit rate: ${stats.hitRate}`);
      cy.log(`   • Total validations: ${stats.total}`);

      if (stats.total > 0) {
        const message =
          stats.hits > 0
            ? `✨ Cache optimization saved ${stats.hits} link validations`
            : '🔄 No cache hits - all links were validated fresh';
        cy.log(message);
      }

      // Save cache statistics for the reporter to display
      cy.task('saveCacheStatsForReporter', {
        hitRate: parseFloat(stats.hitRate.replace('%', '')),
        cacheHits: stats.hits,
        cacheMisses: stats.misses,
        totalValidations: stats.total,
        newEntriesStored: stats.stores,
        cleanups: stats.cleanups,
      });
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

  // Helper function for handling failed links
  function handleFailedLink(
    url,
    status,
    type,
    redirectChain = '',
    linkText = '',
    pageUrl = ''
  ) {
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

  // Helper function to test a link with cache integration
  function testLink(href, linkText = '', pageUrl) {
    // Check cache first
    return cy.task('isLinkCached', href).then((isCached) => {
      if (isCached) {
        cy.log(`✅ Cache hit: ${href}`);
        return cy.task('getLinkCache', href).then((cachedResult) => {
          if (
            cachedResult &&
            cachedResult.result &&
            cachedResult.result.status >= 400
          ) {
            // Cached result shows this link is broken
            handleFailedLink(
              href,
              cachedResult.result.status,
              cachedResult.result.type || 'cached',
              '',
              linkText,
              pageUrl
            );
          }
          // For successful cached results, just return - no further action needed
        });
      } else {
        // Not cached, perform actual validation
        return performLinkValidation(href, linkText, pageUrl);
      }
    });
  }

  // Helper function to perform actual link validation and cache the result
  function performLinkValidation(href, linkText = '', pageUrl) {
    // Common request options for both methods
    const requestOptions = {
      failOnStatusCode: true,
      timeout: 15000, // Increased timeout for reliability
      followRedirect: true, // Explicitly follow redirects
      retryOnNetworkFailure: true, // Retry on network issues
      retryOnStatusCodeFailure: true, // Retry on 5xx errors
    };

    if (useHeadForDownloads && isDownloadLink(href)) {
      cy.log(`** Testing download link with HEAD: ${href} **`);
      return cy
        .request({
          method: 'HEAD',
          url: href,
          ...requestOptions,
        })
        .then((response) => {
          // Prepare result for caching
          const result = {
            status: response.status,
            type: 'download',
            timestamp: new Date().toISOString(),
          };

          // Check final status after following any redirects
          if (response.status >= 400) {
            const redirectInfo =
              response.redirects && response.redirects.length > 0
                ? ` (redirected to: ${response.redirects.join(' -> ')})`
                : '';

            // Cache the failed result
            cy.task('setLinkCache', { url: href, result });
            handleFailedLink(
              href,
              response.status,
              'download',
              redirectInfo,
              linkText,
              pageUrl
            );
          } else {
            // Cache the successful result
            cy.task('setLinkCache', { url: href, result });
          }
        });
    } else {
      cy.log(`** Testing link: ${href} **`);
      return cy
        .request({
          url: href,
          ...requestOptions,
        })
        .then((response) => {
          // Prepare result for caching
          const result = {
            status: response.status,
            type: 'regular',
            timestamp: new Date().toISOString(),
          };

          if (response.status >= 400) {
            const redirectInfo =
              response.redirects && response.redirects.length > 0
                ? ` (redirected to: ${response.redirects.join(' -> ')})`
                : '';

            // Cache the failed result
            cy.task('setLinkCache', { url: href, result });
            handleFailedLink(
              href,
              response.status,
              'regular',
              redirectInfo,
              linkText,
              pageUrl
            );
          } else {
            // Cache the successful result
            cy.task('setLinkCache', { url: href, result });
          }
        });
    }
  }

  // Test setup validation
  it('Test Setup Validation', function () {
    cy.log(`📋 Test Configuration:`);
    cy.log(`   • Test subjects: ${subjects.length}`);
    cy.log(`   • Cache: URL-level caching with 30-day TTL`);
    cy.log(
      `   • Link validation: Internal, anchor, and allowed external links`
    );

    cy.log('✅ Test setup validation completed');
  });

  subjects.forEach((subject) => {
    it(`${subject} has valid internal links`, function () {
      // Add error handling for page visit failures
      cy.visit(`${subject}`, { timeout: 20000 }).then(() => {
        cy.log(`✅ Successfully loaded page: ${subject}`);
      });

      // Test internal links
      cy.get('article, .api-content').then(($article) => {
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
      });
    });

    it(`${subject} has valid anchor links`, function () {
      cy.visit(`${subject}`).then(() => {
        cy.log(`✅ Successfully loaded page for anchor testing: ${subject}`);
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

      cy.visit(`${subject}`).then(() => {
        cy.log(
          `✅ Successfully loaded page for external link testing: ${subject}`
        );
      });

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

        cy.log(`🔍 Found ${$links.length} total external links on ${subject}`);

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
          cy.log(`   • Allowed domains: ${allowedExternalDomains.join(', ')}`);
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
            cy.log(`❌ Error testing external link ${href}: ${error.message}`);
            throw error;
          }
        });
      });
    });
  });
});
