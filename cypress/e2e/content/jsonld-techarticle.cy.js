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
      // about and isPartOf are @id references to the SoftwareApplication node
      // (not inline objects — an inline {@type,name} would be parsed as a
      // separate, incomplete SoftwareApplication and fail validation).
      expect(ta.about['@id']).to.match(/\/influxdb3\/core\/#software$/);
      expect(ta.isPartOf['@id']).to.match(/\/influxdb3\/core\/#software$/);
      // dateModified must be ISO 8601 with a timezone offset.
      expect(ta.dateModified).to.match(
        /T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/
      );
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

// Regression guard: products whose landing is a versioned section root
// (content_path is the bare product, e.g. `telegraf`, but the landing is
// /telegraf/v1/). The SoftwareApplication node must emit on the versioned
// landing and a child page's isPartOf must resolve to it — not to a
// non-existent /telegraf/#software node.
describe('Versioned-landing product JSON-LD (Telegraf)', function () {
  it('emits SoftwareApplication on the versioned landing with the patch version', function () {
    cy.visit('/telegraf/v1/');
    cy.document().then((doc) => {
      const [sw] = ldByType(Cypress.$, doc, 'SoftwareApplication');
      expect(sw, 'SoftwareApplication present on /telegraf/v1/').to.exist;
      expect(sw['@id']).to.match(/\/telegraf\/v1\/#software$/);
      expect(sw.softwareVersion).to.match(/^1\.\d+/);
    });
  });

  it('child page isPartOf resolves to the versioned landing, not a dangling node', function () {
    cy.visit('/telegraf/v1/install/');
    cy.document().then((doc) => {
      const [ta] = ldByType(Cypress.$, doc, 'TechArticle');
      expect(ta, 'TechArticle present').to.exist;
      expect(ta.isPartOf['@id']).to.match(/\/telegraf\/v1\/#software$/);
      // articleSection must be the docs section, not the version segment.
      expect(ta.articleSection).to.not.match(/^V?\d/i);
    });
  });
});

// Multi-version product (influxdb has a map content_path): each versioned
// landing emits its own SoftwareApplication node with that version's patch.
describe('Multi-version product JSON-LD (InfluxDB v2)', function () {
  it('emits a SoftwareApplication scoped to /influxdb/v2/', function () {
    cy.visit('/influxdb/v2/');
    cy.document().then((doc) => {
      const [sw] = ldByType(Cypress.$, doc, 'SoftwareApplication');
      expect(sw, 'SoftwareApplication present on /influxdb/v2/').to.exist;
      expect(sw['@id']).to.match(/\/influxdb\/v2\/#software$/);
      expect(sw.softwareVersion).to.match(/^2\./);
    });
  });
});
