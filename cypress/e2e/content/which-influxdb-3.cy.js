/// <reference types="cypress" />

// PR 1 scope: the canonical decision page renders correctly.
// JSON-LD assertions live with PR 2. Hub-landing assertions live with PR 3.
// Cross-link / llms.txt assertions live with PR 4.

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

  it('renders all 7 FAQ questions as H2s with stable anchors', function () {
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
        text: 'Is InfluxDB 3 Cloud Serverless the same as InfluxDB 3 Enterprise?',
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
      cy.get(`h2#${anchor}`).should('contain.text', text);
    });
  });

  it('wraps each FAQ answer in <div class="faq-answer"><p>...</p></div>', function () {
    cy.get('div.faq-answer').should('have.length', 7);
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
      'Free, open source, single-node',
      'Multi-tenant, self-service cloud for smaller workloads',
      'Managed single-tenant cloud',
      'Kubernetes',
      'Running InfluxDB 1 or InfluxDB 2 today',
    ].forEach((row) => cy.contains('td', row).should('exist'));
  });

  it('links to verified migration guide URLs', function () {
    cy.get(
      'a[href="/influxdb3/enterprise/get-started/migrate-from-influxdb-v1-v2/"]'
    ).should('exist');
    cy.get(
      'a[href="/influxdb3/core/get-started/migrate-from-influxdb-v1-v2/"]'
    ).should('exist');
  });
});
