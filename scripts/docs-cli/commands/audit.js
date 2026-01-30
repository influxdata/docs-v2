#!/usr/bin/env node

/**
 * Documentation audit command
 *
 * SECURITY: This file must NOT contain references to private repository names or URLs
 * All sensitive configuration is user-provided via environment variables
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import {
  checkGitHubAuth,
  getConfig,
  hasEnterpriseAccess,
  getRepoPathOrClone,
  cloneOrUpdateRepo,
} from '../lib/config-loader.js';
import {
  resolveProducts,
  validateMutualExclusion,
  getProductInfo,
} from '../lib/product-resolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Map product keys to audit product types
const PRODUCT_KEY_TO_AUDIT_TYPE = {
  influxdb3_core: 'core',
  influxdb3_enterprise: 'enterprise',
  telegraf: 'telegraf',
};

function printUsage() {
  console.log(`
Documentation Coverage Audit

Usage: docs audit [options]

Options:
  --products <keys>      Product keys or content paths (comma-separated)
                         Examples: influxdb3_core, /influxdb3/core
  --repos <paths>        Direct repo paths or URLs (alternative to --products)
  --version <v>          Version/branch/tag to audit (default: main)
  --categories <list>    Comma-separated categories to audit
  --branch <name>        docs-v2 branch to compare against (default: master)
  --output-format <fmt>  Output format: report | drafts | json (default: report)
  --help, -h             Show this help message

Note: --products and --repos are mutually exclusive.

Product Keys (or use content paths like /influxdb3/core):
  influxdb3_core         InfluxDB 3 Core
  influxdb3_enterprise   InfluxDB 3 Enterprise
  telegraf               Telegraf

Available Categories:
  CLI_REFERENCE          CLI command documentation
  API_REFERENCE          HTTP API endpoint documentation
  GETTING_STARTED        Getting started guides
  ADMIN_GUIDES           Administration documentation
  WRITE_DATA             Write data guides
  QUERY_DATA             Query data guides
  PROCESS_DATA           Process data guides
  GENERAL_REFERENCE      General reference documentation

Examples:
  # Audit using product keys (version defaults to main)
  docs audit --products influxdb3_core

  # Audit using content paths
  docs audit --products /influxdb3/core,/influxdb3/enterprise

  # Audit specific version
  docs audit --products influxdb3_core --version v3.3.0

  # Audit using direct repo path
  docs audit --repos ~/github/influxdata/influxdb

  # Audit using repo URL (will clone automatically)
  docs audit --repos https://github.com/influxdata/telegraf

  # Audit with specific categories
  docs audit --products influxdb3_core --categories CLI_REFERENCE

Configuration:
  Requires GitHub CLI authentication: gh auth login

  For Enterprise audits:
  1. Ensure you have access to Enterprise repositories on GitHub
  2. Configure in ~/.influxdata-docs/docs-cli.yml:
     repositories:
       influxdb3_enterprise:
         path: ~/github/influxdata/<enterprise-repo>

  See scripts/docs-cli/config/README.md for full configuration options
`);
}

function validatePrerequisites(product) {
  const auth = checkGitHubAuth();
  if (!auth.authenticated) {
    console.error('Error: GitHub CLI not authenticated');
    console.error('');
    console.error('Run: gh auth login');
    console.error('');
    process.exit(1);
  }

  if (
    (product === 'enterprise' || product === 'both') &&
    !hasEnterpriseAccess()
  ) {
    console.error('Warning: Enterprise audit requires configuration');
    console.error('');
    console.error('To audit Enterprise products:');
    console.error(
      '1. Ensure you have GitHub access to Enterprise repositories'
    );
    console.error('2. Add to .env file:');
    console.error('   DOCS_ENTERPRISE_ACCESS=true');
    console.error('   DOCS_ENTERPRISE_REPO_URL=<enterprise-repo-url>');
    console.error('');
    console.error('See config/README.md for details');
    console.error('');
    process.exit(1);
  }

  console.log('✓ GitHub CLI authenticated');
  if (product === 'enterprise' || product === 'both') {
    console.log('✓ Enterprise access configured');
  }
  console.log('');
}

function getRepoURL(envKey, publicDefault) {
  return getConfig(envKey, { defaultValue: publicDefault });
}

export default async function audit(args) {
  const positionals = args.args || [];

  if (positionals.includes('--help') || positionals.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  // Parse arguments
  let productsInput = null;
  let reposInput = null;
  let version = 'main'; // Default to main
  let categoryFilter = null;
  let docsBranch = 'master';
  let outputFormat = 'report';

  for (let i = 0; i < positionals.length; i++) {
    const arg = positionals[i];

    if (arg === '--products' || arg === '--product') {
      if (i + 1 < positionals.length && !positionals[i + 1].startsWith('--')) {
        productsInput = positionals[i + 1];
        i++;
      } else {
        console.error('Error: --products requires product keys or paths');
        process.exit(1);
      }
    } else if (arg.startsWith('--products=')) {
      productsInput = arg.split('=')[1];
    } else if (arg === '--repos' || arg === '--repo') {
      if (i + 1 < positionals.length && !positionals[i + 1].startsWith('--')) {
        reposInput = positionals[i + 1];
        i++;
      } else {
        console.error('Error: --repos requires paths or URLs');
        process.exit(1);
      }
    } else if (arg.startsWith('--repos=')) {
      reposInput = arg.split('=')[1];
    } else if (arg === '--version') {
      if (i + 1 < positionals.length && !positionals[i + 1].startsWith('--')) {
        version = positionals[i + 1];
        i++;
      } else {
        console.error('Error: --version requires a value');
        process.exit(1);
      }
    } else if (arg.startsWith('--version=')) {
      version = arg.split('=')[1];
    } else if (arg === '--categories') {
      if (i + 1 < positionals.length && !positionals[i + 1].startsWith('--')) {
        categoryFilter = positionals[i + 1]
          .split(',')
          .map((c) => c.trim().toUpperCase());
        i++;
      }
    } else if (arg.startsWith('--categories=')) {
      categoryFilter = arg
        .split('=')[1]
        .split(',')
        .map((c) => c.trim().toUpperCase());
    } else if (arg === '--branch') {
      if (i + 1 < positionals.length && !positionals[i + 1].startsWith('--')) {
        docsBranch = positionals[i + 1];
        i++;
      }
    } else if (arg.startsWith('--branch=')) {
      docsBranch = arg.split('=')[1];
    } else if (arg === '--output-format') {
      if (i + 1 < positionals.length && !positionals[i + 1].startsWith('--')) {
        outputFormat = positionals[i + 1];
        i++;
      }
    } else if (arg.startsWith('--output-format=')) {
      outputFormat = arg.split('=')[1];
    } else if (!arg.startsWith('--')) {
      // Positional arguments are no longer supported
      console.error(`Error: Unexpected positional argument '${arg}'`);
      console.error('');
      console.error('Positional arguments are no longer supported. Use flags:');
      console.error('  docs audit --products influxdb3_core --version v3.9');
      console.error('');
      console.error('Quick migration:');
      console.error('  core       → --products influxdb3_core');
      console.error('  enterprise → --products influxdb3_enterprise');
      console.error('  telegraf   → --products telegraf');
      console.error('');
      console.error("Run 'docs audit --help' for usage information.");
      process.exit(1);
    }
  }

  // Validate mutual exclusion
  validateMutualExclusion({ products: productsInput, repos: reposInput });

  // Validate output format
  if (!['report', 'drafts', 'json'].includes(outputFormat)) {
    console.error(`Error: Invalid output format '${outputFormat}'`);
    console.error('Must be one of: report, drafts, json');
    process.exit(1);
  }

  // Validate we have products or repos to audit
  if (!productsInput && !reposInput) {
    console.error('Error: No products or repositories specified');
    console.error('');
    console.error('Options:');
    console.error('  --products <keys>  Product keys or content paths');
    console.error(
      '                     Examples: influxdb3_core, /influxdb3/core'
    );
    console.error('  --repos <paths>    Direct repository paths or URLs');
    console.error('');
    console.error('Available products:');
    for (const [key, auditType] of Object.entries(PRODUCT_KEY_TO_AUDIT_TYPE)) {
      const info = getProductInfo(key);
      const path = info?.contentPath ? ` (/${info.contentPath}/)` : '';
      console.error(`  ${key}${path}`);
    }
    console.error('');
    console.error("Run 'docs audit --help' for full usage information.");
    process.exit(1);
  }

  // Resolve product keys
  let productKeys = [];
  let repoPaths = [];

  if (productsInput) {
    try {
      const resolved = resolveProducts(productsInput);
      productKeys = resolved.map((r) => r.key);

      // Filter to only auditable products
      const auditableKeys = productKeys.filter(
        (key) => PRODUCT_KEY_TO_AUDIT_TYPE[key]
      );
      const nonAuditableKeys = productKeys.filter(
        (key) => !PRODUCT_KEY_TO_AUDIT_TYPE[key]
      );

      if (nonAuditableKeys.length > 0) {
        console.warn(
          `Warning: Skipping non-auditable products: ${nonAuditableKeys.join(', ')}`
        );
        console.warn(
          'Auditing is only supported for: influxdb3_core, influxdb3_enterprise, telegraf'
        );
        console.warn('');
      }

      if (auditableKeys.length === 0) {
        console.error('Error: No auditable products specified');
        console.error(
          'Auditing is only supported for: influxdb3_core, influxdb3_enterprise, telegraf'
        );
        process.exit(1);
      }

      productKeys = auditableKeys;
      console.log(`✓ Resolved products: ${productKeys.join(', ')}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

  if (reposInput) {
    repoPaths = reposInput.split(',').map((p) => p.trim());
  }

  console.log(`✓ Version: ${version}`);
  console.log(`✓ Docs branch: ${docsBranch}`);
  console.log('');

  // Convert product keys to audit product types
  const auditProducts = [
    ...new Set(productKeys.map((k) => PRODUCT_KEY_TO_AUDIT_TYPE[k])),
  ];

  // Check if auditing both core and enterprise
  let hasCore = auditProducts.includes('core');
  let hasEnterprise = auditProducts.includes('enterprise');
  let hasTelegraf = auditProducts.includes('telegraf');

  // Validate prerequisites for products (skip for direct repos)
  if (productKeys.length > 0) {
    for (const product of auditProducts) {
      validatePrerequisites(product);
    }
  }

  // Set repository URLs/paths from --products
  for (const productKey of productKeys) {
    const repoPath = await getRepoPathOrClone(productKey, {
      allowClone: true,
      fetch: true,
    });

    if (productKey === 'influxdb3_core') {
      process.env.INFLUXDB_REPO_URL =
        repoPath ||
        getRepoURL(
          'DOCS_CORE_REPO_URL',
          'https://github.com/influxdata/influxdb.git'
        );
    } else if (productKey === 'influxdb3_enterprise') {
      process.env.INFLUXDB_ENTERPRISE_REPO_URL =
        repoPath || getRepoURL('DOCS_ENTERPRISE_REPO_URL', '');
    } else if (productKey === 'telegraf') {
      process.env.TELEGRAF_REPO_URL =
        repoPath ||
        getRepoURL(
          'DOCS_TELEGRAF_REPO_URL',
          'https://github.com/influxdata/telegraf.git'
        );
    }
  }

  // Handle --repos: direct paths or URLs
  if (repoPaths.length > 0) {
    for (const pathOrUrl of repoPaths) {
      let repoPath = pathOrUrl;
      const repoName = pathOrUrl
        .split('/')
        .pop()
        .replace(/\.git$/, '');

      // Check if it's a URL (needs cloning)
      if (
        pathOrUrl.startsWith('http://') ||
        pathOrUrl.startsWith('https://') ||
        pathOrUrl.startsWith('git@')
      ) {
        repoPath = await cloneOrUpdateRepo(pathOrUrl, repoName, {
          fetch: true,
        });
      } else if (!existsSync(pathOrUrl)) {
        console.error(`Error: Repository path not found: ${pathOrUrl}`);
        process.exit(1);
      }

      // Detect repo type from path/name and set appropriate env var
      const lowerName = repoName.toLowerCase();
      if (lowerName.includes('telegraf')) {
        process.env.TELEGRAF_REPO_URL = repoPath;
        hasTelegraf = true;
      } else if (
        lowerName.includes('enterprise') ||
        lowerName.includes('pro')
      ) {
        process.env.INFLUXDB_ENTERPRISE_REPO_URL = repoPath;
        hasEnterprise = true;
      } else {
        // Default to core/influxdb
        process.env.INFLUXDB_REPO_URL = repoPath;
        hasCore = true;
      }
    }
  }

  process.env.DOCS_V2_REPO_URL = getRepoURL(
    'DOCS_REPO_URL',
    'https://github.com/influxdata/docs-v2.git'
  );

  // Determine which audits to run
  const runCLIAudit =
    (hasCore || hasEnterprise) &&
    (!categoryFilter ||
      categoryFilter.includes('CLI_REFERENCE') ||
      categoryFilter.some((c) => c !== 'API_REFERENCE'));
  const runAPIAudit =
    (hasCore || hasEnterprise) &&
    (!categoryFilter || categoryFilter.includes('API_REFERENCE'));

  try {
    // Run Telegraf audit if requested
    if (hasTelegraf) {
      console.log('📋 Running Telegraf audit...\n');
      const { runTelegrafAudit } = await import('../lib/telegraf-auditor.js');
      await runTelegrafAudit(version, docsBranch, outputFormat);
    }

    // Run InfluxDB audits
    if (hasCore || hasEnterprise) {
      // Determine audit product type
      const influxProduct =
        hasCore && hasEnterprise
          ? 'both'
          : hasEnterprise
            ? 'enterprise'
            : 'core';

      if (runCLIAudit) {
        console.log(`📋 Running CLI audit for ${influxProduct}...\n`);
        const auditorPath = join(
          __dirname,
          '../../influxdb3-monolith/cli-docs-audit/documentation-audit.js'
        );
        const { CLIDocumentationAuditor } = await import(auditorPath);
        const cliAuditor = new CLIDocumentationAuditor(
          influxProduct,
          version,
          categoryFilter,
          docsBranch
        );
        cliAuditor.outputFormat = outputFormat;
        await cliAuditor.run();
      }

      if (runAPIAudit) {
        console.log(`📋 Running API audit for ${influxProduct}...\n`);
        const { runAPIAudit: runAPIAuditFn } = await import(
          '../lib/api-auditor.js'
        );
        await runAPIAuditFn(influxProduct, version, docsBranch, outputFormat);
      }
    }

    console.log('\n✅ Documentation audit complete!');
  } catch (error) {
    console.error('\n❌ Audit failed:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
