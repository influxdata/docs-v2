/// <reference types="cypress" />

/**
 * Fragment id tests for influxdata/docs-v2#7703.
 *
 * `code-tabs-wrapper`/`tabs-wrapper` must pair each tab link with its
 * matching content section by position and assign the paired section a
 * real `id`, slugified from the tab link's visible label text (not its
 * href, which is frequently an empty `#`). Fixtures live in
 * content/example.md under "Tab content fragment ids".
 */

describe('Tab content fragment ids', () => {
  beforeEach(() => {
    cy.visit('/example/');
  });

  it('assigns ids to code-tab-content sections matching tab label slugs', () => {
    cy.contains('h4', 'Basic code-tabs pairing')
      .nextUntil('h4')
      .filter('.code-tabs-wrapper')
      .first()
      .as('wrapper');

    cy.get('@wrapper')
      .find('.code-tab-content')
      .eq(0)
      .should('have.id', 'linux');
    cy.get('@wrapper')
      .find('.code-tab-content')
      .eq(1)
      .should('have.id', 'macos');

    cy.get('@wrapper')
      .find('.code-tabs a')
      .eq(0)
      .should('have.attr', 'href', '#linux');
    cy.get('@wrapper')
      .find('.code-tabs a')
      .eq(1)
      .should('have.attr', 'href', '#macos');
  });

  it('slugifies a tab label the same way goldmark slugifies headings', () => {
    cy.contains('h4', 'Basic tabs pairing with a slugified label')
      .nextUntil('h4')
      .filter('.tabs-wrapper')
      .first()
      .as('wrapper');

    cy.get('@wrapper')
      .find('.tab-content')
      .eq(0)
      .should('have.id', 'sql--influxql');

    // `flux` is already taken by earlier tab fixtures on this page, so the
    // id is the deduplicated form. Assert the slug base, not a fixed suffix,
    // so adding an unrelated Flux tab earlier on the page can't break this.
    cy.get('@wrapper')
      .find('.tab-content')
      .eq(1)
      .invoke('attr', 'id')
      .should('match', /^flux(-\d+)?$/);
  });

  it('does not bleed ids across a nested wrapper boundary', () => {
    cy.contains(
      'h4',
      'Nested wrapper pairing does not bleed across the boundary'
    )
      .nextUntil('h4')
      .filter('.tabs-wrapper')
      .first()
      .as('outer');

    // Outer tabs-wrapper's own direct tab-content sections get the outer ids.
    cy.get('@outer').find('> .tab-content').eq(0).should('have.id', 'windows');
    cy.get('@outer').find('> .tab-content').eq(1).should('have.id', 'freebsd');

    // The nested code-tabs-wrapper's sections get their own ids, not the
    // outer wrapper's ids or a bled/duplicated pairing.
    cy.get('@outer')
      .find('.code-tabs-wrapper .code-tab-content')
      .eq(0)
      .should('have.id', 'apt');
    cy.get('@outer')
      .find('.code-tabs-wrapper .code-tab-content')
      .eq(1)
      .should('have.id', 'yum');

    // No cross-boundary bleed: 'windows'/'freebsd' must not land on the
    // nested sections, and 'apt'/'yum' must not land on the outer ones.
    cy.get('@outer').find('#windows').should('have.length', 1);
    cy.get('@outer').find('#freebsd').should('have.length', 1);
  });

  it('disambiguates a tab id that collides with an existing heading id', () => {
    cy.get('#docker').should('have.length', 1); // the heading itself

    cy.contains('h4', 'Tab label collides with an existing heading id')
      .nextUntil('h4')
      .filter('.tabs-wrapper')
      .first()
      .find('.tab-content')
      .eq(0)
      .invoke('attr', 'id')
      .should('exist')
      .and('not.equal', 'docker');

    // The heading keeps its id; only one element on the page owns it.
    cy.get('[id="docker"]').should('have.length', 1);
  });

  it("rewrites a tab link's href to match its paired section id, not just the first group's", () => {
    cy.contains('h4', 'Tab link hrefs match their paired section id')
      .nextUntil('h4')
      .filter('.code-tabs-wrapper')
      .as('groups');

    cy.get('@groups').eq(0).find('.code-tab-content').should('have.id', 'go');
    cy.get('@groups')
      .eq(0)
      .find('.code-tabs a')
      .should('have.attr', 'href', '#go');

    cy.get('@groups')
      .eq(1)
      .find('.code-tab-content')
      .invoke('attr', 'id')
      .should('match', /^go-\d+$/)
      .then((secondId) => {
        cy.get('@groups')
          .eq(1)
          .find('.code-tabs a')
          .should('have.attr', 'href', `#${secondId}`);
      });
  });

  it('prefixes ids with the wrapper id argument when one is given', () => {
    cy.contains(
      'h4',
      'Wrapper-level id opts a tab group into a durable fragment'
    )
      .nextUntil('h4')
      .filter('.tabs-wrapper')
      .first()
      .as('wrapper');

    cy.get('@wrapper')
      .find('.tab-content')
      .eq(0)
      .should('have.id', 'install-linux');
    cy.get('@wrapper')
      .find('.tab-content')
      .eq(1)
      .should('have.id', 'install-macos');

    cy.get('@wrapper')
      .find('.tabs a')
      .eq(0)
      .should('have.attr', 'href', '#install-linux');
    cy.get('@wrapper')
      .find('.tabs a')
      .eq(1)
      .should('have.attr', 'href', '#install-macos');
  });
});

describe('Tab content fragment ids on shared (source:) content', () => {
  // influxdb3/core/get-started/query.md has no body of its own -- it's
  // rendered from content/shared/influxdb3-get-started/query.md via
  // `source:`. That page has several `[SQL](#)`/`[InfluxQL](#)` code-tabs
  // groups ahead of a later "### SQL" / "### InfluxQL" heading pair, so the
  // first tab group's fallback id collides with the heading's id unless
  // collision detection sees the real (sourced) markdown, not this page's
  // empty stub body.
  it('disambiguates tab ids against headings on a source: page', () => {
    cy.visit('/influxdb3/core/get-started/query/');

    cy.get('h3#sql').should('have.length', 1);
    cy.get('h3#influxql').should('have.length', 1);

    cy.get('.code-tab-content[id="sql"]').should('have.length', 0);
    cy.get('.code-tab-content[id="influxql"]').should('have.length', 0);

    cy.get('[id="sql"]').should('have.length', 1);
    cy.get('[id="influxql"]').should('have.length', 1);
  });
});
