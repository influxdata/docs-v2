/**
 * DocSearch component for InfluxData documentation
 * Handles asynchronous loading and initialization of Algolia DocSearch
 */
import { products } from '../services/influxdata-products.js';
import {
  buildProductIndex,
  formatProductLabel,
} from '../utils/product-labels.js';

const debug = false; // Set to true for debugging output

// Result labels come from data/products.yml, which Hugo passes into the
// bundle as a js.Build param. Build the lookup once per page load.
const productIndex = buildProductIndex(products);

export default function DocSearch({ component }) {
  // Store configuration from component data attributes
  const config = {
    apiKey: component.getAttribute('data-api-key'),
    appId: component.getAttribute('data-app-id'),
    indexName: component.getAttribute('data-index-name'),
    inputSelector: component.getAttribute('data-input-selector'),
    searchTag: component.getAttribute('data-search-tag'),
    includeFlux: component.getAttribute('data-include-flux') === 'true',
    includeResources:
      component.getAttribute('data-include-resources') === 'true',
    debug: component.getAttribute('data-debug') === 'true',
  };

  // Initialize global object to track DocSearch state
  window.InfluxDocs = window.InfluxDocs || {};
  window.InfluxDocs.search = {
    initialized: false,
    options: config,
  };

  // Load DocSearch asynchronously
  function loadDocSearch() {
    if (debug) {
      console.log('Loading DocSearch script...');
    }
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js';
    script.async = true;
    script.onload = initializeDocSearch;
    document.body.appendChild(script);
  }

  // Initialize DocSearch after script loads
  function initializeDocSearch() {
    if (debug) {
      console.log('Initializing DocSearch...');
    }
    // Initialize DocSearch with configuration
    window.docsearch({
      apiKey: config.apiKey,
      appId: config.appId,
      indexName: config.indexName,
      inputSelector: config.inputSelector,
      debug: config.debug,
      transformData: function (hits) {
        hits.map((hit) => {
          const label = formatProductLabel(
            new URL(hit.url).pathname,
            productIndex
          );
          const badge = ` <span class="search-product-version">${label}</span>`;

          hit.productLabel = label;
          hit.hierarchy.lvl0 = hit.hierarchy.lvl0 + badge;
          hit._highlightResult.hierarchy.lvl0.value =
            hit._highlightResult.hierarchy.lvl0.value + badge;
        });
        return hits;
      },
      algoliaOptions: {
        hitsPerPage: 10,
        facetFilters: buildFacetFilters(config),
      },
      autocompleteOptions: {
        templates: {
          header:
            '<div class="search-all-content"><a href="https://support.influxdata.com" target="_blank">Search all InfluxData content <span class="icon-arrow-up-right"></span></a>',
          empty:
            '<div class="search-no-results"><p>Not finding what you\'re looking for?</p> <a href="https://support.influxdata.com" target="_blank">Search all InfluxData content <span class="icon-arrow-up-right"></span></a></div>',
        },
      },
    });

    // DocSearch clones the search input to create its autocomplete hint
    // element, duplicating the accesskey attribute. Remove the attribute from
    // the clone so the accesskey stays unique on the page.
    document.querySelectorAll('.ds-hint[accesskey]').forEach((hint) => {
      hint.removeAttribute('accesskey');
    });

    // Mark DocSearch as initialized
    window.InfluxDocs.search.initialized = true;

    // Dispatch event for other components to know DocSearch is ready
    window.dispatchEvent(new CustomEvent('docsearch-initialized'));
  }

  /**
   * Helper function to build facet filters based on config
   *   - Uses nested arrays for AND conditions
   *   - Includes space after colon in filter expressions
   */
  function buildFacetFilters(config) {
    if (!config.searchTag) {
      return ['latest:true'];
    } else if (config.includeFlux) {
      // Return a nested array to match original template structure
      // Note the space after each colon
      return [
        [
          'searchTag: ' + config.searchTag,
          'flux:true',
          'resources: ' + config.includeResources,
        ],
      ];
    } else {
      // Return a nested array to match original template structure
      // Note the space after each colon
      return [
        [
          'searchTag: ' + config.searchTag,
          'resources: ' + config.includeResources,
        ],
      ];
    }
  }

  // Load DocSearch when page is idle or after a slight delay
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadDocSearch);
  } else {
    setTimeout(loadDocSearch, 500);
  }

  // Return cleanup function
  return function cleanup() {
    // Clean up any event listeners if needed
    if (debug) {
      console.log('DocSearch component cleanup');
    }
  };
}
