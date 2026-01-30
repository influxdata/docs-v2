/**
 * API Documentation Auditor
 *
 * Main orchestrator for API documentation auditing
 * Coordinates API parsing, documentation scanning, and report generation
 *
 * @module api-auditor
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import { spawn } from 'child_process';
import { APIParser, detectEnterpriseEndpoints } from './api-parser.js';
import { APIRequestParser } from './api-request-parser.js';
import {
  APIDocScanner,
  compareEndpoints,
  compareParameters,
} from './api-doc-scanner.js';
import {
  generateAPIAuditReport,
  generateParameterAuditReport,
} from './api-audit-reporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Run API documentation audit
 */
export async function runAPIAudit(
  product,
  version,
  docsBranch = 'master',
  outputFormat = 'report'
) {
  console.log('\n🔍 API Documentation Audit');
  console.log('==========================================');
  console.log(`Product: ${product}`);
  console.log(`Version: ${version}`);
  console.log(`Docs branch: ${docsBranch}`);
  console.log('');

  // Setup paths
  const outputDir = join(
    dirname(__dirname),
    '..',
    'influxdb3-monolith',
    'output',
    'cli-audit'
  );
  await fs.mkdir(outputDir, { recursive: true });

  // Repository paths (use generic names, not private repo names)
  const coreRepoPath = join(outputDir, 'influxdb-clone');
  const enterpriseRepoPath = join(outputDir, 'enterprise-clone');

  // Clone or use existing repos
  await ensureRepository(
    'https://github.com/influxdata/influxdb.git',
    coreRepoPath,
    version,
    'Core'
  );

  if (product === 'enterprise' || product === 'both') {
    // Use environment variable for Enterprise repo URL (security: no hardcoded private repo)
    const enterpriseRepoUrl = process.env.INFLUXDB_ENTERPRISE_REPO_URL;

    if (!enterpriseRepoUrl) {
      throw new Error(
        'Enterprise repository URL not configured.\n' +
          'Set DOCS_ENTERPRISE_REPO_URL in your .env file.\n' +
          'See scripts/docs-cli/config/README.md for configuration details.'
      );
    }

    await ensureRepository(
      enterpriseRepoUrl,
      enterpriseRepoPath,
      version,
      'Enterprise'
    );
  }

  // Clone docs-v2 repository with sparse checkout
  const tempDocsRepo = join(tmpdir(), `docs-v2-api-audit-${Date.now()}`);
  await cloneDocsRepo(tempDocsRepo, docsBranch);

  try {
    // Run audit for Core if requested
    if (product === 'core' || product === 'both') {
      await auditProduct(
        'core',
        version,
        coreRepoPath,
        tempDocsRepo,
        outputDir
      );
    }

    // Run audit for Enterprise if requested
    if (product === 'enterprise' || product === 'both') {
      await auditProduct(
        'enterprise',
        version,
        enterpriseRepoPath,
        tempDocsRepo,
        outputDir
      );
    }

    console.log('\n✅ API documentation audit complete!');
  } finally {
    // Cleanup temp docs repo
    console.log('🧹 Cleaning up temporary docs repository...');
    await fs.rm(tempDocsRepo, { recursive: true, force: true });
    console.log('✅ Temporary docs repository cleaned up');
  }
}

/**
 * Audit a single product (core or enterprise)
 */
async function auditProduct(
  product,
  version,
  repoPath,
  docsRepoPath,
  outputDir
) {
  console.log(`\n📦 Auditing ${product} API documentation...`);

  // Step 1: Parse API endpoints from source code
  const parser = new APIParser(repoPath);
  const endpoints = await parser.discoverEndpoints();

  // Step 2: Parse API request/response types from source code
  const requestParser = new APIRequestParser(repoPath);
  const endpointParams = await requestParser.discoverRequestTypes();

  // Step 3: Scan documentation for existing API docs
  const scanner = new APIDocScanner(docsRepoPath, product);
  const documentedEndpoints = await scanner.scanDocumentation();

  // Step 4: Compare discovered endpoints with documented endpoints
  const comparison = compareEndpoints(endpoints, documentedEndpoints);

  // Step 5: Compare discovered parameters with documented parameters
  const paramComparison = compareParameters(
    requestParser.getAllEndpointsWithParams(),
    documentedEndpoints
  );

  // Step 6: Generate audit reports
  await generateAPIAuditReport(comparison, product, version, outputDir);

  // Step 7: Generate parameter audit report if there are missing params
  if (paramComparison.summary.totalMissingParams > 0) {
    await generateParameterAuditReport(
      paramComparison,
      product,
      version,
      outputDir
    );
  }
}

/**
 * Ensure repository exists and is checked out to the correct version
 */
async function ensureRepository(repoUrl, repoPath, version, name) {
  const exists = await fs
    .access(repoPath)
    .then(() => true)
    .catch(() => false);

  if (exists) {
    console.log(`📁 Using existing ${name} repository clone`);
    console.log(`🔄 Checking out version: ${version}`);
    console.log(`  🔄 Fetching tags and refs...`);

    // Fetch latest tags and refs
    await runCommand('git', ['fetch', '--tags', '--force'], repoPath);

    // Checkout the specified version
    await runCommand('git', ['checkout', version], repoPath);
  } else {
    console.log(`📥 Cloning ${name} repository...`);
    await runCommand('git', [
      'clone',
      '--depth',
      '1',
      '--branch',
      version,
      repoUrl,
      repoPath,
    ]);
  }
}

/**
 * Clone docs-v2 repository with sparse checkout
 */
async function cloneDocsRepo(tempPath, branch) {
  console.log(
    `📥 Cloning docs-v2 repository (branch: ${branch}) with sparse-checkout...`
  );

  // Step 1: Clone with no-checkout
  console.log('  🔄 Initializing repository...');
  await runCommand('git', [
    'clone',
    '--no-checkout',
    '--depth',
    '1',
    '--branch',
    branch,
    'https://github.com/influxdata/docs-v2.git',
    tempPath,
  ]);

  // Step 2: Configure sparse-checkout
  console.log('  🔄 Configuring sparse-checkout...');
  await runCommand('git', ['sparse-checkout', 'init', '--cone'], tempPath);

  // Step 3: Set sparse-checkout patterns
  const patterns = ['api-docs/influxdb3'];
  await runCommand('git', ['sparse-checkout', 'set', ...patterns], tempPath);

  // Step 4: Checkout the files
  console.log('  🔄 Checking out sparse directories...');
  await runCommand('git', ['checkout', branch], tempPath);

  console.log('✅ docs-v2 repository cloned successfully with sparse-checkout');
  console.log(`  📁 Cloned directories: ${patterns.join(', ')}`);
}

/**
 * Run a shell command and return the result
 */
function runCommand(command, args, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    if (proc.stdout) {
      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });
    }

    if (proc.stderr) {
      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ code, stdout, stderr });
      } else {
        reject(
          new Error(`Command failed with code ${code}: ${stderr || stdout}`)
        );
      }
    });

    proc.on('error', (error) => {
      reject(error);
    });
  });
}
