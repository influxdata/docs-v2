import { createAPIPages, deleteAPIPages } from './create-pages.mjs';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the root directory for the docs
const DOCS_ROOT = path.resolve(__dirname, '..');

function getAPIConfigs() {
  // Load the products data
  const products = yaml.load(readFileSync(path.join(DOCS_ROOT, '/data/products.yml'), 'utf8'));

  const configs = [];

  Object.keys(products).forEach(productKey => {
    const product = products[productKey];
    const productVersion = product.versions[0];
    let menuName = productKey;
    if (menuName === 'influxdb') {
      menuName = `${menuName}_${productVersion}`;
    }
    
    if (!product.apis) {
      return;
    }

    const { apis } = yaml.load(readFileSync(path.join(DOCS_ROOT, product.apis), 'utf8'));

    Object.keys(apis).forEach(version => {
      const [ apiShortName ] = version.split('@');
      // Set API configuration properties used to create pages
      const api = apis[version];
      api.doc_path = path.join(DOCS_ROOT, `content/influxdb/${productVersion}/api/${apiShortName}`);
      api.spec_path = path.join(DOCS_ROOT, 'api-build-scripts', productVersion, api.root);
      const menu = {}
      menu[productKey] = {
        parent: 'InfluxDB HTTP API',
        weight: 0,
      };
      api.pageParams = {
        type: 'api-reference',
        title: `${product.name} ${apiShortName}`,
        description: 'InfluxDB API documentation',
        menu,
        tags: [productKey, 'api'],
        api_version: version,
        api_name: `${productVersion}-${apiShortName}`,
      };
      configs.push(api);
    });
  });
  return configs;
}

function buildAPIPages() {
  console.log(getAPIConfigs());
  getAPIConfigs().forEach(api => {
    // Delete existing pages for each API;
    deleteAPIPages(api.doc_path);
    
    // Create pages for each;
    createAPIPages(api.pageParams, api.spec_path, api.doc_path);
  });
}

buildAPIPages();
//console.log(getAPIConfigs());