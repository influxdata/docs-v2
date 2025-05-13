/// <reference types="cypress" />

describe('Article', () => {
  const subjects = Cypress.env('test_subjects').split(',');
  // Always use HEAD for downloads to avoid timeouts
  const useHeadForDownloads = true;
  
  // File path for writing broken links report
  const BROKEN_LINKS_FILE = '/tmp/broken_links_report.json';
  
  // Create a store for broken links with more aggressive reporting
  const brokenLinksStore = {
    links: {},
    
    addLink(url, status, type, linkText = '', page) {
      const pageKey = page || 'unknown';
      if (!this.links[pageKey]) {
        this.links[pageKey] = [];
      }
      this.links[pageKey].push({ url, status, type, linkText });
      
      // Log the broken link immediately to console with high visibility
      const message = `\n❌ BROKEN LINK FOUND: ${url} (${status}) - ${type} on page ${pageKey}${linkText ? ` - Text: "${linkText}"` : ''}`;
      
      // Using multiple logging methods to ensure visibility
      cy.task('log', { message, type: 'error' });
      cy.log(message).then(() => {
        // Write to filesystem for guaranteed capture
        this.writeToFile();
        
        // Print directly to stdout/stderr for maximum visibility
        // This ensures broken links are visible even if Cypress output is filtered
        Cypress.runner.emit('console:error', { 
          type: 'error',
          message: message,
          data: { url, status, type, linkText, page }
        });
      });
    },
    
    writeToFile() {
      // Write the current state to file so it can be read by the run script
      if (Object.keys(this.links).length > 0) {
        const data = Object.entries(this.links).map(([page, links]) => ({
          page,
          links
        }));
        
        cy.task('writeFile', {
          path: BROKEN_LINKS_FILE,
          content: JSON.stringify(data, null, 2)
        });
      }
    },
    
    getLinksForPage(page) {
      return this.links[page] || [];
    },
    
    getAllLinks() {
      return Object.entries(this.links).reduce((acc, [page, links]) => {
        return acc.concat(links.map(link => ({ ...link, page })));
      }, []);
    },
    
    clear() {
      this.links = {};
    },
    
    hasLinks() {
      return Object.keys(this.links).length > 0;
    },
    
    reportToConsole() {
      if (!this.hasLinks()) return;
      
      const message = [
        '\n================================================================',
        '📊 BROKEN LINKS SUMMARY REPORT',
        '================================================================\n'
      ];
      
      let totalBrokenLinks = 0;
      
      Object.entries(this.links).forEach(([page, links]) => {
        message.push(`PAGE: ${page}`);
        message.push('----------------');
        
        links.forEach(link => {
          message.push(`- ${link.url} (${link.status}) - ${link.type}${link.linkText ? ` - "${link.linkText}"` : ''}`);
          totalBrokenLinks++;
        });
        
        message.push('');
      });
      
      message.push(`TOTAL BROKEN LINKS FOUND: ${totalBrokenLinks}`);
      message.push('================================================================\n');
      
      // Log as a single string for better visibility in console
      cy.task('log', { message: message.join('\n'), type: 'error' });
      
      // Also log to a file to ensure capture
      this.writeToFile();
    },
    
    getSummaryText() {
      if (!this.hasLinks()) return '';
      
      const allLinks = this.getAllLinks();
      return `Found ${allLinks.length} broken links. First broken link: ${allLinks[0].url} (${allLinks[0].status})`;
    }
  };

  // Helper function to identify download links - improved
  function isDownloadLink(href) {
    // Check for common download file extensions
    const downloadExtensions = [
      '.pdf', '.zip', '.tar.gz', '.tgz', '.rar',
      '.exe', '.dmg', '.pkg', '.deb', '.rpm',
      '.xlsx', '.csv', '.doc', '.docx', '.ppt', '.pptx',
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

  // Create a new Cypress task for writing to a file
  Cypress.Commands.add('writeToFile', (options = {}) => {
    cy.task('writeFile', options);
  });

  // Helper function to make appropriate request based on link type
  function testLink(href, linkText = '', pageUrl) {
    if (useHeadForDownloads && isDownloadLink(href)) {
      cy.log(`** Testing download link with HEAD: ${href} **`);
      cy.request({
        method: 'HEAD',
        url: href,
        failOnStatusCode: false,
        timeout: 15000 // Increased timeout for reliability
      }).then((response) => {
        if (response.status >= 400) {
          // Record the broken link and provide immediate feedback
          brokenLinksStore.addLink(href, response.status, 'download', linkText, pageUrl);
          
          // Fail test with specific error message that will show in reports
          throw new Error(`BROKEN DOWNLOAD LINK: ${href} (status: ${response.status}) on ${pageUrl}`);
        }
      });
    } else {
      cy.log(`** Testing link: ${href} **`);
      cy.request({
        url: href,
        failOnStatusCode: false,
        timeout: 15000 // Increased timeout for reliability
      }).then((response) => {
        if (response.status >= 400) {
          // Record the broken link and provide immediate feedback
          brokenLinksStore.addLink(href, response.status, 'regular', linkText, pageUrl);
          
          // Fail test with specific error message that will show in reports
          throw new Error(`BROKEN LINK: ${href} (status: ${response.status}) on ${pageUrl}`);
        }
      });
    }
  }

  // Before all tests, clear the broken links store
  before(() => {
    brokenLinksStore.clear();
    
    // Initialize the broken links file
    cy.task('writeFile', {
      path: BROKEN_LINKS_FILE,
      content: '[]'
    });
  });
  
  // After each test, report broken links if any were found
  afterEach(function() {
    if (brokenLinksStore.hasLinks()) {
      // Print summary after each test with broken links
      cy.task('log', {
        message: `\n⚠️ TEST FAILED: ${this.currentTest.title} - ${brokenLinksStore.getSummaryText()}\n`,
        type: 'error'
      });
    }
  });
  
  // After all tests, report all broken links
  after(() => {
    brokenLinksStore.reportToConsole();
  });

  subjects.forEach((subject) => {
    it(`${subject} has valid internal links`, function () {
      cy.visit(`${subject}`, { timeout: 20000 });
      
      // Test internal links
      cy.get('article').then(($article) => {
        // Find links without failing the test if none are found
        const $links = $article.find('a[href^="/"]');
        if ($links.length === 0) {
          cy.log('No internal links found on this page');
          return;
        }
        
        // Keep track of all links for better error reporting
        const linksList = [];
        $links.each((i, el) => {
          const $a = Cypress.$(el);
          linksList.push({
            href: $a.attr('href'),
            text: $a.text().trim()
          });
        });
        
        // Now test each link
        cy.wrap($links).each(($a, i) => {
          const href = $a.attr('href');
          const linkText = $a.text().trim();
          testLink(href, linkText, subject);
        });
      });
    });

    it(`${subject} has valid anchor links`, function () {
      cy.visit(`${subject}`);

      // Process anchor links individually
      cy.get('article').then(($article) => {
        const $anchorLinks = $article.find('a[href^="#"]');
        if ($anchorLinks.length === 0) {
          cy.log('No anchor links found on this page');
          return;
        }
        
        cy.wrap($anchorLinks).each(($a) => {
          const href = $a.prop('href');
          const linkText = $a.text().trim();
          
          if (href && href.length > 1) {
            // Skip empty anchors (#)
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
                // Track the missing anchor
                brokenLinksStore.addLink(`#${anchorId}`, 404, 'anchor', linkText, subject);
                cy.log(`⚠️ Missing anchor target: #${anchorId}`);
              }
            });
          }
        });
      });
    });

    it(`${subject} has valid external links`, function () {
      cy.visit(`${subject}`);
      
      // Test external links
      cy.get('article').then(($article) => {
        // Find links without failing the test if none are found
        const $links = $article.find('a[href^="http"]');
        if ($links.length === 0) {
          cy.log('No external links found on this page');
          return;
        }
        
        cy.wrap($links).each(($a) => {
          const href = $a.attr('href');
          const linkText = $a.text().trim();
          testLink(href, linkText, subject);
        });
      });
    });
  });
});
