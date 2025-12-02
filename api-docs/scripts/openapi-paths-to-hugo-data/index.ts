/**
 * OpenAPI to Hugo Data Converter
 *
 * Converts OpenAPI v3 specifications into Hugo-compatible data files.
 * Generates both YAML and JSON versions of spec fragments grouped by path.
 *
 * @module openapi-paths-to-hugo-data
 */

import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

/**
 * OpenAPI path item object
 */
interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  patch?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  trace?: Operation;
  parameters?: Parameter[];
  [key: string]: unknown;
}

/**
 * OpenAPI operation object
 */
interface Operation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses?: Record<string, Response>;
  [key: string]: unknown;
}

/**
 * OpenAPI parameter object
 */
interface Parameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  schema?: Schema;
  [key: string]: unknown;
}

/**
 * OpenAPI request body object
 */
interface RequestBody {
  description?: string;
  content?: Record<string, MediaType>;
  required?: boolean;
  [key: string]: unknown;
}

/**
 * OpenAPI response object
 */
interface Response {
  description: string;
  content?: Record<string, MediaType>;
  headers?: Record<string, Header>;
  [key: string]: unknown;
}

/**
 * OpenAPI media type object
 */
interface MediaType {
  schema?: Schema;
  example?: unknown;
  examples?: Record<string, Example>;
  [key: string]: unknown;
}

/**
 * OpenAPI schema object
 */
interface Schema {
  type?: string;
  format?: string;
  description?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  required?: string[];
  [key: string]: unknown;
}

/**
 * OpenAPI header object
 */
interface Header {
  description?: string;
  schema?: Schema;
  [key: string]: unknown;
}

/**
 * OpenAPI example object
 */
interface Example {
  summary?: string;
  description?: string;
  value?: unknown;
  [key: string]: unknown;
}

/**
 * OpenAPI document structure
 */
interface OpenAPIDocument {
  openapi: string;
  info: Info;
  paths: Record<string, PathItem>;
  components?: Components;
  servers?: Server[];
  tags?: Tag[];
  description?: string;
  'x-pathGroup'?: string;
  [key: string]: unknown;
}

/**
 * OpenAPI info object
 */
interface Info {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: Contact;
  license?: License;
  [key: string]: unknown;
}

/**
 * OpenAPI contact object
 */
interface Contact {
  name?: string;
  url?: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * OpenAPI license object
 */
interface License {
  name: string;
  url?: string;
  [key: string]: unknown;
}

/**
 * OpenAPI components object
 */
interface Components {
  schemas?: Record<string, Schema>;
  responses?: Record<string, Response>;
  parameters?: Record<string, Parameter>;
  requestBodies?: Record<string, RequestBody>;
  headers?: Record<string, Header>;
  securitySchemes?: Record<string, SecurityScheme>;
  [key: string]: unknown;
}

/**
 * OpenAPI security scheme object
 */
interface SecurityScheme {
  type: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * OpenAPI server object
 */
interface Server {
  url: string;
  description?: string;
  variables?: Record<string, ServerVariable>;
  [key: string]: unknown;
}

/**
 * OpenAPI server variable object
 */
interface ServerVariable {
  default: string;
  enum?: string[];
  description?: string;
  [key: string]: unknown;
}

/**
 * OpenAPI tag object
 */
interface Tag {
  name: string;
  description?: string;
  externalDocs?: ExternalDocs;
  [key: string]: unknown;
}

/**
 * OpenAPI external docs object
 */
interface ExternalDocs {
  url: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Article metadata for Hugo
 */
interface Article {
  path: string;
  fields: {
    name: string;
    describes: string[];
    title?: string;
    description?: string;
    tags?: string[];
    source?: string;
    staticFilePath?: string;
  };
}

/**
 * Article collection for Hugo data files
 */
interface ArticleCollection {
  articles: Article[];
}

/**
 * Options for generating Hugo data
 */
export interface GenerateHugoDataOptions {
  /** Path to the OpenAPI spec file */
  specFile: string;
  /** Output path for generated OpenAPI path fragments */
  dataOutPath: string;
  /** Output path for article metadata */
  articleOutPath: string;
}

/**
 * Options for writing OpenAPI article data
 */
interface WriteOpenapiArticleDataOptions {
  /** File pattern to match when filtering files */
  filePattern?: string;
}

/**
 * Read a YAML file and parse it
 *
 * @param filepath - Path to the YAML file
 * @param encoding - File encoding (default: 'utf8')
 * @returns Parsed YAML content
 */
function readFile(
  filepath: string,
  encoding: BufferEncoding = 'utf8'
): OpenAPIDocument {
  const content = fs.readFileSync(filepath, encoding);
  return yaml.load(content) as OpenAPIDocument;
}

/**
 * Write data to a YAML file
 *
 * @param data - Data to write
 * @param outputTo - Output file path
 */
function writeDataFile(data: unknown, outputTo: string): void {
  fs.writeFileSync(outputTo, yaml.dump(data));
}

/**
 * Write data to a JSON file
 *
 * @param data - Data to write
 * @param outputTo - Output file path
 */
function writeJsonFile(data: unknown, outputTo: string): void {
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
  isPlaceholderFragment(str: string): boolean {
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
function writePathOpenapis(
  openapi: OpenAPIDocument,
  prefix: string,
  outPath: string
): void {
  const pathGroups: Record<string, Record<string, PathItem>> = {};

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
    const doc: OpenAPIDocument = JSON.parse(JSON.stringify(openapi));
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
function createArticleDataForPathGroup(openapi: OpenAPIDocument): Article {
  const article: Article = {
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
  const snakifyPath = (p: string): string => {
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
function writeOpenapiArticleData(
  sourcePath: string,
  targetPath: string,
  opts: WriteOpenapiArticleDataOptions
): void {
  /**
   * Check if path is a file
   */
  const isFile = (filePath: string): boolean => {
    return fs.lstatSync(filePath).isFile();
  };

  /**
   * Check if filename matches pattern
   */
  const matchesPattern = (filePath: string): boolean => {
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

    const articleCollection: ArticleCollection = { articles };

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
export function generateHugoData(options: GenerateHugoDataOptions): void {
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
