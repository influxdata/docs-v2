/**
 * Telegraf Plugin Documentation Auditor
 *
 * Compares Telegraf repository plugins with docs-v2 documentation to identify:
 * - Plugins with README.md that are missing from docs-v2
 * - Documentation in docs-v2 that no longer has a source in Telegraf
 *
 * @module telegraf-auditor
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Plugin category configuration
 * Maps Telegraf source paths to docs-v2 paths
 */
const PLUGIN_CATEGORIES = {
  inputs: {
    sourcePath: 'plugins/inputs',
    docsPath: 'content/telegraf/v1/input-plugins',
    displayName: 'Input Plugins',
    singular: 'input plugin',
  },
  outputs: {
    sourcePath: 'plugins/outputs',
    docsPath: 'content/telegraf/v1/output-plugins',
    displayName: 'Output Plugins',
    singular: 'output plugin',
  },
  processors: {
    sourcePath: 'plugins/processors',
    docsPath: 'content/telegraf/v1/processor-plugins',
    displayName: 'Processor Plugins',
    singular: 'processor plugin',
  },
  aggregators: {
    sourcePath: 'plugins/aggregators',
    docsPath: 'content/telegraf/v1/aggregator-plugins',
    displayName: 'Aggregator Plugins',
    singular: 'aggregator plugin',
  },
};

/**
 * Data format category configuration
 * Parsers and serializers have different structure
 */
const DATA_FORMAT_CATEGORIES = {
  parsers: {
    sourcePath: 'plugins/parsers',
    docsPath: 'content/telegraf/v1/data_formats/input',
    displayName: 'Input Data Formats (Parsers)',
    singular: 'parser',
    // Data formats use .md files directly, not directories
    isFlat: true,
  },
  serializers: {
    sourcePath: 'plugins/serializers',
    docsPath: 'content/telegraf/v1/data_formats/output',
    displayName: 'Output Data Formats (Serializers)',
    singular: 'serializer',
    isFlat: true,
  },
};

/**
 * Directories to exclude from scanning (not actual plugins)
 */
const EXCLUDED_DIRS = new Set([
  'all',           // Meta-package that imports all plugins
  'common',        // Shared utilities
]);

/**
 * Normalize plugin/format ID for consistent comparison
 * Converts kebab-case to snake_case to handle naming variations
 * @param {string} id - The plugin or format ID
 * @returns {string} Normalized ID
 */
function normalizeId(id) {
  return id.replace(/-/g, '_');
}

/**
 * Main Telegraf Plugin Auditor class
 */
export class TelegrafAuditor {
  constructor(version = 'master', docsBranch = 'master') {
    this.version = version;
    this.docsBranch = docsBranch;
    this.outputDir = join(dirname(__dirname), '..', 'output', 'telegraf-audit');
    this.telegrafRepoPath = null;
    this.docsRepoPath = null;
  }

