/** This module retrieves browser context information and site data for the
 * current page, version, and product.
 */
import { products, influxdb_urls } from '@params';

function getCurrentProductData() {
  const path = window.location.pathname;
  const mappings = [
    { pattern: /\/influxdb\/cloud\//, product: products.cloud, urls: influxdb_urls.influxdb_cloud },
    { pattern: /\/influxdb3\/core/, product: products.influxdb3_core, urls: influxdb_urls.core },
    { pattern: /\/influxdb3\/enterprise/, product: products.influxdb3_enterprise, urls: influxdb_urls.enterprise },
    { pattern: /\/influxdb3\/cloud-serverless/, product: products.influxdb3_cloud_serverless, urls: influxdb_urls.cloud },
    { pattern: /\/influxdb3\/cloud-dedicated/, product: products.influxdb3_cloud_dedicated, urls: influxdb_urls.dedicated },
    { pattern: /\/influxdb3\/clustered/, product: products.influxdb3_clustered, urls: influxdb_urls.clustered },
    { pattern: /\/enterprise_v1\//, product: products.enterprise_influxdb, urls: influxdb_urls.oss },
    { pattern: /\/influxdb.*v1\//, product: products.influxdb, urls: influxdb_urls.oss },
    { pattern: /\/influxdb.*v2\//, product: products.influxdb, urls: influxdb_urls.oss },
    { pattern: /\/kapacitor\//, product: products.kapacitor, urls: influxdb_urls.oss },
    { pattern: /\/telegraf\//, product: products.telegraf, urls: influxdb_urls.oss },
    { pattern: /\/chronograf\//, product: products.chronograf, urls: influxdb_urls.oss },
  ];

  for (const { pattern, product, urls } of mappings) {
    if (pattern.test(path)) {
      return { product, urls };
    }
  }

  return 'other';
}

// Return the page context (cloud, serverless, oss/enterprise, dedicated, clustered, other)
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
  // TODO: Verify this still does what we want since the addition of InfluxDB 3 naming and the Core and Enterprise versions.
  version = (/^v\d/.test(pathArr[1]) || pathArr[1]?.includes('cloud') ? pathArr[1].replace(/^v/, '') : "n/a")

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