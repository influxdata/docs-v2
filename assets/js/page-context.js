/** This module retrieves browser context information and site data for the
 * current page, version, and product.
 */
import { products } from './services/influxdata-products.js';
import { influxdbUrls } from './services/influxdb-urls.js';

function getCurrentProductData() {
  const path = window.location.pathname;
  const mappings = [
    {
      pattern: /\/influxdb\/cloud\//,
      product: products.cloud,
      urls: influxdbUrls.influxdb_cloud,
    },
    {
      pattern: /\/influxdb3\/core/,
      product: products.influxdb3_core,
      urls: influxdbUrls.core,
    },
    {
      pattern: /\/influxdb3\/enterprise/,
      product: products.influxdb3_enterprise,
      urls: influxdbUrls.enterprise,
    },
    {
      pattern: /\/influxdb3\/cloud-serverless/,
      product: products.influxdb3_cloud_serverless,
      urls: influxdbUrls.cloud,
    },
    {
      pattern: /\/influxdb3\/cloud-dedicated/,
      product: products.influxdb3_cloud_dedicated,
      urls: influxdbUrls.dedicated,
    },
    {
      pattern: /\/influxdb3\/clustered/,
      product: products.influxdb3_clustered,
      urls: influxdbUrls.clustered,
    },
    {
      pattern: /\/influxdb3\/explorer/,
      product: products.influxdb3_explorer,
      urls: influxdbUrls.core,
    },
    {
      pattern: /\/enterprise_v1\//,
      product: products.enterprise_influxdb,
      urls: influxdbUrls.oss,
    },
    {
      pattern: /\/influxdb.*v1\//,
      product: products.influxdb,
      urls: influxdbUrls.oss,
    },
    {
      pattern: /\/influxdb.*v2\//,
      product: products.influxdb,
      urls: influxdbUrls.oss,
    },
    {
      pattern: /\/kapacitor\//,
      product: products.kapacitor,
      urls: influxdbUrls.oss,
    },
    {
      pattern: /\/telegraf\//,
      product: products.telegraf,
      urls: influxdbUrls.oss,
    },
    {
      pattern: /\/chronograf\//,
      product: products.chronograf,
      urls: influxdbUrls.oss,
    },
    { pattern: /\/flux\//, product: products.flux, urls: influxdbUrls.oss },
  ];

  for (const { pattern, product, urls } of mappings) {
    if (pattern.test(path)) {
      return {
        product: product || 'unknown',
        urls: urls || {},
      };
    }
  }

  return { product: 'other', urls: {} };
}

// Return the page context
// (cloud, serverless, oss/enterprise, dedicated, clustered, explorer, other)
function getContext() {
  if (/\/influxdb\/cloud\//.test(window.location.pathname)) {
    return 'cloud';
  } else if (/\/influxdb3\/core/.test(window.location.pathname)) {
    return 'core';
  } else if (/\/influxdb3\/enterprise/.test(window.location.pathname)) {
    return 'enterprise';
  } else if (/\/influxdb3\/cloud-serverless/.test(window.location.pathname)) {
    return 'serverless';
  } else if (/\/influxdb3\/cloud-dedicated/.test(window.location.pathname)) {
    return 'dedicated';
  } else if (/\/influxdb3\/clustered/.test(window.location.pathname)) {
    return 'clustered';
  } else if (/\/influxdb3\/explorer/.test(window.location.pathname)) {
    return 'explorer';
  } else if (
    /\/(enterprise_|influxdb).*\/v[1-2]\//.test(window.location.pathname)
  ) {
    return 'oss/enterprise';
  } else {
    return 'other';
  }
}

// Store the host value for the current page
const currentPageHost = window.location.href.match(/^(?:[^/]*\/){2}[^/]+/g)[0];

function getReferrerHost() {
  // Extract the protocol and hostname of referrer
  const referrerMatch = document.referrer.match(/^(?:[^/]*\/){2}[^/]+/g);
  return referrerMatch ? referrerMatch[0] : '';
}

const context = getContext(),
  host = currentPageHost,
  hostname = location.hostname,
  path = location.pathname,
  pathArr = location.pathname.split('/').slice(1, -1),
  product = pathArr[0],
  productData = getCurrentProductData(),
  protocol = location.protocol,
  referrer = document.referrer === '' ? 'direct' : document.referrer,
  referrerHost = getReferrerHost(),
  // TODO: Verify this works since the addition of InfluxDB 3 naming
  // and the Core and Enterprise versions.
  version =
    /^v\d/.test(pathArr[1]) || pathArr[1]?.includes('cloud')
      ? pathArr[1].replace(/^v/, '')
      : 'n/a';

export {
  context,
  host,
  hostname,
  path,
  product,
  productData,
  protocol,
  referrer,
  referrerHost,
  version,
};
