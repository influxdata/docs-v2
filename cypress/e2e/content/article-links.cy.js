/// <reference types="cypress" />

describe('Article links', () => {
  const subjects = Cypress.env('test_subjects').split(',');
  // Always use HEAD for downloads to avoid timeouts
  const useHeadForDownloads = true;

  // Helper function to identify download links - improved
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
  function testLink(href) {
    if (useHeadForDownloads && isDownloadLink(href)) {
      cy.log(`** Testing download link with HEAD: ${href} **`);
      cy.request({
        method: 'HEAD',
        url: href,
      }).then((response) => {
        const message = `Link is broken: ${href} (status: ${response.status})`;
        try {
          expect(response.status).to.be.lt(400);
        } catch (e) {
          // Log the broken link with the URL for better visibility in reports
          cy.log(`❌ BROKEN LINK: ${href} (${response.status})`);
          throw new Error(message);
        }
      });
    } else {
      cy.log(`** Testing link: ${href} **`);
      cy.request({
        url: href,
        failOnStatusCode: false,
        timeout: 10000, // 10 second timeout for regular links
      }).then((response) => {
        const message = `Link is broken: ${href} (status: ${response.status})`;
        try {
          expect(response.status).to.be.lt(400);
        } catch (e) {
          // Log the broken link with the URL for better visibility in reports
          cy.log(`❌ BROKEN LINK: ${href} (${response.status})`);
          throw new Error(message);
        }
      });
    }
  }

  subjects.forEach((subject) => {
    it(`contains valid internal links on ${subject}`, function () {
      cy.visit(`${subject}`);
      // Test internal links
      // 1. Timeout and fail the test if article is not found
      // 2. Check each link.
      // 3. If no links are found, continue without failing
      cy.get('article').then(($article) => {
        // Find links without failing the test if none are found
        const $links = $article.find('a[href^="/"]');
        if ($links.length === 0) {
          cy.log('No internal links found on this page');
          return;
        }
        cy.wrap($links).each(($a) => {
          const href = $a.attr('href');
          testLink(href);
        });
      });
    });

    it(`checks anchor links on ${subject} (with warnings for missing targets)`, function () {
      cy.visit(`${subject}`);

      // Track missing anchors for summary
      const missingAnchors = [];

      // Process anchor links individually
      cy.get('article').then(($article) => {
        const $anchorLinks = $article.find('a[href^="#"]');
        if ($anchorLinks.length === 0) {
          cy.log('No anchor links found on this page');
          return;
        }
        cy.wrap($anchorLinks).each(($a) => {
            const href = $a.prop('href');
            if (href && href.length > 1) {
              // Skip empty anchors (#)
              // Get just the fragment part
              const url = new URL(href);
              const anchorId = url.hash.substring(1); // Remove the # character

              if (!anchorId) {
                cy.log(`Skipping empty anchor in ${href}`);
                return;
              }

              // Use DOM to check if the element exists, but don't fail if missing
              cy.window().then((win) => {
                const element = win.document.getElementById(anchorId);
                if (element) {
                  cy.log(`✅ Anchor target exists: #${anchorId}`);
                } else {
                  // Just warn about the missing anchor
                  cy.log(`⚠️ WARNING: Missing anchor target: #${anchorId}`);
                  missingAnchors.push(anchorId);
                }
              });
            }
          })
          .then(() => {
            // After checking all anchors, log a summary
            if (missingAnchors.length > 0) {
              cy.log(
                `⚠️ Found ${missingAnchors.length} missing anchor targets: ${missingAnchors.join(', ')}`
              );
            } else {
              cy.log('✅ All anchor targets are valid');
            }
          });
      });

      it(`contains valid external links on ${subject}`, function () {
        cy.visit(`${subject}`);
        // Test external links
        // 1. Timeout and fail the test if article is not found
        // 2. Check each link.
        // 3. If no links are found, continue without failing
        cy.get('article').then(($article) => {
          // Find links without failing the test if none are found
          const $links = $article.find('a[href^="http"]');
          if ($links.length === 0) {
            cy.log('No external links found on this page');
            return;
          }
          cy.wrap($links).each(($a) => {
            const href = $a.attr('href');
            testLink(href);
          });
        });
      });
    });
  });
});
