'use strict';
/**
 * OpenAPI to Hugo Data Converter
 *
 * Converts OpenAPI v3 specifications into Hugo-compatible data files.
 * Generates both YAML and JSON versions of spec fragments grouped by path.
 *
 * @module openapi-paths-to-hugo-data
 */
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateHugoData = generateHugoData;
const yaml = __importStar(require('js-yaml'));
const fs = __importStar(require('fs'));
const path = __importStar(require('path'));
/**
 * Read a YAML file and parse it
 *
 * @param filepath - Path to the YAML file
 * @param encoding - File encoding (default: 'utf8')
 * @returns Parsed YAML content
 */
function readFile(filepath, encoding = 'utf8') {
  const content = fs.readFileSync(filepath, encoding);
  return yaml.load(content);
}
/**
 * Write data to a YAML file
 *
 * @param data - Data to write
 * @param outputTo - Output file path
 */
function writeDataFile(data, outputTo) {
  fs.writeFileSync(outputTo, yaml.dump(data));
}
/**
 * Write data to a JSON file
 *
 * @param data - Data to write
 * @param outputTo - Output file path
 */
function writeJsonFile(data, outputTo) {
  fs.writeFileSync(outputTo, JSON.stringify(data, null, 2));
}
/**
 * OpenAPI utility functions
 */
const openapiUtils = {
  /**
   * Check if a path fragment is a placeholder (e.g., {id})
   *
   * @param str - Path fragment to check
   * @returns True if the fragment is a placeholder
   */
  isPlaceholderFragment(str) {
    const placeholderRegex = /^\{.*\}$/;
    return placeholderRegex.test(str);
  },
};
/**
 * Write OpenAPI specs grouped by path to separate files
 * Generates both YAML and JSON versions
 *
 * @param openapi - OpenAPI document
 * @param prefix - Filename prefix for output files
 * @param outPath - Output directory path
 */
function writePathOpenapis(openapi, prefix, outPath) {
  const pathGroups = {};
  // Group paths by their base path (first 3-4 segments, excluding placeholders)
  Object.keys(openapi.paths)
    .sort()
    .forEach((p) => {
      const delimiter = '/';
      let key = p.split(delimiter);
      // Check if this is an item path (ends with a placeholder)
      let isItemPath = openapiUtils.isPlaceholderFragment(key[key.length - 1]);
      if (isItemPath) {
        key = key.slice(0, -1);
      }
      // Take first 4 segments
      key = key.slice(0, 4);
      // Check if the last segment is still a placeholder
      isItemPath = openapiUtils.isPlaceholderFragment(key[key.length - 1]);
      if (isItemPath) {
        key = key.slice(0, -1);
      }
      const groupKey = key.join('/');
      pathGroups[groupKey] = pathGroups[groupKey] || {};
      pathGroups[groupKey][p] = openapi.paths[p];
    });
  // Write each path group to separate YAML and JSON files
  Object.keys(pathGroups).forEach((pg) => {
    // Deep copy openapi
    const doc = JSON.parse(JSON.stringify(openapi));
    doc.paths = pathGroups[pg];
    doc.info.title = `${pg}\n${doc.info.title}`;
    doc['x-pathGroup'] = pg;
    try {
      if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath, { recursive: true });
      }
      const baseFilename = `${prefix}${pg.replaceAll('/', '-').replace(/^-/, '')}`;
      const yamlPath = path.resolve(outPath, `${baseFilename}.yaml`);
      const jsonPath = path.resolve(outPath, `${baseFilename}.json`);
      // Write both YAML and JSON versions
      writeDataFile(doc, yamlPath);
      writeJsonFile(doc, jsonPath);
      console.log(`Generated: ${baseFilename}.yaml and ${baseFilename}.json`);
    } catch (err) {
      console.error(`Error writing path group ${pg}:`, err);
    }
  });
}
/**
 * Create article metadata for a path group
 *
 * @param openapi - OpenAPI document with x-pathGroup
 * @returns Article metadata object
 */
