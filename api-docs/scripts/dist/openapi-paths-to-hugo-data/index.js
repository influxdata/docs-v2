"use strict";
/**
 * OpenAPI to Hugo Data Converter
 *
 * Converts OpenAPI v3 specifications into Hugo-compatible data files.
 * Generates both YAML and JSON versions of spec fragments grouped by path.
 *
 * @module openapi-paths-to-hugo-data
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.writePathSpecificSpecs = writePathSpecificSpecs;
exports.generateHugoDataByTag = generateHugoDataByTag;
exports.generateHugoData = generateHugoData;
exports.generatePathSpecificSpecs = generatePathSpecificSpecs;
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
 * Convert tag name to URL-friendly slug
 *
 * @param tagName - Tag name (e.g., "Write data", "Processing engine")
 * @returns URL-friendly slug (e.g., "write-data", "processing-engine")
 */
function slugifyTag(tagName) {
    return tagName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
/**
 * Menu group mappings for tag-based navigation
 * Maps OpenAPI tags to sidebar groups
 */
const TAG_MENU_GROUPS = {
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
function getMenuGroupForTag(tagName) {
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
];
/**
 * Extract all operations from an OpenAPI document grouped by tag
 *
 * @param openapi - OpenAPI document
 * @returns Map of tag name to operations with that tag
 */
function extractOperationsByTag(openapi) {
    const tagOperations = new Map();
    Object.entries(openapi.paths).forEach(([pathKey, pathItem]) => {
        HTTP_METHODS.forEach((method) => {
            const operation = pathItem[method];
            if (operation) {
                const opMeta = {
                    operationId: operation.operationId || `${method}-${pathKey}`,
                    method: method.toUpperCase(),
                    path: pathKey,
                    summary: operation.summary || '',
                    tags: operation.tags || [],
                };
                // Extract compatibility version if present
                if (operation['x-compatibility-version']) {
                    opMeta.compatVersion = operation['x-compatibility-version'];
                }
                // Extract externalDocs if present
                if (operation.externalDocs) {
                    opMeta.externalDocs = {
                        description: operation.externalDocs.description || '',
                        url: operation.externalDocs.url,
                    };
                }
                // Add operation to each of its tags
                (operation.tags || []).forEach((tag) => {
                    if (!tagOperations.has(tag)) {
                        tagOperations.set(tag, []);
                    }
                    tagOperations.get(tag).push(opMeta);
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
function writeTagOpenapis(openapi, prefix, outPath) {
    const tagOperations = extractOperationsByTag(openapi);
    // Process each tag
    tagOperations.forEach((operations, tagName) => {
        // Deep copy openapi
        const doc = JSON.parse(JSON.stringify(openapi));
        // Filter paths to only include those with operations for this tag
        const filteredPaths = {};
        Object.entries(openapi.paths).forEach(([pathKey, pathItem]) => {
            const filteredPathItem = {};
            let hasOperations = false;
            HTTP_METHODS.forEach((method) => {
                const operation = pathItem[method];
                if (operation?.tags?.includes(tagName)) {
                    // Clone the operation and restrict tags to only this tag
                    // This prevents RapiDoc from rendering the operation multiple times
                    // (once per tag) when an operation belongs to multiple tags
                    const filteredOperation = { ...operation, tags: [tagName] };
                    filteredPathItem[method] = filteredOperation;
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
            doc.tags = doc.tags.filter((tag) => tag.name === tagName || tag['x-traitTag']);
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
            console.log(`Generated tag spec: ${baseFilename}.yaml (${Object.keys(filteredPaths).length} paths, ${operations.length} operations)`);
        }
        catch (err) {
            console.error(`Error writing tag group ${tagName}:`, err);
        }
    });
    // Also create specs for conceptual tags (x-traitTag) without operations
    (openapi.tags || []).forEach((tag) => {
        if (tag['x-traitTag'] && !tagOperations.has(tag.name)) {
            const doc = JSON.parse(JSON.stringify(openapi));
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
            }
            catch (err) {
                console.error(`Error writing conceptual tag ${tag.name}:`, err);
            }
        }
    });
}
/**
 * Convert API path to filename-safe slug
 *
 * @param apiPath - API path (e.g., "/api/v3/configure/token/admin")
 * @returns Filename-safe slug (e.g., "api-v3-configure-token-admin")
 */
function pathToFileSlug(apiPath) {
    return apiPath
        .replace(/^\//, '') // Remove leading slash
        .replace(/\//g, '-') // Replace slashes with dashes
        .replace(/[{}]/g, '') // Remove curly braces from path params
        .replace(/-+/g, '-') // Collapse multiple dashes
        .replace(/-$/, ''); // Remove trailing dash
}
/**
 * Write path-specific OpenAPI specs (one file per exact API path)
 *
 * Each file contains all HTTP methods for a single path, enabling
 * operation pages to filter by method only (no path prefix conflicts).
 *
 * @param openapi - OpenAPI document
 * @param outPath - Output directory path (e.g., "static/openapi/{product}/paths")
 * @returns Map of API path to spec file path (for use in frontmatter)
 */
function writePathSpecificSpecs(openapi, outPath) {
    const pathSpecFiles = new Map();
    if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath, { recursive: true });
    }
    Object.entries(openapi.paths).forEach(([apiPath, pathItem]) => {
        // Deep clone pathItem to avoid mutating original
        const clonedPathItem = JSON.parse(JSON.stringify(pathItem));
        // Limit each operation to a single tag to prevent duplicate rendering in RapiDoc
        // RapiDoc renders operations once per tag, so multiple tags cause duplicates
        const usedTags = new Set();
        HTTP_METHODS.forEach((method) => {
            const operation = clonedPathItem[method];
            if (operation?.tags && operation.tags.length > 0) {
                // Select the most specific tag to avoid duplicate rendering
                // Prefer "Auth token" over "Authentication" for token-related operations
                let primaryTag = operation.tags[0];
                if (operation.tags.includes('Auth token')) {
                    primaryTag = 'Auth token';
                }
                operation.tags = [primaryTag];
                usedTags.add(primaryTag);
            }
        });
        // Create spec with just this path (all its methods)
        // Include global security requirements so RapiDoc displays auth correctly
        const pathSpec = {
            openapi: openapi.openapi,
            info: {
                ...openapi.info,
                title: apiPath,
                description: `API reference for ${apiPath}`,
            },
            paths: { [apiPath]: clonedPathItem },
            components: openapi.components, // Include for $ref resolution
            servers: openapi.servers,
            security: openapi.security, // Global security requirements
        };
        // Filter spec-level tags to only include those used by operations
        if (openapi.tags) {
            pathSpec.tags = openapi.tags.filter((tag) => usedTags.has(tag.name) && !tag['x-traitTag']);
        }
        // Write files
        const slug = pathToFileSlug(apiPath);
        const yamlPath = path.resolve(outPath, `${slug}.yaml`);
        const jsonPath = path.resolve(outPath, `${slug}.json`);
        writeDataFile(pathSpec, yamlPath);
        writeJsonFile(pathSpec, jsonPath);
        // Store the web-accessible path (without "static/" prefix)
        // Hugo serves files from static/ at the root, so we extract the path after 'static/'
        const staticMatch = yamlPath.match(/static\/(.+)$/);
        const webPath = staticMatch ? `/${staticMatch[1]}` : yamlPath;
        pathSpecFiles.set(apiPath, webPath);
    });
    console.log(`Generated ${pathSpecFiles.size} path-specific specs in ${outPath}`);
    return pathSpecFiles;
}
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
        // Collect tags used by operations in this path group
        const usedTags = new Set();
        Object.values(doc.paths).forEach((pathItem) => {
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
                const operation = pathItem[method];
                if (operation?.tags) {
                    operation.tags.forEach((tag) => usedTags.add(tag));
                }
            });
        });
        // Filter tags to only include those used by operations in this path group
        // Exclude x-traitTag tags (supplementary documentation tags)
        if (doc.tags) {
            doc.tags = doc.tags.filter((tag) => usedTags.has(tag.name) && !tag['x-traitTag']);
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
        }
        catch (err) {
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
     * Convert OpenAPI path to Hugo-friendly article path
     * Legacy endpoints (without /api/ prefix) go under api/ directly
     * Versioned endpoints (with /api/vN/) keep their structure
     *
     * @param p - Path to convert (e.g., '/health', '/api/v3/query_sql')
     * @returns Path suitable for Hugo content directory (e.g., 'api/health', 'api/v3/query_sql')
     */
    const toHugoPath = (p) => {
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
    const toTagPath = (p) => {
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
    const relatedLinks = [];
    const apiTags = [];
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
    Object.values(openapi.paths).forEach((pathItem) => {
        // Check path-level x-relatedLinks
        if (pathItem['x-relatedLinks'] &&
            Array.isArray(pathItem['x-relatedLinks'])) {
            relatedLinks.push(...pathItem['x-relatedLinks'].filter((link) => !relatedLinks.includes(link)));
        }
        // Check operation-level x-relatedLinks and tags
        httpMethods.forEach((method) => {
            const operation = pathItem[method];
            if (operation) {
                // Extract x-relatedLinks
                if (operation['x-relatedLinks'] &&
                    Array.isArray(operation['x-relatedLinks'])) {
                    relatedLinks.push(...operation['x-relatedLinks'].filter((link) => !relatedLinks.includes(link)));
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
            .filter((filePath) => filePath.endsWith('.yaml') || filePath.endsWith('.yml')) // Only process YAML files
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
    }
    catch (e) {
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
function createArticleDataForTag(openapi, operations, tagMeta) {
    const tagName = openapi['x-tagGroup'] || '';
    const tagSlug = slugifyTag(tagName);
    const isConceptual = tagMeta?.['x-traitTag'] === true;
    const article = {
        path: `api/${tagSlug}`,
        fields: {
            name: tagName,
            describes: Object.keys(openapi.paths),
            title: tagName,
            description: tagMeta?.description ||
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
                ...(op.compatVersion && { compatVersion: op.compatVersion }),
                ...(op.externalDocs && { externalDocs: op.externalDocs }),
            })),
        },
    };
    // Add tag description for conceptual pages
    if (tagMeta?.description) {
        article.fields.tagDescription = tagMeta.description;
    }
    // Show security schemes section on Authentication pages
    if (tagName === 'Authentication') {
        article.fields.showSecuritySchemes = true;
    }
    // Aggregate unique externalDocs URLs from operations into article-level related
    // This populates Hugo frontmatter `related` field for "Related content" links
    const relatedUrls = new Set();
    // First check tag-level externalDocs
    if (tagMeta?.externalDocs?.url) {
        relatedUrls.add(tagMeta.externalDocs.url);
    }
    // Then aggregate from operations
    operations.forEach((op) => {
        if (op.externalDocs?.url) {
            relatedUrls.add(op.externalDocs.url);
        }
    });
    if (relatedUrls.size > 0) {
        article.fields.related = Array.from(relatedUrls);
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
function writeOpenapiTagArticleData(sourcePath, targetPath, openapi, opts) {
    const isFile = (filePath) => {
        return fs.lstatSync(filePath).isFile();
    };
    const matchesPattern = (filePath) => {
        return opts.filePattern
            ? path.parse(filePath).name.startsWith(opts.filePattern)
            : true;
    };
    // Create tag metadata lookup
    const tagMetaMap = new Map();
    (openapi.tags || []).forEach((tag) => {
        tagMetaMap.set(tag.name, tag);
    });
    try {
        const articles = fs
            .readdirSync(sourcePath)
            .map((fileName) => path.join(sourcePath, fileName))
            .filter(matchesPattern)
            .filter(isFile)
            .filter((filePath) => filePath.endsWith('.yaml') || filePath.endsWith('.yml'))
            .map((filePath) => {
            const tagOpenapi = readFile(filePath);
            const tagName = tagOpenapi['x-tagGroup'] || tagOpenapi.info?.title || '';
            const tagMeta = tagMetaMap.get(tagName);
            // Extract operations from the tag-filtered spec
            const operations = [];
            Object.entries(tagOpenapi.paths).forEach(([pathKey, pathItem]) => {
                HTTP_METHODS.forEach((method) => {
                    const operation = pathItem[method];
                    if (operation) {
                        const opMeta = {
                            operationId: operation.operationId || `${method}-${pathKey}`,
                            method: method.toUpperCase(),
                            path: pathKey,
                            summary: operation.summary || '',
                            tags: operation.tags || [],
                        };
                        // Extract compatibility version if present
                        if (operation['x-compatibility-version']) {
                            opMeta.compatVersion = operation['x-compatibility-version'];
                        }
                        // Extract externalDocs if present
                        if (operation.externalDocs) {
                            opMeta.externalDocs = {
                                description: operation.externalDocs.description || '',
                                url: operation.externalDocs.url,
                            };
                        }
                        operations.push(opMeta);
                    }
                });
            });
            const article = createArticleDataForTag(tagOpenapi, operations, tagMeta);
            article.fields.source = filePath;
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
        console.log(`Generated ${articles.length} tag-based articles in ${targetPath}`);
    }
    catch (e) {
        console.error('Error writing tag article data:', e);
    }
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
function generateHugoDataByTag(options) {
    const filenamePrefix = `${path.parse(options.specFile).name}-`;
    const sourceFile = readFile(options.specFile, 'utf8');
    // Optionally generate path-based files for backwards compatibility
    if (options.includePaths) {
        console.log(`\nGenerating OpenAPI path files in ${options.dataOutPath}....`);
        writePathOpenapis(sourceFile, filenamePrefix, options.dataOutPath);
    }
    // Generate tag-based files
    const tagOutPath = options.includePaths
        ? path.join(options.dataOutPath, 'tags')
        : options.dataOutPath;
    console.log(`\nGenerating OpenAPI tag files in ${tagOutPath}....`);
    writeTagOpenapis(sourceFile, filenamePrefix, tagOutPath);
    console.log(`\nGenerating OpenAPI tag article data in ${options.articleOutPath}...`);
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
function generateHugoData(options) {
    const filenamePrefix = `${path.parse(options.specFile).name}-`;
    const sourceFile = readFile(options.specFile, 'utf8');
    console.log(`\nGenerating OpenAPI path files in ${options.dataOutPath}....`);
    writePathOpenapis(sourceFile, filenamePrefix, options.dataOutPath);
    console.log(`\nGenerating OpenAPI article data in ${options.articleOutPath}...`);
    writeOpenapiArticleData(options.dataOutPath, options.articleOutPath, {
        filePattern: filenamePrefix,
    });
    console.log('\nGeneration complete!\n');
}
/**
 * Generate path-specific OpenAPI specs from a spec file
 *
 * Convenience wrapper that reads the spec file and generates path-specific specs.
 *
 * @param specFile - Path to OpenAPI spec file
 * @param outPath - Output directory for path-specific specs
 * @returns Map of API path to spec file web path (for use in frontmatter)
 */
function generatePathSpecificSpecs(specFile, outPath) {
    const openapi = readFile(specFile, 'utf8');
    return writePathSpecificSpecs(openapi, outPath);
}
// CommonJS export for backward compatibility
module.exports = {
    generateHugoData,
    generateHugoDataByTag,
    generatePathSpecificSpecs,
    writePathSpecificSpecs,
};
//# sourceMappingURL=index.js.map