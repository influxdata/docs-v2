#!/usr/bin/env node
/**
 * Build root llms.txt from repository data.
 *
 * Hugo still has a template for local serving, but CI writes this file after
 * Hugo so deploy builds do not depend on custom home outputs.
 */

import fs from 'fs/promises';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { getCorpusPaths } from './lib/corpus-paths.js';
import { loadOrgIdentity } from './lib/provenance.js';

export function parsePublicDir(args = process.argv.slice(2)) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--public-dir' && args[i + 1]) {
      return path.resolve(process.cwd(), args[i + 1]);
    }
  }
  return path.resolve(process.cwd(), 'public');
}

function loadCorpusPaths() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const productsPath = path.resolve(__dirname, '..', 'data', 'products.yml');
  const products = yaml.load(readFileSync(productsPath, 'utf-8'));
  return getCorpusPaths(products);
}

const PRODUCT_SECTIONS = [
  {
    heading: 'InfluxDB 3',
    links: [
      {
        key: 'influxdb3_core',
        description:
          'Open source time series database optimized for real-time data',
      },
      {
        key: 'influxdb3_enterprise',
        description:
          'Enterprise features including clustering and high availability',
      },
      {
        key: 'influxdb3_cloud_dedicated',
        description: 'Dedicated cloud deployment with predictable performance',
      },
      {
        key: 'influxdb3_cloud_serverless',
        description: 'Serverless cloud deployment with usage-based pricing',
      },
      {
        key: 'influxdb3_clustered',
        description: 'Self-managed clustered deployment',
      },
      {
        key: 'influxdb3_explorer',
        target: 'page',
        description: 'Web-based data exploration tool',
      },
    ],
  },
  {
    heading: 'InfluxDB 2',
    links: [
      {
        key: 'influxdb',
        version: 'v2',
        description: 'Open source version 2.x documentation',
      },
      {
        key: 'influxdb_cloud',
        version: 'cloud',
        description: 'Managed cloud service based on InfluxDB 2.x',
      },
    ],
  },
  {
    heading: 'InfluxDB 1',
    links: [
      {
        key: 'influxdb',
        version: 'v1',
        description: 'Open source version 1.x documentation',
      },
      {
        key: 'enterprise_influxdb',
        version: 'v1',
        description: 'Enterprise features for version 1.x',
      },
    ],
  },
  {
    heading: 'Tools and Integrations',
    links: [
      {
        key: 'telegraf',
        version: 'v1',
        description:
          'Plugin-driven server agent for collecting and sending metrics',
      },
      {
        key: 'chronograf',
        version: 'v1',
        description: 'User interface and administrative component',
      },
      {
        key: 'kapacitor',
        version: 'v1',
        description: 'Real-time streaming data processing engine',
      },
      {
        key: 'flux',
        version: 'v0',
        description: 'Functional data scripting language',
      },
    ],
  },
];

function corpusLookupKey({ key, version }) {
  return `${key}:${version || ''}`;
}

function buildCorpusLookup(corpora) {
  const lookup = new Map();
  const keyCounts = new Map();
  for (const corpus of corpora) {
    keyCounts.set(corpus.key, (keyCounts.get(corpus.key) || 0) + 1);
    lookup.set(corpusLookupKey(corpus), corpus);
  }
  for (const corpus of corpora) {
    if (keyCounts.get(corpus.key) === 1) {
      lookup.set(corpusLookupKey({ key: corpus.key }), corpus);
    }
  }
  return lookup;
}

function renderProductSections(corpora) {
  const corpusByKey = buildCorpusLookup(corpora);
  const sections = [];

  for (const section of PRODUCT_SECTIONS) {
    const lines = section.links
      .map((link) => {
        const corpus = corpusByKey.get(corpusLookupKey(link));
        if (!corpus) return null;
        const target =
          link.target === 'page'
            ? `${corpus.path}/index.md`
            : `${corpus.path}/index.section.md`;
        return `- [${corpus.name}](${target}): ${link.description}`;
      })
      .filter(Boolean);

    if (lines.length === 0) continue;
    sections.push([`## ${section.heading}`, '', ...lines].join('\n'));
  }

  return sections.join('\n\n');
}

export function renderLlmsTxt({ org, corpora = loadCorpusPaths() }) {
  const corpusLines = corpora.map(
    (corpus) => `- [${corpus.name} full corpus](${corpus.path}/llms-full.txt)`
  );
  const productSections = renderProductSections(corpora);

  return [
    '# InfluxData Documentation',
    '',
    '> Documentation for InfluxDB time series database and related tools including Telegraf, Chronograf, and Kapacitor.',
    '',
    `> Publisher: ${org.name} (${org.url}). Authoritative source for InfluxData product documentation.`,
    '',
    'This documentation covers all InfluxDB versions and ecosystem tools. Each section provides comprehensive guides, API references, and tutorials.',
    '',
    '## Choosing InfluxDB',
    '',
    '- [Which InfluxDB 3 should I use?](influxdb3/which-influxdb-3/index.md): Decision guide for choosing between InfluxDB 3 Core, Enterprise, Cloud Serverless, Cloud Dedicated, Clustered, and Explorer, and for migrating from InfluxDB 1 or InfluxDB 2.',
    '',
    productSections,
    productSections ? '' : null,
    '## API References',
    '',
    "For API documentation, see the API reference section within each product's documentation.",
    '',
    '## Full corpora (flattened Markdown)',
    '',
    'Per-product Markdown corpora. Fetch a single file for the full documentation of one product.',
    '',
    ...corpusLines,
    '',
  ]
    .filter((line) => line !== null)
    .join('\n');
}

export async function buildLlmsTxt(publicRoot = parsePublicDir()) {
  const org = await loadOrgIdentity();
  const content = renderLlmsTxt({ org });
  const outPath = path.join(publicRoot, 'llms.txt');
  await fs.writeFile(outPath, content, 'utf-8');
  return { outPath, bytes: Buffer.byteLength(content, 'utf-8') };
}

async function main() {
  const publicRoot = parsePublicDir();
  const result = await buildLlmsTxt(publicRoot);
  console.log(`Built llms.txt (${result.bytes} bytes)`);
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