  /**
   * Run the full audit
   */
  async run() {
    console.log('\n🔍 Telegraf Plugin Documentation Audit');
    console.log('==========================================');
    console.log(`Telegraf version: ${this.version}`);
    console.log(`Docs branch: ${this.docsBranch}`);
    console.log('');

    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });

    // Setup repository paths
    this.telegrafRepoPath = join(this.outputDir, 'telegraf-clone');
    this.docsRepoPath = join(tmpdir(), `docs-v2-telegraf-audit-${Date.now()}`);

    try {
      // Clone/checkout repositories
      await this.ensureTelegrafRepo();
      await this.cloneDocsRepo();

      // Scan both repositories
      const sourcePlugins = await this.scanTelegrafPlugins();
      const documentedPlugins = await this.scanDocsPlugins();

      // Compare and generate report
      const comparison = this.comparePlugins(sourcePlugins, documentedPlugins);
      await this.generateReport(comparison);

      console.log('\n✅ Telegraf plugin documentation audit complete!');
      console.log(`📄 Report saved to: ${join(this.outputDir, 'telegraf-audit-report.md')}`);

      return comparison;
    } finally {
      // Cleanup temp docs repo
      console.log('🧹 Cleaning up temporary docs repository...');
      await fs.rm(this.docsRepoPath, { recursive: true, force: true });
      console.log('✅ Cleanup complete');
    }
  }

  /**
   * Ensure Telegraf repository is cloned and at correct version
   */
  async ensureTelegrafRepo() {
    const exists = await fs.access(this.telegrafRepoPath).then(() => true).catch(() => false);

    if (exists) {
      console.log('📁 Using existing Telegraf repository clone');
      console.log(`🔄 Fetching and checking out version: ${this.version}`);
      // Unshallow the repository first if it's a shallow clone, then fetch tags
      // This ensures tags are available even if the repo was initially cloned with --depth 1
      try {
        await this.runCommand('git', ['fetch', '--unshallow'], this.telegrafRepoPath);
      } catch {
        // Already unshallowed or not a shallow clone, ignore the error
      }
      await this.runCommand('git', ['fetch', '--tags', '--force'], this.telegrafRepoPath);
      await this.runCommand('git', ['checkout', this.version], this.telegrafRepoPath);
    } else {
      console.log('📥 Cloning Telegraf repository...');
      await this.runCommand('git', [
        'clone',
        '--depth', '1',
        '--branch', this.version,
        'https://github.com/influxdata/telegraf.git',
        this.telegrafRepoPath,
      ]);
    }
    console.log('✅ Telegraf repository ready');
  }

  /**
   * Clone docs-v2 repository with sparse checkout
   */
  async cloneDocsRepo() {
    console.log(`📥 Cloning docs-v2 repository (branch: ${this.docsBranch}) with sparse-checkout...`);

    // Clone with no-checkout
    await this.runCommand('git', [
      'clone',
      '--no-checkout',
      '--depth', '1',
      '--branch', this.docsBranch,
      'https://github.com/influxdata/docs-v2.git',
      this.docsRepoPath,
    ]);

    // Configure sparse-checkout
    await this.runCommand('git', ['sparse-checkout', 'init', '--cone'], this.docsRepoPath);

    // Set sparse-checkout patterns
    const patterns = [
      'content/telegraf/v1/input-plugins',
      'content/telegraf/v1/output-plugins',
      'content/telegraf/v1/processor-plugins',
      'content/telegraf/v1/aggregator-plugins',
      'content/telegraf/v1/data_formats',
    ];
    await this.runCommand('git', ['sparse-checkout', 'set', ...patterns], this.docsRepoPath);

    // Checkout the files
    await this.runCommand('git', ['checkout', this.docsBranch], this.docsRepoPath);

    console.log('✅ docs-v2 repository cloned successfully');
  }

  /**
   * Scan Telegraf repository for plugins with README.md files
   */
  async scanTelegrafPlugins() {
    console.log('\n📂 Scanning Telegraf repository for plugins...');

    const results = {
      plugins: {},
      dataFormats: {},
    };

    // Scan plugin categories
    for (const [category, config] of Object.entries(PLUGIN_CATEGORIES)) {
      const sourcePath = join(this.telegrafRepoPath, config.sourcePath);
      results.plugins[category] = await this.scanPluginDirectory(sourcePath, category);
      console.log(`  Found ${results.plugins[category].length} ${config.displayName.toLowerCase()}`);
    }

    // Scan data format categories
    for (const [category, config] of Object.entries(DATA_FORMAT_CATEGORIES)) {
      const sourcePath = join(this.telegrafRepoPath, config.sourcePath);
      results.dataFormats[category] = await this.scanPluginDirectory(sourcePath, category);
      console.log(`  Found ${results.dataFormats[category].length} ${config.displayName.toLowerCase()}`);
    }

    return results;
  }

  /**
   * Scan a plugin directory for plugins with README.md files
   */
  async scanPluginDirectory(dirPath, category) {
    const plugins = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (EXCLUDED_DIRS.has(entry.name)) continue;

        const pluginPath = join(dirPath, entry.name);
        const readmePath = join(pluginPath, 'README.md');

        // Check if README.md exists
        const hasReadme = await fs.access(readmePath).then(() => true).catch(() => false);

        if (hasReadme) {
          plugins.push({
            id: normalizeId(entry.name),
            originalName: entry.name,
            category,
            path: pluginPath,
            readmePath,
          });
        }
      }
    } catch (error) {
      console.warn(`  Warning: Could not scan ${dirPath}: ${error.message}`);
    }

    return plugins.sort((a, b) => a.id.localeCompare(b.id));
  }

  /**
   * Scan docs-v2 repository for Telegraf plugin documentation
   */
  async scanDocsPlugins() {
    console.log('\n📂 Scanning docs-v2 repository for Telegraf documentation...');

    const results = {
      plugins: {},
      dataFormats: {},
    };

    // Scan plugin categories (directories with _index.md)
    for (const [category, config] of Object.entries(PLUGIN_CATEGORIES)) {
      const docsPath = join(this.docsRepoPath, config.docsPath);
      results.plugins[category] = await this.scanDocsDirectory(docsPath, category, false);
      console.log(`  Found ${results.plugins[category].length} documented ${config.displayName.toLowerCase()}`);
    }

    // Scan data format categories (flat .md files)
    for (const [category, config] of Object.entries(DATA_FORMAT_CATEGORIES)) {
      const docsPath = join(this.docsRepoPath, config.docsPath);
      results.dataFormats[category] = await this.scanDocsDirectory(docsPath, category, true);
      console.log(`  Found ${results.dataFormats[category].length} documented ${config.displayName.toLowerCase()}`);
    }

    return results;
  }

  /**
   * Scan a docs directory for documentation files
   * @param {string} dirPath - Path to scan
   * @param {string} category - Category name
   * @param {boolean} isFlat - If true, look for .md files; if false, look for directories with _index.md
   */
  async scanDocsDirectory(dirPath, category, isFlat) {
    const docs = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        // Skip _index.md files (they're category indexes, not plugin docs)
        if (entry.name === '_index.md') continue;

        if (isFlat) {
          // For data formats: look for .md files
          if (entry.isFile() && entry.name.endsWith('.md')) {
            // Extract ID from filename (remove .md extension)
            // Normalize to handle both snake_case and kebab-case consistently
            const baseName = entry.name.replace('.md', '');
            docs.push({
              id: normalizeId(baseName),
              originalName: baseName,
              category,
              path: join(dirPath, entry.name),
            });
          }
        } else {
          // For plugins: look for directories
          if (entry.isDirectory()) {
            const indexPath = join(dirPath, entry.name, '_index.md');
            const hasIndex = await fs.access(indexPath).then(() => true).catch(() => false);

            if (hasIndex) {
              docs.push({
                id: normalizeId(entry.name),
                originalName: entry.name,
                category,
                path: join(dirPath, entry.name),
                indexPath,
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn(`  Warning: Could not scan ${dirPath}: ${error.message}`);
    }

    return docs.sort((a, b) => a.id.localeCompare(b.id));
  }

  /**
   * Compare source plugins with documented plugins
   */
  comparePlugins(source, docs) {
    const comparison = {
      plugins: {},
      dataFormats: {},
      summary: {
        totalSourcePlugins: 0,
        totalDocumentedPlugins: 0,
        totalMissingDocs: 0,
        totalOrphanedDocs: 0,
        totalSourceDataFormats: 0,
        totalDocumentedDataFormats: 0,
        totalMissingDataFormatDocs: 0,
        totalOrphanedDataFormatDocs: 0,
      },
    };

    // Compare plugin categories
    for (const category of Object.keys(PLUGIN_CATEGORIES)) {
      const sourceSet = new Set(source.plugins[category].map(p => p.id));
      const docsSet = new Set(docs.plugins[category].map(p => p.id));

      const missing = source.plugins[category].filter(p => !docsSet.has(p.id));
      const orphaned = docs.plugins[category].filter(p => !sourceSet.has(p.id));
      const documented = source.plugins[category].filter(p => docsSet.has(p.id));

      comparison.plugins[category] = {
        config: PLUGIN_CATEGORIES[category],
        source: source.plugins[category],
        docs: docs.plugins[category],
        missing,
        orphaned,
        documented,
      };

      comparison.summary.totalSourcePlugins += source.plugins[category].length;
      comparison.summary.totalDocumentedPlugins += documented.length;
      comparison.summary.totalMissingDocs += missing.length;
      comparison.summary.totalOrphanedDocs += orphaned.length;
    }

    // Compare data format categories
    for (const category of Object.keys(DATA_FORMAT_CATEGORIES)) {
      const sourceSet = new Set(source.dataFormats[category].map(p => p.id));
      const docsSet = new Set(docs.dataFormats[category].map(p => p.id));

      const missing = source.dataFormats[category].filter(p => !docsSet.has(p.id));
      const orphaned = docs.dataFormats[category].filter(p => !sourceSet.has(p.id));
      const documented = source.dataFormats[category].filter(p => docsSet.has(p.id));

      comparison.dataFormats[category] = {
        config: DATA_FORMAT_CATEGORIES[category],
        source: source.dataFormats[category],
        docs: docs.dataFormats[category],
        missing,
        orphaned,
        documented,
      };

      comparison.summary.totalSourceDataFormats += source.dataFormats[category].length;
      comparison.summary.totalDocumentedDataFormats += documented.length;
      comparison.summary.totalMissingDataFormatDocs += missing.length;
      comparison.summary.totalOrphanedDataFormatDocs += orphaned.length;
    }

    return comparison;
  }

  /**
   * Generate markdown audit report
   */
  async generateReport(comparison) {
    const { generateTelegrafAuditReport } = await import('./telegraf-audit-reporter.js');
    await generateTelegrafAuditReport(
      comparison,
      this.version,
      this.docsBranch,
      this.outputDir
    );
  }

  /**
   * Run a shell command
   */
  runCommand(command, args, cwd = process.cwd()) {
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
          reject(new Error(`Command failed with code ${code}: ${stderr || stdout}`));
        }
      });

      proc.on('error', (error) => {
        reject(error);
      });
    });
  }
}

/**
 * Run Telegraf plugin documentation audit
 * @param {string} version - Telegraf version/branch/tag
 * @param {string} docsBranch - docs-v2 branch
 * @param {string} outputFormat - Output format (currently only 'report' supported)
 */
export async function runTelegrafAudit(version = 'master', docsBranch = 'master', outputFormat = 'report') {
  const auditor = new TelegrafAuditor(version, docsBranch);
  return auditor.run();
}
