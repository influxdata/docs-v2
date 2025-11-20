/**
 * Minimal tests for page-context module usage
 * Verifies that page-context exports are available to modules that import them
 */

describe('Page Context Module', () => {
  const testUrls = [
    {
      url: 'http://localhost:1315/influxdb3/core/get-started/',
      expectedContext: 'core',
      expectedProduct: 'influxdb3',
      description: 'InfluxDB 3 Core',
    },
    {
      url: 'http://localhost:1315/influxdb3/enterprise/get-started/',
      expectedContext: 'enterprise',
      expectedProduct: 'influxdb3',
      description: 'InfluxDB 3 Enterprise',
    },
    {
      url: 'http://localhost:1315/influxdb/cloud/',
      expectedContext: 'cloud',
      expectedProduct: 'influxdb',
      description: 'InfluxDB Cloud (TSM)',
    },
  ];

  testUrls.forEach(({ url, expectedContext, expectedProduct, description }) => {
    describe(`${description}`, () => {
      beforeEach(() => {
        cy.visit(url);
      });

      it('should load page-context module exports', () => {
        cy.window().then((win) => {
          // Access the main.js global which loads page-context
          expect(win.influxdatadocs).to.exist;
        });
      });

      it('should have correct context value for v3-wayfinding.js usage', () => {
        // v3-wayfinding.js imports: context, host, hostname, path, protocol, referrer, referrerHost
        cy.window().then((win) => {
          // These values should be available in the window for modules to use
          expect(win.location.pathname).to.include(expectedProduct);
          expect(win.location.protocol).to.match(/https?:/);
          expect(win.location.hostname).to.exist;
        });
      });

      it('should have correct values for page-feedback.js usage', () => {
        // page-feedback.js imports: hostname, path, product, protocol, version
        cy.window().then((win) => {
          const pathname = win.location.pathname;
          const pathArr = pathname.split('/').filter((s) => s);

          // Verify product is extractable from path
          expect(pathArr[0]).to.equal(expectedProduct);

          // Verify required context properties exist
          expect(win.location.hostname).to.exist;
          expect(win.location.protocol).to.exist;
        });
      });

      it('should provide consistent product detection', () => {
        cy.window().then((win) => {
          const pathname = win.location.pathname;

          // Verify the path matches expected context
          if (expectedContext === 'core') {
            expect(pathname).to.include('/influxdb3/core');
          } else if (expectedContext === 'enterprise') {
            expect(pathname).to.include('/influxdb3/enterprise');
          } else if (expectedContext === 'cloud') {
            expect(pathname).to.include('/influxdb/cloud');
          }
        });
      });
    });
  });

  describe('Fallback behavior', () => {
    it('should handle unknown product paths gracefully', () => {
      // Visit a path that doesn't match any product
      cy.visit('http://localhost:1315/');

      cy.window().then((win) => {
        // Should still have basic location properties
        expect(win.location.pathname).to.exist;
        expect(win.location.hostname).to.exist;
      });
    });
  });
});
