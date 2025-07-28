/**
 * Matrix Generator for Link Validation Workflows
 * Replaces complex bash scripting with maintainable JavaScript
 * Includes cache-aware optimization to skip validation of unchanged files
 */

import { spawn } from 'child_process';
import process from 'process';
import { fileURLToPath } from 'url'; // Used for main execution check at bottom of file

// Product configuration mapping file paths to products
const PRODUCT_MAPPING = {
  'content/influxdb3/core': {
    key: 'influxdb3-core',
    name: 'InfluxDB 3 Core',
  },
  'content/influxdb3/enterprise': {
    key: 'influxdb3-enterprise',
    name: 'InfluxDB 3 Enterprise',
  },
  'content/influxdb3/cloud-dedicated': {
    key: 'influxdb3-cloud-dedicated',
    name: 'InfluxDB 3 Cloud Dedicated',
  },
  'content/influxdb3/cloud-serverless': {
    key: 'influxdb3-cloud-serverless',
    name: 'InfluxDB 3 Cloud Serverless',
  },
  'content/influxdb3/clustered': {
    key: 'influxdb3-clustered',
    name: 'InfluxDB 3 Clustered',
  },
  'content/influxdb3/explorer': {
    key: 'influxdb3-explorer',
    name: 'InfluxDB 3 Explorer',
  },
  'content/influxdb/v2': {
    key: 'influxdb-v2',
    name: 'InfluxDB v2',
  },
  'content/influxdb/cloud': {
    key: 'influxdb-cloud',
    name: 'InfluxDB Cloud',
  },
  'content/influxdb/v1': {
    key: 'influxdb-v1',
    name: 'InfluxDB v1',
  },
  'content/influxdb/enterprise_influxdb': {
    key: 'influxdb-enterprise-v1',
    name: 'InfluxDB Enterprise v1',
  },
  'content/telegraf': {
    key: 'telegraf',
    name: 'Telegraf',
  },
  'content/kapacitor': {
    key: 'kapacitor',
    name: 'Kapacitor',
  },
  'content/chronograf': {
    key: 'chronograf',
    name: 'Chronograf',
  },
  'content/flux': {
    key: 'flux',
    name: 'Flux',
  },
  'content/shared': {
    key: 'shared',
    name: 'Shared Content',
  },
  'api-docs': {
    key: 'api-docs',
    name: 'API Documentation',
  },
};

/**
 * Group files by product based on their path
 * @param {string[]} files - Array of file paths
 * @returns {Object} - Object with product keys and arrays of files
 */
function groupFilesByProduct(files) {
  const productFiles = {};

  // Initialize all products
  Object.values(PRODUCT_MAPPING).forEach((product) => {
    productFiles[product.key] = [];
  });

  files.forEach((file) => {
    let matched = false;

    // Check each product mapping
    for (const [pathPrefix, product] of Object.entries(PRODUCT_MAPPING)) {
      if (file.startsWith(pathPrefix + '/')) {
        productFiles[product.key].push(file);
        matched = true;
        break;
      }
    }

    // Handle edge case for api-docs (no trailing slash)
    if (!matched && file.startsWith('api-docs/')) {
      productFiles['api-docs'].push(file);
    }
  });

  return productFiles;
}

/**
 * Run incremental validation analysis
 * @param {string[]} files - Array of file paths to analyze
 * @returns {Promise<Object>} - Incremental validation results
 */
async function runIncrementalAnalysis(files) {
  return new Promise((resolve) => {
    const child = spawn(
      'node',
      ['.github/scripts/incremental-validator.js', ...files],
      {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: process.env,
      }
    );

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        try {
          // Parse the JSON output from the validation script
          const lines = stdout.trim().split('\n');
          const jsonLine = lines.find((line) => line.startsWith('{'));

          if (jsonLine) {
            const results = JSON.parse(jsonLine);
            resolve(results);
          } else {
            resolve({ filesToValidate: files.map((f) => ({ filePath: f })) });
          }
        } catch (error) {
          console.warn(
            `Warning: Could not parse incremental validation results: ${error.message}`
          );
          resolve({ filesToValidate: files.map((f) => ({ filePath: f })) });
        }
      } else {
        console.warn(
          `Incremental validation failed with code ${code}: ${stderr}`
        );
        resolve({ filesToValidate: files.map((f) => ({ filePath: f })) });
      }
    });

    child.on('error', (error) => {
      console.warn(`Incremental validation error: ${error.message}`);
      resolve({ filesToValidate: files.map((f) => ({ filePath: f })) });
    });
  });
}

/**
 * Generate matrix configuration for GitHub Actions with cache awareness
 * @param {string[]} changedFiles - Array of changed file paths
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Matrix configuration object
 */