function createArticleDataForPathGroup(openapi) {
  const article = {
    path: '',
    fields: {
      name: openapi['x-pathGroup'] || '',
      describes: Object.keys(openapi.paths),
    },
  };
  /**
   * Convert path to snake case for article path
   *
   * @param p - Path to convert
   * @returns Snake-cased path
   */
  const snakifyPath = (p) => {
    if (!p) {
      return '';
    }
    return p.replace(/^\//, '').replaceAll('/', '-');
  };
  article.path = snakifyPath(openapi['x-pathGroup'] || '');
  article.fields.title = openapi.info?.title;
  article.fields.description = openapi.description;
  const pathGroupFrags = path.parse(openapi['x-pathGroup'] || '');
  article.fields.tags = [pathGroupFrags?.dir, pathGroupFrags?.name]
    .filter(Boolean)
    .map((t) => snakifyPath(t));
  return article;
}
/**
 * Write OpenAPI article metadata to Hugo data files
 * Generates articles.yml and articles.json
 *
 * @param sourcePath - Path to directory containing OpenAPI fragment files
 * @param targetPath - Output path for article data
 * @param opts - Options including file pattern filter
 */
function writeOpenapiArticleData(sourcePath, targetPath, opts) {
  /**
   * Check if path is a file
   */
  const isFile = (filePath) => {
    return fs.lstatSync(filePath).isFile();
  };
  /**
   * Check if filename matches pattern
   */
  const matchesPattern = (filePath) => {
    return opts.filePattern
      ? path.parse(filePath).name.startsWith(opts.filePattern)
      : true;
  };
  try {
    const articles = fs
      .readdirSync(sourcePath)
      .map((fileName) => path.join(sourcePath, fileName))
      .filter(matchesPattern)
      .filter(isFile)
      .filter(
        (filePath) => filePath.endsWith('.yaml') || filePath.endsWith('.yml')
      ) // Only process YAML files
      .map((filePath) => {
        const openapi = readFile(filePath);
        const article = createArticleDataForPathGroup(openapi);
        article.fields.source = filePath;
        // Hugo omits "/static" from the URI when serving files stored in "./static"
        article.fields.staticFilePath = filePath.replace(/^static\//, '/');
        return article;
      });
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }
    const articleCollection = { articles };
    // Write both YAML and JSON versions
    const yamlPath = path.resolve(targetPath, 'articles.yml');
    const jsonPath = path.resolve(targetPath, 'articles.json');
    writeDataFile(articleCollection, yamlPath);
    writeJsonFile(articleCollection, jsonPath);
    console.log(`Generated ${articles.length} articles in ${targetPath}`);
  } catch (e) {
    console.error('Error writing article data:', e);
  }
}
/**
 * Generate Hugo data files from an OpenAPI specification
 *
 * This function:
 * 1. Reads the OpenAPI spec file
 * 2. Groups paths by their base path
 * 3. Writes each group to separate YAML and JSON files
 * 4. Generates article metadata for Hugo
 *
 * @param options - Generation options
 */
function generateHugoData(options) {
  const filenamePrefix = `${path.parse(options.specFile).name}-`;
  const sourceFile = readFile(options.specFile, 'utf8');
  console.log(`\nGenerating OpenAPI path files in ${options.dataOutPath}....`);
  writePathOpenapis(sourceFile, filenamePrefix, options.dataOutPath);
  console.log(
    `\nGenerating OpenAPI article data in ${options.articleOutPath}...`
  );
  writeOpenapiArticleData(options.dataOutPath, options.articleOutPath, {
    filePattern: filenamePrefix,
  });
  console.log('\nGeneration complete!\n');
}
// CommonJS export for backward compatibility
module.exports = {
  generateHugoData,
};
//# sourceMappingURL=index.js.map
