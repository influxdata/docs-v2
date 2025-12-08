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
  /** Indicates this is a conceptual/supplementary tag (no operations) */
  'x-traitTag'?: boolean;
  [key: string]: unknown;
}

/**
 * Operation metadata for TOC generation
 */
interface OperationMeta {
  operationId: string;
  method: string;
  path: string;
  summary: string;
  tags: string[];
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
    /** Related documentation links extracted from x-relatedLinks */
    related?: string[];
    /** OpenAPI tags from operations (for Hugo frontmatter) */
    apiTags?: string[];
    /** Menu display name (actual endpoint path, different from Hugo path) */
    menuName?: string;
    /** OpenAPI tag name (for tag-based articles) */
    tag?: string;
    /** Whether this is a conceptual tag (x-traitTag) */
    isConceptual?: boolean;
    /** Tag description from OpenAPI spec */
    tagDescription?: string;
    /** Sidebar navigation group */
    menuGroup?: string;
    /** Operations metadata for TOC generation */
    operations?: OperationMeta[];
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
 * Convert tag name to URL-friendly slug
 *
 * @param tagName - Tag name (e.g., "Write data", "Processing engine")
 * @returns URL-friendly slug (e.g., "write-data", "processing-engine")
 */
function slugifyTag(tagName: string): string {
  return tagName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Menu group mappings for tag-based navigation
 * Maps OpenAPI tags to sidebar groups
 */
const TAG_MENU_GROUPS: Record<string, string> = {
  // Concepts group
  'Quick start': 'Concepts',
  Authentication: 'Concepts',
  'Headers and parameters': 'Concepts',
  'Response codes': 'Concepts',
  // Data Operations group
  'Write data': 'Data Operations',
  'Query data': 'Data Operations',
  'Cache data': 'Data Operations',
  // Administration group
  Database: 'Administration',
  Table: 'Administration',
  Token: 'Administration',
  // Processing Engine group
  'Processing engine': 'Processing Engine',
  // Server group
  'Server information': 'Server',
  // Compatibility group
  'Compatibility endpoints': 'Compatibility',
};

/**
 * Get menu group for a tag
 *
 * @param tagName - Tag name
 * @returns Menu group name or 'Other' if not mapped
 */
function getMenuGroupForTag(tagName: string): string {
  return TAG_MENU_GROUPS[tagName] || 'Other';
}

/**
 * HTTP methods to check for operations
 */
const HTTP_METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'head',
  'trace',
] as const;

/**
 * Extract all operations from an OpenAPI document grouped by tag
 *
 * @param openapi - OpenAPI document
 * @returns Map of tag name to operations with that tag
 */
function extractOperationsByTag(
  openapi: OpenAPIDocument
): Map<string, OperationMeta[]> {
  const tagOperations = new Map<string, OperationMeta[]>();

  Object.entries(openapi.paths).forEach(([pathKey, pathItem]) => {
    HTTP_METHODS.forEach((method) => {
      const operation = pathItem[method] as Operation | undefined;
      if (operation) {
        const opMeta: OperationMeta = {
          operationId: operation.operationId || `${method}-${pathKey}`,
          method: method.toUpperCase(),
          path: pathKey,
          summary: operation.summary || '',
          tags: operation.tags || [],
        };

        // Add operation to each of its tags
        (operation.tags || []).forEach((tag) => {
          if (!tagOperations.has(tag)) {
            tagOperations.set(tag, []);
          }
          tagOperations.get(tag)!.push(opMeta);
        });
      }
    });
  });

  return tagOperations;
}

/**
 * Write OpenAPI specs grouped by tag to separate files
 * Generates both YAML and JSON versions per tag
 *
 * @param openapi - OpenAPI document
 * @param prefix - Filename prefix for output files
 * @param outPath - Output directory path
 */
function writeTagOpenapis(
  openapi: OpenAPIDocument,
  prefix: string,
  outPath: string
): void {
  const tagOperations = extractOperationsByTag(openapi);

  // Process each tag
  tagOperations.forEach((operations, tagName) => {
    // Deep copy openapi
    const doc: OpenAPIDocument = JSON.parse(JSON.stringify(openapi));

    // Filter paths to only include those with operations for this tag
    const filteredPaths: Record<string, PathItem> = {};
    Object.entries(openapi.paths).forEach(([pathKey, pathItem]) => {
      const filteredPathItem: PathItem = {};
      let hasOperations = false;

      HTTP_METHODS.forEach((method) => {
        const operation = pathItem[method] as Operation | undefined;
        if (operation?.tags?.includes(tagName)) {
          filteredPathItem[method] = operation;
          hasOperations = true;
        }
      });

      // Include path-level parameters if we have operations
      if (hasOperations) {
        if (pathItem.parameters) {
          filteredPathItem.parameters = pathItem.parameters;
        }
        filteredPaths[pathKey] = filteredPathItem;
      }
    });

    doc.paths = filteredPaths;

    // Filter tags to only include this tag (and trait tags for context)
    if (doc.tags) {
      doc.tags = doc.tags.filter(
        (tag) => tag.name === tagName || tag['x-traitTag']
      );
    }

    // Update info
    const tagSlug = slugifyTag(tagName);
    doc.info.title = tagName;
    doc.info.description = `API reference for ${tagName}`;
    doc['x-tagGroup'] = tagName;

    try {
      if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath, { recursive: true });
      }

      const baseFilename = `${prefix}${tagSlug}`;
      const yamlPath = path.resolve(outPath, `${baseFilename}.yaml`);
      const jsonPath = path.resolve(outPath, `${baseFilename}.json`);

      writeDataFile(doc, yamlPath);
      writeJsonFile(doc, jsonPath);

      console.log(
        `Generated tag spec: ${baseFilename}.yaml (${Object.keys(filteredPaths).length} paths, ${operations.length} operations)`
      );
    } catch (err) {
      console.error(`Error writing tag group ${tagName}:`, err);
    }
  });

  // Also create specs for conceptual tags (x-traitTag) without operations
  (openapi.tags || []).forEach((tag) => {
    if (tag['x-traitTag'] && !tagOperations.has(tag.name)) {
      const doc: OpenAPIDocument = JSON.parse(JSON.stringify(openapi));
      doc.paths = {};
      doc.tags = [tag];
      doc.info.title = tag.name;
      doc.info.description = tag.description || `API reference for ${tag.name}`;
      doc['x-tagGroup'] = tag.name;

      const tagSlug = slugifyTag(tag.name);

      try {
        const baseFilename = `${prefix}${tagSlug}`;
        const yamlPath = path.resolve(outPath, `${baseFilename}.yaml`);
        const jsonPath = path.resolve(outPath, `${baseFilename}.json`);

        writeDataFile(doc, yamlPath);
        writeJsonFile(doc, jsonPath);

        console.log(`Generated conceptual tag spec: ${baseFilename}.yaml`);
      } catch (err) {
        console.error(`Error writing conceptual tag ${tag.name}:`, err);
      }
    }
  });
}

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

    // Collect tags used by operations in this path group
    const usedTags = new Set<string>();
    Object.values(doc.paths).forEach((pathItem: PathItem) => {
      const httpMethods = [
        'get',
        'post',
        'put',
        'patch',
        'delete',
        'options',
        'head',
        'trace',
      ];
      httpMethods.forEach((method) => {
        const operation = pathItem[method] as Operation | undefined;
        if (operation?.tags) {
          operation.tags.forEach((tag) => usedTags.add(tag));
        }
      });
    });

    // Filter tags to only include those used by operations in this path group
    // Exclude x-traitTag tags (supplementary documentation tags)
    if (doc.tags) {
      doc.tags = doc.tags.filter(
        (tag) => usedTags.has(tag.name) && !tag['x-traitTag']
      );
    }

    // Simplify info for path-specific docs
    doc.info.title = pg;
    doc.info.description = `API reference for ${pg}`;
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
   * Convert OpenAPI path to Hugo-friendly article path
   * Legacy endpoints (without /api/ prefix) go under api/ directly
   * Versioned endpoints (with /api/vN/) keep their structure
   *
   * @param p - Path to convert (e.g., '/health', '/api/v3/query_sql')
   * @returns Path suitable for Hugo content directory (e.g., 'api/health', 'api/v3/query_sql')
   */
  const toHugoPath = (p: string): string => {
    if (!p) {
      return '';
    }
    // If path doesn't start with /api/, it's a legacy endpoint
    // Place it directly under api/ to avoid collision with /api/v1/* paths
    if (!p.startsWith('/api/')) {
      // /health -> api/health
      // /write -> api/write
      return `api${p}`;
    }
    // /api/v1/health -> api/v1/health
    // /api/v2/write -> api/v2/write
    // /api/v3/query_sql -> api/v3/query_sql
    return p.replace(/^\//, '');
  };

  /**
   * Convert path to tag-friendly format (dashes instead of slashes)
   *
   * @param p - Path to convert
   * @returns Tag-friendly path
   */
  const toTagPath = (p: string): string => {
    if (!p) {
      return '';
    }
    return p.replace(/^\//, '').replaceAll('/', '-');
  };

  const pathGroup = openapi['x-pathGroup'] || '';
  article.path = toHugoPath(pathGroup);
  // Store original path for menu display (shows actual endpoint path)
  article.fields.menuName = pathGroup;
  article.fields.title = openapi.info?.title;
  article.fields.description = openapi.description;

  const pathGroupFrags = path.parse(openapi['x-pathGroup'] || '');
  article.fields.tags = [pathGroupFrags?.dir, pathGroupFrags?.name]
    .filter(Boolean)
    .map((t) => toTagPath(t));

  // Extract x-relatedLinks and OpenAPI tags from path items or operations
  const relatedLinks: string[] = [];
  const apiTags: string[] = [];
  const httpMethods = [
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'options',
    'head',
    'trace',
  ];

  Object.values(openapi.paths).forEach((pathItem: PathItem) => {
    // Check path-level x-relatedLinks
    if (
      pathItem['x-relatedLinks'] &&
      Array.isArray(pathItem['x-relatedLinks'])
    ) {
      relatedLinks.push(
        ...(pathItem['x-relatedLinks'] as string[]).filter(
          (link) => !relatedLinks.includes(link)
        )
      );
    }

    // Check operation-level x-relatedLinks and tags
    httpMethods.forEach((method) => {
      const operation = pathItem[method] as Operation | undefined;
      if (operation) {
        // Extract x-relatedLinks
        if (
          operation['x-relatedLinks'] &&
          Array.isArray(operation['x-relatedLinks'])
        ) {
          relatedLinks.push(
            ...(operation['x-relatedLinks'] as string[]).filter(
              (link) => !relatedLinks.includes(link)
            )
          );
        }
        // Extract OpenAPI tags from operation
        if (operation.tags && Array.isArray(operation.tags)) {
          operation.tags.forEach((tag) => {
            if (!apiTags.includes(tag)) {
              apiTags.push(tag);
            }
          });
        }
      }
    });
  });

  // Only add related if there are links
  if (relatedLinks.length > 0) {
    article.fields.related = relatedLinks;
  }

  // Add OpenAPI tags from operations (for Hugo frontmatter)
  if (apiTags.length > 0) {
    article.fields.apiTags = apiTags;
  }

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
 * Create article data for a tag-based grouping
 *
 * @param openapi - OpenAPI document with x-tagGroup
 * @param operations - Operations for this tag
 * @param tagMeta - Tag metadata from OpenAPI spec
 * @returns Article metadata object
 */
function createArticleDataForTag(
  openapi: OpenAPIDocument,
  operations: OperationMeta[],
  tagMeta?: Tag
): Article {
  const tagName = (openapi['x-tagGroup'] as string) || '';
  const tagSlug = slugifyTag(tagName);
  const isConceptual = tagMeta?.['x-traitTag'] === true;

  const article: Article = {
    path: `api/${tagSlug}`,
    fields: {
      name: tagName,
      describes: Object.keys(openapi.paths),
      title: tagName,
      description:
        tagMeta?.description ||
        openapi.info?.description ||
        `API reference for ${tagName}`,
      tag: tagName,
      isConceptual,
      menuGroup: getMenuGroupForTag(tagName),
      operations: operations.map((op) => ({
        operationId: op.operationId,
        method: op.method,
        path: op.path,
        summary: op.summary,
        tags: op.tags,
      })),
    },
  };

  // Add tag description for conceptual pages
  if (tagMeta?.description) {
    article.fields.tagDescription = tagMeta.description;
  }

  return article;
}

/**
 * Write tag-based OpenAPI article metadata to Hugo data files
 * Generates articles.yml and articles.json
 *
 * @param sourcePath - Path to directory containing tag-based OpenAPI fragment files
 * @param targetPath - Output path for article data
 * @param openapi - Original OpenAPI document (for tag metadata)
 * @param opts - Options including file pattern filter
 */
function writeOpenapiTagArticleData(
  sourcePath: string,
  targetPath: string,
  openapi: OpenAPIDocument,
  opts: WriteOpenapiArticleDataOptions
): void {
  const isFile = (filePath: string): boolean => {
    return fs.lstatSync(filePath).isFile();
  };

  const matchesPattern = (filePath: string): boolean => {
    return opts.filePattern
      ? path.parse(filePath).name.startsWith(opts.filePattern)
      : true;
  };

  // Create tag metadata lookup
  const tagMetaMap = new Map<string, Tag>();
  (openapi.tags || []).forEach((tag) => {
    tagMetaMap.set(tag.name, tag);
  });

  try {
    const articles = fs
      .readdirSync(sourcePath)
      .map((fileName) => path.join(sourcePath, fileName))
      .filter(matchesPattern)
      .filter(isFile)
      .filter(
        (filePath) => filePath.endsWith('.yaml') || filePath.endsWith('.yml')
      )
      .map((filePath) => {
        const tagOpenapi = readFile(filePath);
        const tagName =
          (tagOpenapi['x-tagGroup'] as string) || tagOpenapi.info?.title || '';
        const tagMeta = tagMetaMap.get(tagName);

        // Extract operations from the tag-filtered spec
        const operations: OperationMeta[] = [];
        Object.entries(tagOpenapi.paths).forEach(([pathKey, pathItem]) => {
          HTTP_METHODS.forEach((method) => {
            const operation = pathItem[method] as Operation | undefined;
            if (operation) {
              operations.push({
                operationId: operation.operationId || `${method}-${pathKey}`,
                method: method.toUpperCase(),
                path: pathKey,
                summary: operation.summary || '',
                tags: operation.tags || [],
              });
            }
          });
        });

        const article = createArticleDataForTag(
          tagOpenapi,
          operations,
          tagMeta
        );
        article.fields.source = filePath;
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

    console.log(
      `Generated ${articles.length} tag-based articles in ${targetPath}`
    );
  } catch (e) {
    console.error('Error writing tag article data:', e);
  }
}

/**
 * Options for generating Hugo data by tag
 */
export interface GenerateHugoDataByTagOptions extends GenerateHugoDataOptions {
  /** Whether to also generate path-based files (for backwards compatibility) */
  includePaths?: boolean;
}

/**
 * Generate Hugo data files from an OpenAPI specification grouped by tag
 *
 * This function:
 * 1. Reads the OpenAPI spec file
 * 2. Groups operations by their OpenAPI tags
 * 3. Writes each tag group to separate YAML and JSON files
 * 4. Generates tag-based article metadata for Hugo
 *
 * @param options - Generation options
 */
export function generateHugoDataByTag(
  options: GenerateHugoDataByTagOptions
): void {
  const filenamePrefix = `${path.parse(options.specFile).name}-`;
  const sourceFile = readFile(options.specFile, 'utf8');

  // Optionally generate path-based files for backwards compatibility
  if (options.includePaths) {
    console.log(
      `\nGenerating OpenAPI path files in ${options.dataOutPath}....`
    );
    writePathOpenapis(sourceFile, filenamePrefix, options.dataOutPath);
  }

  // Generate tag-based files
  const tagOutPath = options.includePaths
    ? path.join(options.dataOutPath, 'tags')
    : options.dataOutPath;

  console.log(`\nGenerating OpenAPI tag files in ${tagOutPath}....`);
  writeTagOpenapis(sourceFile, filenamePrefix, tagOutPath);

  console.log(
    `\nGenerating OpenAPI tag article data in ${options.articleOutPath}...`
  );
  writeOpenapiTagArticleData(tagOutPath, options.articleOutPath, sourceFile, {
    filePattern: filenamePrefix,
  });

  console.log('\nTag-based generation complete!\n');
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
  generateHugoDataByTag,
};
