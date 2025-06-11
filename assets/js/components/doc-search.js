/**
 * DocSearch component for InfluxData documentation
 * Handles asynchronous loading and initialization of Algolia DocSearch
 */
const debug = false; // Set to true for debugging output

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
    const multiVersion = ['influxdb'];

    // Use object-based lookups instead of conditionals for version and product names
    // These can be replaced with data from productData in the future

    // Version display name mappings
    const versionDisplayNames = {
      cloud: 'Cloud (TSM)',
      core: 'Core',
      enterprise: 'Enterprise',
      'cloud-serverless': 'Cloud Serverless',
      'cloud-dedicated': 'Cloud Dedicated',
      clustered: 'Clustered',
      explorer: 'Explorer',
    };

    // Product display name mappings
    const productDisplayNames = {
      influxdb: 'InfluxDB',
      influxdb3: 'InfluxDB 3',
      explorer: 'InfluxDB 3 Explorer',
      enterprise_influxdb: 'InfluxDB Enterprise',
      flux: 'Flux',
      telegraf: 'Telegraf',
      chronograf: 'Chronograf',
      kapacitor: 'Kapacitor',
      platform: 'InfluxData Platform',
      resources: 'Additional Resources',
    };

    // Initialize DocSearch with configuration
    window.docsearch({
      apiKey: config.apiKey,
      appId: config.appId,
      indexName: config.indexName,
      inputSelector: config.inputSelector,
      debug: config.debug,
      transformData: function (hits) {
        // Format version using object lookup instead of if-else chain
        function fmtVersion(version, productKey) {
          if (version == null) {
            return '';
          } else if (versionDisplayNames[version]) {
            return versionDisplayNames[version];
          } else if (multiVersion.includes(productKey)) {
            return version;
          } else {
            return '';
          }
        }

        hits.map((hit) => {
          const pathData = new URL(hit.url).pathname
            .split('/')
            .filter((n) => n);
          const product = productDisplayNames[pathData[0]] || pathData[0];
          const version = fmtVersion(pathData[1], pathData[0]);

          hit.product = product;
          hit.version = version;
          hit.hierarchy.lvl0 =
            hit.hierarchy.lvl0 +
            ` <span class=\"search-product-version\">${product} ${version}</span>`;
          hit._highlightResult.hierarchy.lvl0.value =
            hit._highlightResult.hierarchy.lvl0.value +
            ` <span class=\"search-product-version\">${product} ${version}</span>`;
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
            '<div class="search-all-content"><a href="https:\/\/support.influxdata.com" target="_blank">Search all InfluxData content <span class="icon-arrow-up-right"></span></a>',
          empty:
            '<div class="search-no-results"><p>Not finding what you\'re looking for?</p> <a href="https:\/\/support.influxdata.com" target="_blank">Search all InfluxData content <span class="icon-arrow-up-right"></span></a></div>',
        },
      },
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
