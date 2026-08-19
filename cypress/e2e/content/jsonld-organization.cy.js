/// <reference types="cypress" />

// #7243: Organization JSON-LD emitted site-wide (every page), so LLM retrievers
// resolve the InfluxData entity wherever they land. Organization has a stable
// @id and is deduped by consumers, so site-wide emission is safe — unlike the
// page-scoped TechArticle/SoftwareApplication nodes.

function ldByType(win$, doc, type) {
  const scripts = win$(doc).find('script[type="application/ld+json"]');
  return [...scripts]
    .map((s) => {
      try {
        return JSON.parse(s.textContent);
      } catch (e) {
        return null;
      }
    })
    .filter((j) => j && j['@type'] === type);
}

describe('Organization JSON-LD content', function () {
  it('emits one well-formed Organization with sameAs on the homepage', function () {
    cy.visit('/');
    cy.document().then((doc) => {
      const orgs = ldByType(Cypress.$, doc, 'Organization');
      expect(orgs, 'one Organization node').to.have.length(1);
      const [org] = orgs;
      expect(org['@context']).to.equal('https://schema.org');
      expect(org.name).to.equal('InfluxData');
      expect(org.url).to.be.a('string').and.not.empty;
      // Stable @id so other nodes can reference the org as publisher later, and
      // so consumers dedupe the site-wide emission.
      expect(org['@id']).to.match(/\/#organization$/);
      // sameAs anchors entity resolution; acceptance criterion requires >=4.
      expect(org.sameAs).to.be.an('array');
      expect(org.sameAs.length).to.be.at.least(4);
    });
  });
});

// Site-wide emission: exactly one node (no duplicates) on a representative
// sample — namespace hub, product landing root, and a deep article. The
// "exactly one" assertion is the regression guard: it catches both omission
// (the original gap where hubs/deep pages emitted nothing) and accidental
// duplicate emission.
describe('Organization JSON-LD is present once on every page class', function () {
  const pages = {
    'namespace hub': '/influxdb3/',
    'product landing root': '/influxdb3/core/',
    'deep article': '/influxdb3/core/admin/',
  };

  Object.entries(pages).forEach(([label, url]) => {
    it(`emits exactly one Organization on the ${label} (${url})`, function () {
      cy.visit(url);
      cy.document().then((doc) => {
        expect(ldByType(Cypress.$, doc, 'Organization')).to.have.length(1);
      });
    });
  });
});
