/**
 * This module retrieves browser context information and site data for the
 * current page, version, and product.
 */
import { products } from './services/influxdata-products.js';
import { influxdbUrls } from './services/influxdb-urls.js';
import { getProductKeyFromPath } from './utils/product-mappings.js';

/**
 * Product data return type
 */
interface ProductDataResult {
  product: string | Record<string, unknown>;
  urls: Record<string, unknown>;
}

/**
 * Get current product data based on URL path
 */
function getCurrentProductData(): ProductDataResult {
  const path = window.location.pathname;

  interface ProductMapping {
    pattern: RegExp;
    product: Record<string, unknown> | string;
    urls: Record<string, unknown>;
  }

  const mappings: ProductMapping[] = [
    {
      pattern: /\/influxdb\/cloud\//,
      product: products.influxdb_cloud,
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
      pattern: /\/enterprise_influxdb\//,
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

/**
 * Return the page context
 * (cloud, serverless, oss/enterprise, dedicated, clustered, core, enterprise, other)
 * Uses shared product key detection for consistency
 */
function getContext(): string {
  const productKey = getProductKeyFromPath(window.location.pathname);

  // Map product keys to context strings
  const contextMap: Record<string, string> = {
    influxdb_cloud: 'cloud',
    influxdb3_core: 'core',
    influxdb3_enterprise: 'enterprise',
    influxdb3_cloud_serverless: 'serverless',
    influxdb3_cloud_dedicated: 'dedicated',
    influxdb3_clustered: 'clustered',
    enterprise_influxdb: 'oss/enterprise',
    influxdb: 'oss/enterprise',
  };

  return contextMap[productKey || ''] || 'other';
}

// Store the host value for the current page
const currentPageHost =
  window.location.href.match(/^(?:[^/]*\/){2}[^/]+/g)?.[0] || '';

/**
 * Get referrer host from document.referrer
 */
function getReferrerHost(): string {
  // Extract the protocol and hostname of referrer
  const referrerMatch = document.referrer.match(/^(?:[^/]*\/){2}[^/]+/g);
  return referrerMatch ? referrerMatch[0] : '';
}

const context = getContext();
const host = currentPageHost;
const hostname = location.hostname;
const path = location.pathname;
const pathArr = location.pathname.split('/').slice(1, -1);
const product = pathArr[0];
const productData = getCurrentProductData();
const protocol = location.protocol;
const referrer = document.referrer === '' ? 'direct' : document.referrer;
const referrerHost = getReferrerHost();
// TODO: Verify this works since the addition of InfluxDB 3 naming
// and the Core and Enterprise versions.
const version =
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
