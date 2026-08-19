/**
 * Tests for layouts/partials/header/canonical.html
 *
 * Verifies the four branches of the canonical partial emit the expected
 * <link rel="canonical"> path:
 *
 *   1. `canonical: self` sentinel  -> self-permalink (product-narrative pages)
 *   2. `canonical: <url-path>`     -> baseURL + url-path
 *   3. `source:` with no canonical -> shared-source priority routing
 *   4. neither set                 -> self-permalink (Hugo default)
 *
 * Assertions are path-only (not full URL) because `hugo server` overrides the
 * configured baseURL to http://localhost:<port>/. The path is what determines
 * which canonical *page* the link resolves to, regardless of host.
 *
 * Background: see PLAN.md / AI-visibility-for-InfluxDB.md §5.1.
 */

const BASE = 'http://localhost:1315';

/**
 * Visit url and assert the canonical link's pathname matches expectedPath.
 * @param {string} url - Path to visit (e.g., '/influxdb3/core/')
 * @param {string|RegExp} expectedPath - Exact pathname or regex to match
 */
function assertCanonicalPath(url, expectedPath) {
  cy.visit(`${BASE}${url}`);
  cy.get('link[rel="canonical"]')
    .should('have.attr', 'href')
    .then((href) => {
      const pathname = new URL(href).pathname;
      if (expectedPath instanceof RegExp) {
        expect(pathname).to.match(expectedPath);
      } else {
        expect(pathname).to.equal(expectedPath);
      }
    });
}

describe('Canonical URL partial', () => {
  describe('canonical: self sentinel (product-narrative pages)', () => {
    it('Core landing self-canonicals', () => {
      assertCanonicalPath('/influxdb3/core/', '/influxdb3/core/');
    });

    it('Core install self-canonicals', () => {
      assertCanonicalPath(
        '/influxdb3/core/install/',
        '/influxdb3/core/install/'
      );
    });

    it('Core get-started landing self-canonicals', () => {
      assertCanonicalPath(
        '/influxdb3/core/get-started/',
        '/influxdb3/core/get-started/'
      );
    });
  });

  describe('shared-source priority routing (engine concepts)', () => {
    it('Core write-data routes canonical to Enterprise', () => {
      assertCanonicalPath(
        '/influxdb3/core/write-data/',
        /^\/influxdb3\/enterprise\//
      );
    });
  });

  describe('explicit canonical: <url-path> frontmatter', () => {
    it('Enterprise Go client-lib release-notes canonical to Core', () => {
      assertCanonicalPath(
        '/influxdb3/enterprise/reference/client-libraries/v3/go/release-notes/',
        '/influxdb3/core/reference/client-libraries/v3/go/release-notes/'
      );
    });
  });

  describe('default self-canonical (no overrides)', () => {
    it('Core upgrade-to-enterprise self-canonicals (no source, no canonical)', () => {
      assertCanonicalPath(
        '/influxdb3/core/admin/upgrade-to-enterprise/',
        '/influxdb3/core/admin/upgrade-to-enterprise/'
      );
    });
  });
});
