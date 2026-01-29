#!/usr/bin/env node

/**
 * Documentation audit command
 * 
 * SECURITY: This file must NOT contain references to private repository names or URLs
 * All sensitive configuration is user-provided via environment variables
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { checkGitHubAuth, getConfig, hasEnterpriseAccess } from '../lib/config-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function printUsage() {
  console.log(`
Documentation Coverage Audit

Usage: docs audit <product> <version> [options]

Arguments:
  <product>              Product to audit: core | enterprise | both | telegraf
  <version>              Version/branch/tag to audit (e.g., main, v3.3.0, master)

Options:
  --categories=<list>    Comma-separated categories
  --branch=<name>        docs-v2 branch to compare against (default: master)
  --output-format=<fmt>  Output format: report | drafts | json (default: report)
  --help, -h             Show this help message

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
  docs audit core main
  docs audit enterprise v3.3.0 --categories=CLI_REFERENCE
  docs audit both main --categories=API_REFERENCE --output-format=drafts
  docs audit telegraf master

Configuration:
  Requires GitHub CLI authentication: gh auth login

  For Enterprise audits:
  1. Ensure you have access to Enterprise repositories on GitHub
  2. Add to .env: DOCS_ENTERPRISE_ACCESS=true
  3. Set Enterprise repo URL: DOCS_ENTERPRISE_REPO_URL=<your-enterprise-repo-url>

  See config/README.md for full configuration options
`);
}

function validatePrerequisites(product) {
  const auth = checkGitHubAuth();
  if (!auth.authenticated) {
    console.error('❌ GitHub CLI not authenticated');
    console.error('');
    console.error('Run: gh auth login');
    console.error('');
    process.exit(1);
  }

  if ((product === 'enterprise' || product === 'both') && !hasEnterpriseAccess()) {
    console.error('⚠️  Enterprise audit requires configuration');
    console.error('');
    console.error('To audit Enterprise products:');
    console.error('1. Ensure you have GitHub access to Enterprise repositories');
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
  
  if (positionals.length === 0 || positionals.includes('--help') || positionals.includes('-h')) {
    printUsage();
    process.exit(positionals.length === 0 ? 1 : 0);
  }

  const product = positionals[0];
  if (!['core', 'enterprise', 'both', 'telegraf'].includes(product)) {
    console.error(`Error: Invalid product '${product}'`);
    console.error(`Must be one of: core, enterprise, both, telegraf`);
    process.exit(1);
  }

  validatePrerequisites(product);

  const version = positionals[1] || 'main';
  
  let categoryFilter = null;
  let docsBranch = 'master';
  let outputFormat = 'report';

  for (const arg of positionals.slice(2)) {
    if (arg.startsWith('--categories=')) {
      const categories = arg.split('=')[1].split(',');
      categoryFilter = categories.map(c => c.trim().toUpperCase());
    } else if (arg.startsWith('--branch=')) {
      docsBranch = arg.split('=')[1];
    } else if (arg.startsWith('--output-format=')) {
      outputFormat = arg.split('=')[1];
      if (!['report', 'drafts', 'json'].includes(outputFormat)) {
        console.error(`Error: Invalid output format '${outputFormat}'`);
        process.exit(1);
      }
    }
  }

  // Set repository URLs - use public defaults, allow override via config
  process.env.INFLUXDB_REPO_URL = getRepoURL('DOCS_CORE_REPO_URL', 'https://github.com/influxdata/influxdb.git');
  process.env.INFLUXDB_PRO_REPO_URL = getRepoURL('DOCS_ENTERPRISE_REPO_URL', '');
  process.env.TELEGRAF_REPO_URL = getRepoURL('DOCS_TELEGRAF_REPO_URL', 'https://github.com/influxdata/telegraf.git');
  process.env.DOCS_V2_REPO_URL = getRepoURL('DOCS_REPO_URL', 'https://github.com/influxdata/docs-v2.git');

  const isTelegrafAudit = product === 'telegraf';
  const runCLIAudit = !isTelegrafAudit && (!categoryFilter || categoryFilter.includes('CLI_REFERENCE') ||
                      categoryFilter.some(c => c !== 'API_REFERENCE'));
  const runAPIAudit = !isTelegrafAudit && (!categoryFilter || categoryFilter.includes('API_REFERENCE'));

  try {
    if (isTelegrafAudit) {
      const { runTelegrafAudit } = await import('../lib/telegraf-auditor.js');
      await runTelegrafAudit(version || 'master', docsBranch, outputFormat);
    } else {
      if (runCLIAudit) {
        const auditorPath = join(__dirname, '../../influxdb3-monolith/cli-docs-audit/documentation-audit.js');
        const { CLIDocumentationAuditor } = await import(auditorPath);
        const cliAuditor = new CLIDocumentationAuditor(product, version, categoryFilter, docsBranch);
        cliAuditor.outputFormat = outputFormat;
        await cliAuditor.run();
      }

      if (runAPIAudit) {
        const { runAPIAudit: runAPIAuditFn } = await import('../lib/api-auditor.js');
        await runAPIAuditFn(product, version, docsBranch, outputFormat);
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
