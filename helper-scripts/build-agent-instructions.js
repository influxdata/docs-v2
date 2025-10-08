#!/usr/bin/env node

/**
 * Script to generate GitHub Copilot instructions
 * for InfluxData documentation.
 */
import fs from 'fs';
import path from 'path';
import process from 'process';
import { execSync } from 'child_process';

// Get the current file path and directory
export { buildPlatformReference };

(async () => {
  try {
    await buildPlatformReference();
  } catch (error) {
    console.error('Error generating agent instructions:', error);
  }
})();

/**
 * Build PLATFORM_REFERENCE.md from data/products.yml
 * This generates a reference document for AI agents to understand
 * the different InfluxDB versions and products
 */
async function buildPlatformReference() {
  const yaml = await import('js-yaml');

  // Paths
  const productsPath = path.join(process.cwd(), 'data', 'products.yml');
  const referencePath = path.join(process.cwd(), 'PLATFORM_REFERENCE.md');

  // Read and parse the products.yml file
  const productsContent = fs.readFileSync(productsPath, 'utf8');
  const products = yaml.load(productsContent);

  // Generate markdown content
  let content = `<!-- This file is auto-generated from data/products.yml. Do not edit directly. -->
<!-- Run 'npm run build:agent:instructions' to regenerate this file. -->

Use the following information to help determine which InfluxDB version and product the user is asking about:

`;

  // Define product order
  const productOrder = [
    'influxdb',
    'enterprise_influxdb',
    'influxdb_cloud',
    'influxdb3_cloud_serverless',
    'influxdb3_cloud_dedicated',
    'influxdb3_clustered',
    'influxdb3_core',
    'influxdb3_enterprise',
    'influxdb3_explorer',
    'telegraf',
    'chronograf',
    'kapacitor',
    'flux',
  ];

  // Process each product in order
  for (const productKey of productOrder) {
    const product = products[productKey];
    if (!product) continue;

    // Handle products with multiple versions (like influxdb with v1 and v2)
    if (product.versions && product.versions.length > 1) {
      // Generate entries for each version
      for (const version of product.versions) {
        const versionName =
          version === 'v2'
            ? `${product.name} OSS ${version}`
            : version === 'v1'
              ? `${product.name} OSS ${version}`
              : `${product.name} ${version}`;

        content += `${versionName}:\n`;

        // Documentation URL
        const docUrl = generateDocUrlForVersion(productKey, product, version);
        if (docUrl) {
          content += `  - Documentation: ${docUrl}\n`;
        }

        // Query languages
        if (product.detector_config?.query_languages) {
          const languages = Object.keys(
            product.detector_config.query_languages
          ).join(' and ');
          content += `  - Query languages: ${languages}\n`;
        }

        // Clients/Tools
        const clients = generateClientsInfo(productKey, product);
        if (clients) {
          content += `  - Clients: ${clients}\n`;
        }

        content += '\n';
      }
    } else {
      // Single version products
      content += `${product.name}:\n`;

      // Documentation URL
      const docUrl = generateDocUrl(productKey, product);
      if (docUrl) {
        content += `  - Documentation: ${docUrl}\n`;
      }

      // Query languages
      if (product.detector_config?.query_languages) {
        const languages = Object.keys(
          product.detector_config.query_languages
        ).join(' and ');
        content += `  - Query languages: ${languages}\n`;
      }

      // Clients/Tools
      const clients = generateClientsInfo(productKey, product);
      if (clients) {
        content += `  - Clients: ${clients}\n`;
      }

      content += '\n';
    }
  }

  // Write the file
  fs.writeFileSync(referencePath, content);

  const fileSize = fs.statSync(referencePath).size;
  const sizeInKB = (fileSize / 1024).toFixed(1);
  console.log(
    `✅ Generated platform reference at ${referencePath} (${sizeInKB}KB)`
  );

  // Add the file to git if it has changed
  try {
    const gitStatus = execSync(
      `git status --porcelain "${referencePath}"`
    ).toString();
    if (gitStatus.trim()) {
      execSync(`git add "${referencePath}"`);
      console.log('✅ Added platform reference to git staging');
    }
  } catch (error) {
    console.warn('⚠️  Could not add file to git:', error.message);
  }
}

/**
 * Generate documentation URL for a product
 */
function generateDocUrl(productKey, product) {
  const baseUrl = 'https://docs.influxdata.com';

  switch (productKey) {
    case 'influxdb':
      return `${baseUrl}/influxdb/${product.latest}/`;
    case 'enterprise_influxdb':
      return `${baseUrl}/enterprise_influxdb/${product.latest}/`;
    case 'influxdb_cloud':
      return `${baseUrl}/influxdb/cloud/`;
    case 'influxdb3_cloud_serverless':
      return `${baseUrl}/influxdb3/cloud-serverless/`;
    case 'influxdb3_cloud_dedicated':
      return `${baseUrl}/influxdb3/cloud-dedicated/`;
    case 'influxdb3_clustered':
      return `${baseUrl}/influxdb3/clustered/`;
    case 'influxdb3_core':
      return `${baseUrl}/influxdb3/core/`;
    case 'influxdb3_enterprise':
      return `${baseUrl}/influxdb3/enterprise/`;
    case 'influxdb3_explorer':
      return `${baseUrl}/influxdb3/explorer/`;
    case 'telegraf':
      return `${baseUrl}/telegraf/${product.latest}/`;
    case 'chronograf':
      return `${baseUrl}/chronograf/${product.latest}/`;
    case 'kapacitor':
      return `${baseUrl}/kapacitor/${product.latest}/`;
    case 'flux':
      return `${baseUrl}/flux/${product.latest}/`;
    default:
      return null;
  }
}

/**
 * Generate documentation URL for a specific version of a product
 */
function generateDocUrlForVersion(productKey, product, version) {
  const baseUrl = 'https://docs.influxdata.com';

  switch (productKey) {
    case 'influxdb':
      return `${baseUrl}/influxdb/${version}/`;
    case 'enterprise_influxdb':
      return `${baseUrl}/enterprise_influxdb/${version}/`;
    default:
      return generateDocUrl(productKey, product);
  }
}

/**
 * Generate client/tool information for a product
 */
function generateClientsInfo(productKey, product) {
  const v3Products = [
    'influxdb3_core',
    'influxdb3_enterprise',
    'influxdb3_cloud_dedicated',
    'influxdb3_cloud_serverless',
    'influxdb3_clustered',
  ];

  if (productKey === 'influxdb3_core') {
    return 'Telegraf, influxdb3 CLI, v3 client libraries, InfluxDB 3 Explorer';
  } else if (productKey === 'influxdb3_enterprise') {
    return 'Telegraf, influxdb3 CLI, v3 client libraries, InfluxDB 3 Explorer';
  } else if (v3Products.includes(productKey)) {
    return 'Telegraf, influxctl CLI, v3 client libraries';
  } else if (
    productKey === 'influxdb' ||
    productKey === 'enterprise_influxdb'
  ) {
    return 'Telegraf, influx CLI, v1/v2 client libraries';
  } else if (productKey === 'influxdb_cloud') {
    return 'Telegraf, influx CLI, v2 client libraries';
  }

  return null;
}
