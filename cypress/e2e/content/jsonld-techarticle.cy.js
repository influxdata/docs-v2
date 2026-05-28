/// <reference types="cypress" />

// #7242: TechArticle + SoftwareApplication JSON-LD on product doc pages.

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

describe('Product landing page JSON-LD', function () {
  beforeEach(() => cy.visit('/influxdb3/core/'));

  it('emits TechArticle with required fields', function () {
    cy.document().then((doc) => {
      const [ta] = ldByType(Cypress.$, doc, 'TechArticle');
      expect(ta, 'TechArticle present').to.exist;
      expect(ta['@context']).to.equal('https://schema.org');
      expect(ta.name).to.be.a('string').and.not.empty;
      expect(ta.mainEntityOfPage).to.match(/\/influxdb3\/core\/$/);
      expect(ta.about['@type']).to.equal('SoftwareApplication');
      expect(ta.isPartOf['@id']).to.match(/\/influxdb3\/core\/#software$/);
    });
  });

  it('emits SoftwareApplication with required fields', function () {
    cy.document().then((doc) => {
      const [sw] = ldByType(Cypress.$, doc, 'SoftwareApplication');
      expect(sw, 'SoftwareApplication present').to.exist;
      expect(sw.name).to.be.a('string').and.not.empty;
      expect(sw.url).to.be.a('string').and.not.empty;
      expect(sw.applicationCategory).to.equal('DatabaseApplication');
      expect(sw['@id']).to.equal(sw.url + '#software');
    });
  });
});

describe('Reference page JSON-LD', function () {
  it('emits TechArticle but NOT SoftwareApplication', function () {
    cy.visit('/influxdb3/core/reference/cli/');
    cy.document().then((doc) => {
      expect(ldByType(Cypress.$, doc, 'TechArticle')).to.have.length(1);
      expect(ldByType(Cypress.$, doc, 'SoftwareApplication')).to.have.length(0);
    });
  });
});

describe('Tags page JSON-LD exclusion', function () {
  it('emits neither TechArticle nor SoftwareApplication', function () {
    cy.visit('/influxdb3/core/tags/');
    cy.document().then((doc) => {
      expect(ldByType(Cypress.$, doc, 'TechArticle')).to.have.length(0);
      expect(ldByType(Cypress.$, doc, 'SoftwareApplication')).to.have.length(0);
    });
  });
});
