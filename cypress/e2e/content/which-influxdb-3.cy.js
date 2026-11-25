/// <reference types="cypress" />

// PR 1 scope: the canonical decision page renders correctly.
// PR 2 scope: FAQPage JSON-LD emitted on the canonical URL.
// PR 3 scope: /influxdb3/ hub landing is a standalone navigation page with a
//             product children list and callout link to the
//             decision page.
// PR 4 scope: cross-link callouts on v3 product index pages + platform FAQ
//             cross-link Q&A (see the "Cross-link callouts" describe block).

describe('Which InfluxDB 3 decision page (canonical)', function () {
  const url = '/influxdb3/which-influxdb-3/';

  beforeEach(() => cy.visit(url));

  it('uses the InfluxDB 3 documentation title (not <nil>)', function () {
    cy.title().should(
      'eq',
      'Which InfluxDB 3 should I use? | InfluxDB 3 Documentation'
    );
  });

  it('renders the H1', function () {
    cy.get('h1').should('contain.text', 'Which InfluxDB 3 should I use');
  });

  it('renders all 8 FAQ questions as H3s under the H2 section with stable anchors', function () {
    const questions = [
      {
        text: "What's the difference between InfluxDB 1, InfluxDB 2, and InfluxDB 3?",
        anchor:
          'whats-the-difference-between-influxdb-1-influxdb-2-and-influxdb-3',
      },
      {
        text: 'Should I start a new project on InfluxDB 1 or InfluxDB 2?',
        anchor: 'should-i-start-a-new-project-on-influxdb-1-or-influxdb-2',
      },
      {
        text: 'I run InfluxDB 2 today',
        anchor: 'i-run-influxdb-2-today--should-i-migrate-to-influxdb-3',
      },
      {
        text: 'I run InfluxDB 1 today',
        anchor: 'i-run-influxdb-1-today--should-i-migrate-to-influxdb-3',
      },
      {
        text: "What's the difference between InfluxDB 3 Cloud and InfluxDB Cloud Serverless?",
        anchor:
          'whats-the-difference-between-influxdb-3-cloud-and-influxdb-cloud-serverless',
      },
      {
        text: 'Is InfluxDB Cloud Serverless the same as InfluxDB 3 Enterprise?',
        anchor:
          'is-influxdb-3-cloud-serverless-the-same-as-influxdb-3-enterprise',
      },
      {
        text: 'Which query languages does InfluxDB 3 support?',
        anchor: 'which-query-languages-does-influxdb-3-support',
      },
      {
        text: 'Where does InfluxDB 3 Explorer fit?',
        anchor: 'where-does-influxdb-3-explorer-fit',
      },
    ];
    questions.forEach(({ text, anchor }) => {
      cy.get(`h3#${anchor}`).should('contain.text', text);
    });
  });

  it('nests FAQ questions under a single "Frequently asked questions" H2', function () {
    cy.get('h2#frequently-asked-questions').should('exist');
    cy.get('article.article--content h2').then(($h2s) => {
      const ids = [...$h2s].map((h) => h.id);
      expect(ids).to.not.include(
        'whats-the-difference-between-influxdb-1-influxdb-2-and-influxdb-3'
      );
    });
    cy.get('div.faq-answer').each(($div) => {
      cy.wrap($div).prevAll('h2, h3').first().should('match', 'h3');
    });
  });

  it('lists FAQ questions in the "On this page" sidebar', function () {
    cy.get('[data-component="page-toc"]').should(
      'have.attr',
      'data-toc-depth',
      '3'
    );
    cy.get(
      '[data-component="page-toc"] a[href="#where-does-influxdb-3-explorer-fit"]'
    ).should('exist');
  });

  it('keeps the JSON-LD questions identical to the visible H3 questions', function () {
    cy.get('div.faq-answer').then(() => {
      const visible = [...Cypress.$('article.article--content h3')]
        .filter((h) => Cypress.$(h).next('div.faq-answer').length)
        .map((h) => h.textContent.trim());
      cy.get('script[type="application/ld+json"]').then(($scripts) => {
        const faq = [...$scripts]
          .map((s) => JSON.parse(s.textContent))
          .find((j) => j['@type'] === 'FAQPage');
        expect(faq.mainEntity.map((q) => q.name)).to.deep.equal(visible);
      });
    });
  });

  it('wraps each FAQ answer in <div class="faq-answer"><p>...</p></div>', function () {
    cy.get('div.faq-answer').should('have.length', 8);
    cy.get('div.faq-answer').each(($div) => {
      cy.wrap($div).find('p').should('have.length.gte', 1);
    });
  });

  it('does NOT leak raw markdown headings or list markers into the rendered HTML', function () {
    cy.get('article.article--content').then(($article) => {
      const html = $article[0].innerHTML;
      // No raw '## ' at the start of any line, and no raw '- [' list markers in prose.
      expect(html).not.to.match(/(^|\n)## /);
      expect(html).not.to.match(/(^|\n)- \[/);
    });
  });

  it('self-canonicals to its own URL (no canonical override on this page)', function () {
    cy.get('link[rel="canonical"]')
      .should('have.attr', 'href')
      .and('match', /\/influxdb3\/which-influxdb-3\/?$/);
  });

  it('renders the decision table rows', function () {
    cy.contains('th', 'Your situation').should('exist');
    [
      'New production deployment',
      'Fully managed InfluxDB 3 Enterprise, single-tenant',
      'Free, open source, single-node',
      'Multi-tenant, self-service cloud for smaller workloads',
      'Existing InfluxDB Cloud Dedicated deployments',
      'Kubernetes',
      'InfluxQL-native workloads, Kapacitor alerting, or an established 1.x cluster',
      'Running InfluxDB 1 today',
      'Running InfluxDB 2 today',
    ].forEach((row) => cy.contains('td', row).should('exist'));
  });

  it('links to InfluxDB 3 Cloud and its trial signup', function () {
    cy.get('a[href="/influxdb3/cloud/"]').should('exist');
    cy.get(
      'a[href="https://www.influxdata.com/influxdb3-cloud-signup/"]'
    ).should('exist');
  });

  it('links to verified migration guide URLs', function () {
    cy.get(
      'a[href="/influxdb3/enterprise/get-started/migrate-from-influxdb-v1-v2/"]'
    ).should('exist');
    cy.get(
      'a[href="/influxdb3/core/get-started/migrate-from-influxdb-v1-v2/"]'
    ).should('exist');
  });

  it('emits FAQPage JSON-LD with 8 Question entities', function () {
    cy.get('script[type="application/ld+json"]').then(($scripts) => {
      const faq = [...$scripts]
        .map((s) => JSON.parse(s.textContent))
        .find((j) => j['@type'] === 'FAQPage');
      expect(faq, 'FAQPage JSON-LD present').to.exist;
      expect(faq['@context']).to.equal('https://schema.org');
      expect(faq.mainEntity).to.have.length(8);
      faq.mainEntity.forEach((q) => {
        expect(q['@type']).to.equal('Question');
        expect(q.name).to.be.a('string').and.not.empty;
        expect(q.acceptedAnswer['@type']).to.equal('Answer');
        expect(q.acceptedAnswer.text).to.be.a('string').and.not.empty;
        // Plain text only — no leftover HTML tags from markdownify.
        expect(q.acceptedAnswer.text).to.not.match(/<[a-z][^>]*>/i);
      });
    });
  });
});

describe('InfluxDB 3 hub landing', function () {
  const url = '/influxdb3/';

  beforeEach(() => cy.visit(url));

  it('renders the InfluxDB 3 H1 (replacing the auto-generated section title)', function () {
    cy.get('h1').should('contain.text', 'InfluxDB 3');
    cy.get('h1').should('not.contain.text', 'Influxdb3s');
  });

  it('renders the v3 product children list with the decision page filtered out', function () {
    cy.get('div.children-links').should('have.length', 1);
    const expectedProducts = [
      'InfluxDB 3 Core',
      'InfluxDB 3 Enterprise',
      'InfluxDB 3 Explorer',
      'InfluxDB Cloud Dedicated',
      'InfluxDB Cloud Serverless',
      'InfluxDB Clustered',
    ];
    expectedProducts.forEach((name) => {
      cy.get('div.children-links').contains('h2 a', name).should('exist');
    });
    cy.get('div.children-links')
      .contains('h2', 'Which InfluxDB 3 should I use?')
      .should('not.exist');
  });

  it('renders the next-gen blurb', function () {
    // The blurb spans multiple semantic-line-feed lines in markdown, so the
    // rendered <p> contains literal newlines between words. contain.text is
    // whitespace-strict, so assert short substrings that don't cross line
    // breaks.
    cy.get('article.article--content')
      .should('contain.text', 'current generation of InfluxDB')
      .and('contain.text', 'recommended platform')
      .and('contain.text', 'new time series workloads');
  });

  it('routes to InfluxDB 1 without obscuring the v3 recommendation', function () {
    cy.get('article.article--content')
      .should('contain.text', 'recommended platform')
      .and(
        'contain.text',
        'InfluxDB 1 remains available and actively supported'
      );
    cy.get('article.article--content a[href="/platform/#influxdb-1x"]').should(
      'exist'
    );
  });

  it('renders a callout link to the decision page', function () {
    cy.get('a[href="/influxdb3/which-influxdb-3/"]').should('exist');
  });

  it('self-canonicals to its own URL', function () {
    cy.get('link[rel="canonical"]')
      .should('have.attr', 'href')
      .and('match', /\/influxdb3\/?$/);
  });

  it('does NOT emit FAQPage JSON-LD (canonical equity stays on the slug)', function () {
    // Use Cypress.$ (raw jQuery, no implicit existence retry) — hub may
    // legitimately have zero <script type="application/ld+json"> tags.
    cy.document().then((doc) => {
      const scripts = Cypress.$(doc).find('script[type="application/ld+json"]');
      const faqScripts = [...scripts]
        .map((s) => {
          try {
            return JSON.parse(s.textContent);
          } catch {
            return null;
          }
        })
        .filter((j) => j && j['@type'] === 'FAQPage');
      expect(
        faqScripts,
        'FAQPage JSON-LD must not appear on the hub'
      ).to.have.length(0);
    });
  });
});

describe('Cross-link callouts to the decision page', function () {
  const productPages = [
    '/influxdb3/core/',
    '/influxdb3/enterprise/',
    '/influxdb3/cloud-dedicated/',
    '/influxdb3/cloud-serverless/',
    '/influxdb3/clustered/',
  ];

  productPages.forEach((url) => {
    it(`${url} links to the decision page`, function () {
      cy.visit(url);
      cy.get('a[href="/influxdb3/which-influxdb-3/"]').should('exist');
    });
  });

  it('/platform/faq/ has a "Which version of InfluxDB should I use?" Q&A', function () {
    cy.visit('/platform/faq/');
    cy.get('h2#which-version-of-influxdb-should-i-use').should('exist');
    cy.get('a[href="/influxdb3/which-influxdb-3/"]').should('exist');
  });
});

describe('Platform page InfluxDB 1 section', function () {
  beforeEach(() => cy.visit('/platform/'));

  it('keeps the anchors that inbound links use', function () {
    ['influxdb-1x', 'influxdb-cloud-1', 'migrate-to-influxdb-3'].forEach(
      (id) => {
        cy.get(`[id="${id}"]`).should('have.length', 1);
      }
    );
  });

  it('uses the confirmed InfluxDB 1 flavor names in the comparison table', function () {
    ['InfluxDB 1 OSS', 'InfluxDB 1 Enterprise', 'InfluxDB 1 Cloud'].forEach(
      (name) => cy.contains('table td strong a', name).should('exist')
    );
  });

  it('presents InfluxDB 1 Cloud as available through Sales', function () {
    cy.get('#influxdb-cloud-1')
      .next()
      .should('contain.text', 'available to new customers through Sales');
    cy.get('article.article--content').should(
      'not.contain.text',
      'New signups are no longer available for InfluxDB 1'
    );
    cy.get('a[href="https://help.influxcloud.net"]').should('exist');
  });

  it('leaves the InfluxDB Cloud (TSM) lifecycle notice unchanged', function () {
    cy.get('article.article--content')
      .should(
        'contain.text',
        'InfluxDB Cloud (TSM) is a legacy managed service'
      )
      .and('contain.text', 'New signups are no longer available');
  });
});

describe('Cloud 1 note', function () {
  ['/enterprise_influxdb/v1/', '/influxdb/v1/'].forEach((url) => {
    it(`${url} links to an existing platform heading`, function () {
      cy.visit(url);
      cy.contains('.note.block h4', 'InfluxDB 1 Cloud users').should('exist');
      cy.get('.note.block a[href="/platform/#migrate-to-influxdb-3"]').should(
        'exist'
      );
      cy.visit('/platform/');
      cy.get('#migrate-to-influxdb-3').should('have.length', 1);
    });
  });
});
