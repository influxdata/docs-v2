/**
 * Shared product mapping and detection utilities
 *
 * This module provides URL-to-product mapping for both browser and Node.js environments.
 * In Node.js, it reads from data/products.yml. In browser, it uses fallback mappings.
 *
 * @module utils/product-mappings
 */

import { isNode, loadNodeModules } from './node-shim.js';

/**
 * Product information interface
 */
export interface ProductInfo {
  /** Full product display name */
  name: string;
  /** Product version or context identifier */
  version: string;
}

/**
 * Full product data from products.yml
 */
export interface ProductData {
  name: string;
  altname?: string;
  namespace: string;
  menu_category?: string;
  versions?: string[];
  list_order?: number;
  latest?: string;
  latest_patch?: string;
  latest_patches?: Record<string, string>;
  latest_cli?: string | Record<string, string>;
  placeholder_host?: string;
  link?: string;
  succeeded_by?: string;
  detector_config?: {
    query_languages?: Record<string, unknown>;
    characteristics?: string[];
    detection?: {
      ping_headers?: Record<string, string>;
      url_contains?: string[];
    };
  };
  ai_sample_questions?: string[];
}

/**
 * Products YAML data structure
 */
type ProductsData = Record<string, ProductData>;

let productsData: ProductsData | null = null;

/**
 * Load products data from data/products.yml (Node.js only)
 */
async function loadProductsData(): Promise<ProductsData | null> {
  if (!isNode) {
    return null;
  }

  if (productsData) {
    return productsData;
  }

  try {
    // Lazy load Node.js modules using shared shim
    const nodeModules = await loadNodeModules();
    if (!nodeModules) {
      return null;
    }

    const __filename = nodeModules.fileURLToPath(import.meta.url);
    const __dirname = nodeModules.dirname(__filename);
    const productsPath = nodeModules.join(
      __dirname,
      '../../../data/products.yml'
    );

    if (nodeModules.existsSync(productsPath)) {
      const fileContents = nodeModules.readFileSync(productsPath, 'utf8');
      productsData = nodeModules.yaml.load(fileContents) as ProductsData;
      return productsData;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.warn('Could not load products.yml:', err.message);
    }
  }

  return null;
}

/**
 * URL pattern to product key mapping
 * Used for quick lookups based on URL path
 */
const URL_PATTERN_MAP: Record<string, string> = {
  '/influxdb3/core/': 'influxdb3_core',
  '/influxdb3/enterprise/': 'influxdb3_enterprise',
  '/influxdb3/cloud-dedicated/': 'influxdb3_cloud_dedicated',
  '/influxdb3/cloud-serverless/': 'influxdb3_cloud_serverless',
  '/influxdb3/clustered/': 'influxdb3_clustered',
  '/influxdb3/explorer/': 'influxdb3_explorer',
  '/influxdb/cloud/': 'influxdb_cloud',
  '/influxdb/v2': 'influxdb',
  '/influxdb/v1': 'influxdb',
  '/enterprise_influxdb/': 'enterprise_influxdb',
  '/telegraf/': 'telegraf',
  '/telegraf/controller/': 'telegraf_controller',
  '/chronograf/': 'chronograf',
  '/kapacitor/': 'kapacitor',
  '/flux/': 'flux',
};

/**
 * Get the product key from a URL path
 *
 * @param path - URL path (e.g., '/influxdb3/core/get-started/')
 * @returns Product key (e.g., 'influxdb3_core') or null
 */
export function getProductKeyFromPath(path: string): string | null {
  for (const [pattern, key] of Object.entries(URL_PATTERN_MAP)) {
    if (path.includes(pattern)) {
      return key;
    }
  }
  return null;
}

// Fallback product mappings (used in browser and as fallback in Node.js)
const PRODUCT_FALLBACK_MAP: Record<string, ProductInfo> = {
  influxdb3_core: { name: 'InfluxDB 3 Core', version: 'core' },
  influxdb3_enterprise: {
    name: 'InfluxDB 3 Enterprise',
    version: 'enterprise',
  },
  influxdb3_cloud_dedicated: {
    name: 'InfluxDB Cloud Dedicated',
    version: 'cloud-dedicated',
  },
  influxdb3_cloud_serverless: {
    name: 'InfluxDB Cloud Serverless',
    version: 'cloud-serverless',
  },
  influxdb3_clustered: { name: 'InfluxDB Clustered', version: 'clustered' },
  influxdb3_explorer: { name: 'InfluxDB 3 Explorer', version: 'explorer' },
  influxdb_cloud: { name: 'InfluxDB Cloud (TSM)', version: 'cloud' },
  influxdb: { name: 'InfluxDB', version: 'v1' }, // Will be refined below
  enterprise_influxdb: { name: 'InfluxDB Enterprise v1', version: 'v1' },
  telegraf: { name: 'Telegraf', version: 'v1' },
  telegraf_controller: { name: 'Telegraf Controller', version: 'controller' },
  chronograf: { name: 'Chronograf', version: 'v1' },
  kapacitor: { name: 'Kapacitor', version: 'v1' },
  flux: { name: 'Flux', version: 'v0' },
};

/**
 * Get product information from a URL path (synchronous)
 * Returns simplified product info with name and version
 *
 * @param path - URL path to check (e.g., '/influxdb3/core/get-started/')
 * @returns Product info or null if no match
 *
 * @example
 * ```typescript
 * const product = getProductFromPath('/influxdb3/core/admin/');
 * // Returns: { name: 'InfluxDB 3 Core', version: 'core' }
 * ```
 */
export function getProductFromPath(path: string): ProductInfo | null {
  const productKey = getProductKeyFromPath(path);
  if (!productKey) {
    return null;
  }

  // If we have cached YAML data (Node.js), use it
  if (productsData && productsData[productKey]) {
    const product = productsData[productKey];
    return {
      name: product.name,
      version: product.latest || product.versions?.[0] || 'unknown',
    };
  }

  // Use fallback map
  const fallbackInfo = PRODUCT_FALLBACK_MAP[productKey];
  if (!fallbackInfo) {
    return null;
  }

  // Handle influxdb product which can be v1 or v2
  if (productKey === 'influxdb') {
    return {
      name: path.includes('/v2') ? 'InfluxDB OSS v2' : 'InfluxDB OSS v1',
      version: path.includes('/v2') ? 'v2' : 'v1',
    };
  }

  return fallbackInfo;
}

/**
 * Initialize product data from YAML (Node.js only, async)
 * Call this in Node.js scripts to load product data before using getProductFromPath
 */
export async function initializeProductData(): Promise<void> {
  if (isNode && !productsData) {
    await loadProductsData();
  }
}

/**
 * Get full product data from products.yml (Node.js only)
 * Note: Call initializeProductData() first to load the YAML data
 *
 * @param productKey - Product key (e.g., 'influxdb3_core')
 * @returns Full product data object or null
 */
export function getProductData(productKey: string): ProductData | null {
  if (!isNode) {
    console.warn('getProductData() is only available in Node.js environment');
    return null;
  }

  // Use cached data (requires initializeProductData() to have been called)
  return productsData?.[productKey] || null;
}

/**
 * Export URL pattern map for external use
 */
export { URL_PATTERN_MAP };