async function generateMatrix(changedFiles, options = {}) {
  const {
    maxConcurrentJobs = 5,
    forceSequential = false,
    minFilesForParallel = 10,
    useCache = true,
  } = options;

  if (!changedFiles || changedFiles.length === 0) {
    return {
      strategy: 'none',
      hasChanges: false,
      matrix: { include: [] },
      cacheStats: { hitRate: 100, cacheHits: 0, cacheMisses: 0 },
    };
  }

  let filesToValidate = changedFiles;
  let cacheStats = {
    hitRate: 0,
    cacheHits: 0,
    cacheMisses: changedFiles.length,
  };

  // Run incremental analysis if cache is enabled
  if (useCache) {
    try {
      console.log(
        `🔍 Running cache analysis for ${changedFiles.length} files...`
      );
      const analysisResults = await runIncrementalAnalysis(changedFiles);

      if (analysisResults.filesToValidate) {
        filesToValidate = analysisResults.filesToValidate.map(
          (f) => f.filePath
        );
        cacheStats = analysisResults.cacheStats || cacheStats;

        console.log(
          `📊 Cache analysis complete: ${cacheStats.hitRate}% hit rate`
        );
        console.log(
          `✅ ${cacheStats.cacheHits} files cached, ${cacheStats.cacheMisses} need validation`
        );
      }
    } catch (error) {
      console.warn(
        `Cache analysis failed: ${error.message}, proceeding without cache optimization`
      );
    }
  }

  // If no files need validation after cache analysis
  if (filesToValidate.length === 0) {
    return {
      strategy: 'cache-hit',
      hasChanges: false,
      matrix: { include: [] },
      cacheStats,
      message: '✨ All files are cached - no validation needed!',
    };
  }

  const productFiles = groupFilesByProduct(filesToValidate);
  const productsWithFiles = Object.entries(productFiles).filter(
    ([key, files]) => files.length > 0
  );

  // Determine strategy based on file count and configuration
  const totalFiles = filesToValidate.length;
  const shouldUseParallel =
    !forceSequential &&
    totalFiles >= minFilesForParallel &&
    productsWithFiles.length > 1;

  if (shouldUseParallel) {
    // Parallel strategy: create matrix with products
    const matrixIncludes = productsWithFiles.map(([productKey, files]) => {
      const product = Object.values(PRODUCT_MAPPING).find(
        (p) => p.key === productKey
      );
      return {
        product: productKey,
        name: product?.name || productKey,
        files: files.join(' '),
        cacheEnabled: useCache,
      };
    });

    return {
      strategy: 'parallel',
      hasChanges: true,
      matrix: { include: matrixIncludes.slice(0, maxConcurrentJobs) },
      cacheStats,
      originalFileCount: changedFiles.length,
      validationFileCount: filesToValidate.length,
    };
  } else {
    // Sequential strategy: single job with all files
    return {
      strategy: 'sequential',
      hasChanges: true,
      matrix: {
        include: [
          {
            product: 'all',
            name: 'All Files',
            files: filesToValidate.join(' '),
            cacheEnabled: useCache,
          },
        ],
      },
      cacheStats,
      originalFileCount: changedFiles.length,
      validationFileCount: filesToValidate.length,
    };
  }
}

/**
 * CLI interface for the matrix generator
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node matrix-generator.js [options] <file1> <file2> ...

Options:
  --max-concurrent <n>     Maximum concurrent jobs (default: 5)
  --force-sequential       Force sequential execution
  --min-files-parallel <n> Minimum files needed for parallel (default: 10)
  --output-format <format> Output format: json, github (default: github)
  --no-cache               Disable cache-aware optimization
  --help, -h               Show this help message

Examples:
  node matrix-generator.js content/influxdb3/core/file1.md content/influxdb/v2/file2.md
  node matrix-generator.js --force-sequential content/shared/file.md
  node matrix-generator.js --no-cache --output-format json *.md
`);
    process.exit(0);
  }

  // Parse options
  const options = {};
  const files = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--max-concurrent' && i + 1 < args.length) {
      options.maxConcurrentJobs = parseInt(args[++i]);
    } else if (arg === '--force-sequential') {
      options.forceSequential = true;
    } else if (arg === '--min-files-parallel' && i + 1 < args.length) {
      options.minFilesForParallel = parseInt(args[++i]);
    } else if (arg === '--output-format' && i + 1 < args.length) {
      options.outputFormat = args[++i];
    } else if (arg === '--no-cache') {
      options.useCache = false;
    } else if (!arg.startsWith('--')) {
      files.push(arg);
    }
  }

  try {
    const result = await generateMatrix(files, options);

    if (options.outputFormat === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      // GitHub Actions format
      console.log(`strategy=${result.strategy}`);
      console.log(`has-changes=${result.hasChanges}`);
      console.log(`matrix=${JSON.stringify(result.matrix)}`);

      // Add cache statistics
      if (result.cacheStats) {
        console.log(`cache-hit-rate=${result.cacheStats.hitRate}`);
        console.log(`cache-hits=${result.cacheStats.cacheHits}`);
        console.log(`cache-misses=${result.cacheStats.cacheMisses}`);
      }

      if (result.originalFileCount !== undefined) {
        console.log(`original-file-count=${result.originalFileCount}`);
        console.log(`validation-file-count=${result.validationFileCount}`);
      }

      if (result.message) {
        console.log(`message=${result.message}`);
      }
    }
  } catch (error) {
    console.error(`Error generating matrix: ${error.message}`);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(console.error);
}

export { generateMatrix, groupFilesByProduct, PRODUCT_MAPPING };
