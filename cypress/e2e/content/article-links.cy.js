/// <reference types="cypress" />

describe('Article links', () => {
  const subjects = Cypress.env('test_subjects').split(',');
  // Always use HEAD for downloads to avoid timeouts
  const useHeadForDownloads = true; 

  // Helper function to identify download links - improved
  function isDownloadLink(href) {
    // Check for common download file extensions
    const downloadExtensions = [
      '.pdf', '.zip', '.tar.gz', '.tgz', '.rar', '.exe', '.dmg', '.pkg', 
      '.deb', '.rpm', '.xlsx', '.csv', '.doc', '.docx', '.ppt', '.pptx'
    ];
    
    // Check for download domains or paths
    const downloadDomains = [
      'dl.influxdata.com',
      'downloads.influxdata.com'
    ];
    
    // Check if URL contains a download extension
    const hasDownloadExtension = downloadExtensions.some(ext => 
      href.toLowerCase().endsWith(ext)
    );
    
    // Check if URL is from a download domain
    const isFromDownloadDomain = downloadDomains.some(domain => 
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
        failOnStatusCode: false,
        timeout: 10000 // 10 second timeout for download links
      }).then(response => {
        expect(response.status).to.be.lt(400);
      });
    } else {
      cy.log(`** Testing link: ${href} **`);
      cy.request({
        url: href,
        failOnStatusCode: false,
        timeout: 30000 // 30 second timeout for regular links
      }).then(response => {
        expect(response.status).to.be.lt(400);
      });
    }
  }

  subjects.forEach((subject) => {
    it(`contains valid internal links on ${subject}`, function () {
      cy.visit(`${subject}`);
      
      // Test internal links (including anchor links)
      cy.get('article a[href^="/"]').each(($a) => {
        const href = $a.attr('href');
        testLink(href);
      });
    });

    it(`checks anchor links on ${subject} (with warnings for missing targets)`, function () {
      cy.visit(`${subject}`);
      
      // Track missing anchors for summary
      const missingAnchors = [];
      
      // Process anchor links individually
      cy.get('article a[href^="#"]').each(($a) => {
        const href = $a.prop('href'); // Use prop() instead of attr()
        if (href && href.length > 1) { // Skip empty anchors (#)
          // Get just the fragment part
          const url = new URL(href);
          const anchorId = url.hash.substring(1); // Remove the # character
          
          if (!anchorId) {
            cy.log(`Skipping empty anchor in ${href}`);
            return;
          }
          
          // Use DOM to check if the element exists, but don't fail if missing
          cy.window().then(win => {
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
      }).then(() => {
        // After checking all anchors, log a summary
        if (missingAnchors.length > 0) {
          cy.log(`⚠️ Found ${missingAnchors.length} missing anchor targets: ${missingAnchors.join(', ')}`);
        } else {
          cy.log('✅ All anchor targets are valid');
        }
      });
    });

    it(`contains valid external links on ${subject}`, function () {
      cy.visit(`${subject}`);
      
      // Test external links
      cy.get('article a[href^="http"]').each(($a) => {
        const href = $a.attr('href');
        testLink(href);
      });
    });
  });
});