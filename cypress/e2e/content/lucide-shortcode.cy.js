/// <reference types="cypress" />

/**
 * Tests for the `lucide` shortcode.
 *
 * Verifies that the shortcode inlines icons from the lucide-static package as
 * SVG, renders them as decorative (aria-hidden), supports `size` modifiers,
 * inherits text color, preserves inner element geometry, renders as real markup
 * inline (not escaped text), and degrades gracefully (renders nothing) for an
 * unknown icon name.
 *
 * Assertions target the `#lucide-examples`, `#lucide-inline`, and
 * `#lucide-unknown` fixtures in content/example.md.
 */

describe('lucide shortcode', function () {
  beforeEach(() => cy.visit('/example/'));

  it('inlines an SVG icon for each usage', function () {
    cy.get('#lucide-examples svg.lucide').should('have.length', 4);
  });

  it('renders icons as decorative (hidden from screen readers)', function () {
    cy.get('#lucide-examples svg.lucide').each(($svg) => {
      cy.wrap($svg)
        .should('have.attr', 'aria-hidden', 'true')
        .and('not.have.attr', 'aria-label');
    });
  });

  it('applies size modifier classes', function () {
    cy.get('#lucide-examples svg.lucide.large').should('exist');
    cy.get('#lucide-examples svg.lucide.small').should('exist');
  });

  it('inherits the surrounding text color', function () {
    cy.get('#lucide-examples svg.lucide-circle-plus').should(
      'have.attr',
      'stroke',
      'currentColor'
    );
  });

  it('preserves inner element geometry (does not strip child dimensions)', function () {
    // Regression: the width/height strip must not touch inner shapes like
    // <rect>, or icons such as `fullscreen` render as empty boxes.
    cy.get('#lucide-inline svg.lucide-fullscreen rect')
      .should('have.attr', 'width')
      .and('not.be.empty');
    cy.get('#lucide-inline svg.lucide-fullscreen rect')
      .should('have.attr', 'height')
      .and('not.be.empty');
  });

  it('renders as an SVG element (not escaped text) inline in a list and bold', function () {
    // Regression: multi-line raw HTML is escaped by Goldmark inline parsing.
    // The shortcode must emit a single line so it renders as real markup.
    cy.get('#lucide-inline li strong svg.lucide-fullscreen').should('exist');
    cy.get('#lucide-inline').should('not.contain', '<svg');
  });

  it('renders nothing for an unknown icon name', function () {
    cy.get('#lucide-unknown').should('exist').find('svg').should('not.exist');
  });
});
