/// <reference types="cypress" />

// Issue #7202: expand /platform/faq/ with category-level Q&As and emit
// FAQPage JSON-LD. The page is data-driven (data/faqs/platform.yml) via the
// `faq` shortcode and the header/faq-jsonld.html partial (faq_data: platform,
// faq_canonical: true).

describe('Platform FAQ page', function () {
  const url = '/platform/faq/';

  // Question text + anchorized id. Anchors are stable URLs that LLMs and
  // search engines deep-link to, so changing them is a breaking change.
  const questions = [
    { text: 'What is time series data?', anchor: 'what-is-time-series-data' },
    {
      text: 'What is InfluxDB used for?',
      anchor: 'what-is-influxdb-used-for',
    },
    {
      text: 'What industries use InfluxDB?',
      anchor: 'what-industries-use-influxdb',
    },
    {
      text: 'When should I use a time series database?',
      anchor: 'when-should-i-use-a-time-series-database',
    },
    {
      text: "What's the difference between a time series database and a relational database?",
      anchor:
        'whats-the-difference-between-a-time-series-database-and-a-relational-database',
    },
    { text: 'Is InfluxDB open source?', anchor: 'is-influxdb-open-source' },
    {
      text: 'Which version of InfluxDB should I use?',
      anchor: 'which-version-of-influxdb-should-i-use',
    },
    {
      text: 'Is InfluxDB 1 still available?',
      anchor: 'is-influxdb-1-still-available',
    },
    {
      text: 'Should I choose InfluxDB 1 or InfluxDB 3?',
      anchor: 'should-i-choose-influxdb-1-or-influxdb-3',
    },
  ];

  beforeEach(() => cy.visit(url));

  it('renders each FAQ question as an H2 with a stable anchor', function () {
    questions.forEach(({ text, anchor }) => {
      cy.get(`h2#${anchor}`).should('contain.text', text);
    });
  });

  it('wraps each FAQ answer in <div class="faq-answer"><p>...</p></div>', function () {
    cy.get('div.faq-answer').should('have.length', questions.length);
    cy.get('div.faq-answer').each(($div) => {
      cy.wrap($div).find('p').should('have.length.gte', 1);
    });
  });

  it('cross-links to the decision page from the version Q&A', function () {
    cy.get('a[href="/influxdb3/which-influxdb-3/"]').should('exist');
  });

  it('links the InfluxDB 1 Q&As to the platform overview and Sales', function () {
    cy.get('h2#is-influxdb-1-still-available')
      .next('div.faq-answer')
      .find('a[href="/platform/#influxdb-1x"]')
      .should('exist');
    cy.get('h2#is-influxdb-1-still-available')
      .next('div.faq-answer')
      .find('a[href="https://influxdata.com/contact-sales/"]')
      .should('exist');
    cy.get('h2#should-i-choose-influxdb-1-or-influxdb-3')
      .next('div.faq-answer')
      .find('a[href="/platform/#influxdb-1x"]')
      .should('exist');
  });

  it('does NOT leak raw markdown headings or list markers into the HTML', function () {
    cy.get('article.article--content').then(($article) => {
      const html = $article[0].innerHTML;
      expect(html).not.to.match(/(^|\n)## /);
      expect(html).not.to.match(/(^|\n)- \[/);
    });
  });

  it('emits FAQPage JSON-LD with one Question entity per visible Q&A', function () {
    cy.get('script[type="application/ld+json"]').then(($scripts) => {
      const faq = [...$scripts]
        .map((s) => JSON.parse(s.textContent))
        .find((j) => j['@type'] === 'FAQPage');
      expect(faq, 'FAQPage JSON-LD present').to.exist;
      expect(faq['@context']).to.equal('https://schema.org');
      expect(faq.mainEntity).to.have.length(questions.length);
      faq.mainEntity.forEach((q) => {
        expect(q['@type']).to.equal('Question');
        expect(q.name).to.be.a('string').and.not.empty;
        expect(q.acceptedAnswer['@type']).to.equal('Answer');
        expect(q.acceptedAnswer.text).to.be.a('string').and.not.empty;
        // Plain text only — no leftover HTML tags from markdownify | plainify.
        expect(q.acceptedAnswer.text).to.not.match(/<[a-z][^>]*>/i);
      });
    });
  });
});
