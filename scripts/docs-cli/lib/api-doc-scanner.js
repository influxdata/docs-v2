/**
 * API documentation scanner for docs-v2 repository
 *
 * Parses OpenAPI spec files in api-docs/influxdb3/{core,enterprise}/v3/ref.yml
 * to find documented API endpoints and their parameters.
 *
 * @module api-doc-scanner
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

/**
 * Scans API documentation in docs-v2 repository
 */
export class APIDocScanner {
  constructor(docsRepoPath, product) {
    this.docsRepoPath = docsRepoPath;
    this.product = product; // 'core' or 'enterprise'
    this.documentedEndpoints = new Map(); // endpoint -> { file: '', title: '', description: '' }
  }

  /**
   * Scan for documented API endpoints from OpenAPI specs
   */
  async scanDocumentation() {
    console.log(`🔍 Scanning ${this.product} API documentation...`);

    const specPaths = this.getOpenAPISpecPaths();

    for (const specPath of specPaths) {
      await this.parseOpenAPISpec(specPath);
    }

    console.log(`  📄 Found ${this.documentedEndpoints.size} documented endpoints`);
    return this.documentedEndpoints;
  }

  /**
   * Get OpenAPI spec file paths based on product
   */
  getOpenAPISpecPaths() {
    const paths = [];

    if (this.product === 'core' || this.product === 'both') {
      paths.push(join(this.docsRepoPath, 'api-docs/influxdb3/core/v3/ref.yml'));
    }

    if (this.product === 'enterprise' || this.product === 'both') {
      paths.push(join(this.docsRepoPath, 'api-docs/influxdb3/enterprise/v3/ref.yml'));
    }

    return paths;
  }

  /**
   * Parse OpenAPI spec file to extract endpoints
   */
  async parseOpenAPISpec(specPath) {
    try {
      const content = await fs.readFile(specPath, 'utf-8');
      const spec = yaml.load(content);

      if (!spec.paths) {
        console.warn(`  ⚠️  No paths found in OpenAPI spec: ${specPath}`);
        return;
      }

      // Extract endpoints from paths
      for (const [path, pathItem] of Object.entries(spec.paths)) {
        // Get all HTTP methods for this path
        const methods = [];
        const operations = [];

        for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
          if (pathItem[method]) {
            methods.push(method.toUpperCase());
            operations.push(pathItem[method]);
          }
        }

        if (methods.length > 0) {
          // Use first operation for description
          const operation = operations[0];

          // Extract documented parameters from requestBody schema
          const documentedParams = this.extractDocumentedParams(operation, spec);

          this.documentedEndpoints.set(path, {
            file: specPath.replace(this.docsRepoPath + '/', ''),
            title: operation.summary || 'API Endpoint',
            description: operation.description || '',
            methods,
            operationId: operation.operationId || '',
            tags: operation.tags || [],
            parameters: documentedParams,
          });
        }
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn(`  ⚠️  OpenAPI spec not found: ${specPath}`);
      } else {
        console.warn(`  ⚠️  Error parsing OpenAPI spec ${specPath}:`, error.message);
      }
    }
  }

  /**
   * Extract documented parameters from an operation's requestBody
   */
  extractDocumentedParams(operation, spec) {
    const params = {
      query: [],      // URL query parameters
      body: [],       // Request body properties
      path: [],       // Path parameters
    };

    // Extract query and path parameters
    if (operation.parameters) {
      for (const param of operation.parameters) {
        const paramInfo = {
          name: param.name,
          type: param.schema?.type || 'unknown',
          required: param.required || false,
          description: param.description || '',
          in: param.in,
        };

        if (param.in === 'query') {
          params.query.push(paramInfo);
        } else if (param.in === 'path') {
          params.path.push(paramInfo);
        }
      }
    }

    // Extract request body properties
    if (operation.requestBody?.content) {
      const content = operation.requestBody.content;
      const jsonContent = content['application/json'] || content['application/x-www-form-urlencoded'];

      if (jsonContent?.schema) {
        const schema = this.resolveSchemaRef(jsonContent.schema, spec);
        if (schema?.properties) {
          const requiredFields = schema.required || [];

          for (const [propName, propSchema] of Object.entries(schema.properties)) {
            const resolvedProp = this.resolveSchemaRef(propSchema, spec);
            params.body.push({
              name: propName,
              type: this.getSchemaType(resolvedProp),
              required: requiredFields.includes(propName),
              description: resolvedProp.description || '',
              properties: resolvedProp.properties ? Object.keys(resolvedProp.properties) : null,
            });
          }
        }
      }
    }

    return params;
  }

  /**
   * Resolve a $ref schema reference
   */
  resolveSchemaRef(schema, spec) {
    if (!schema) return null;

    if (schema.$ref) {
      // Format: #/components/schemas/SchemaName
      const refPath = schema.$ref.replace('#/', '').split('/');
      let resolved = spec;
      for (const part of refPath) {
        resolved = resolved?.[part];
      }
      return resolved || schema;
    }

    return schema;
  }

  /**
   * Get a human-readable type from schema
   */
  getSchemaType(schema) {
    if (!schema) return 'unknown';

    if (schema.type === 'array') {
      const itemType = schema.items?.type || 'unknown';
      return `array<${itemType}>`;
    }

    if (schema.type === 'object' && schema.additionalProperties) {
      const valueType = schema.additionalProperties.type || 'unknown';
      return `map<string, ${valueType}>`;
    }

    if (schema.enum) {
      return `enum(${schema.enum.join('|')})`;
    }

    return schema.type || 'object';
  }
}

/**
 * Compare discovered endpoints with documented endpoints
 */
export function compareEndpoints(discoveredEndpoints, documentedEndpoints) {
  const missing = [];
  const documented = [];
  const coverage = {
    total: discoveredEndpoints.size,
    documented: 0,
    missing: 0,
    percentage: 0,
  };

  for (const [path, endpoint] of discoveredEndpoints.entries()) {
    const isDocumented = documentedEndpoints.has(path) ||
                         Array.from(documentedEndpoints.keys()).some(docPath =>
                           path.startsWith(docPath) && endpoint.isPrefix
                         );

    if (isDocumented) {
      documented.push({
        ...endpoint,
        documentation: documentedEndpoints.get(path),
      });
      coverage.documented++;
    } else {
      missing.push(endpoint);
      coverage.missing++;
    }
  }

  coverage.percentage = Math.round((coverage.documented / coverage.total) * 100);

  return {
    missing,
    documented,
    coverage,
  };
}

/**
 * Compare discovered request parameters with documented parameters
 *
 * @param {Array<{endpoint: string, method: string, request: Object|null, response: Object|null}>} discoveredParams - Parameters extracted from Rust structs
 * @param {Map<string, {file: string, title: string, description: string, methods: string[], parameters: Object}>} documentedEndpoints - Endpoints with documented parameters from OpenAPI
 * @returns {{endpoints: Array<Object>, summary: {totalEndpoints: number, endpointsWithMissingParams: number, totalMissingParams: number, totalDocumentedParams: number, totalDiscoveredParams: number}}} Parameter comparison results
 */
export function compareParameters(discoveredParams, documentedEndpoints) {
  const results = {
    endpoints: [],
    summary: {
      totalEndpoints: 0,
      endpointsWithMissingParams: 0,
      totalMissingParams: 0,
      totalDocumentedParams: 0,
      totalDiscoveredParams: 0,
    },
  };

  for (const discovered of discoveredParams) {
    const endpointKey = `${discovered.method} ${discovered.endpoint}`;
    const documented = documentedEndpoints.get(discovered.endpoint);

    results.summary.totalEndpoints++;

    const endpointResult = {
      endpoint: discovered.endpoint,
      method: discovered.method,
      missingParams: [],
      extraDocumentedParams: [],
      matchedParams: [],
      discoveredParams: [],
      documentedParams: [],
    };

    // Get discovered request parameters
    if (discovered.request?.fields) {
      for (const field of discovered.request.fields) {
        endpointResult.discoveredParams.push({
          name: field.serializedName || field.name,
          type: field.type,
          required: field.required,
          description: field.description,
        });
        results.summary.totalDiscoveredParams++;
      }
    }

    // Get documented parameters
    if (documented?.parameters?.body) {
      for (const param of documented.parameters.body) {
        endpointResult.documentedParams.push({
          name: param.name,
          type: param.type,
          required: param.required,
          description: param.description,
        });
        results.summary.totalDocumentedParams++;
      }
    }

    // Compare discovered vs documented
    const documentedNames = new Set(endpointResult.documentedParams.map(p => p.name));
    const discoveredNames = new Set(endpointResult.discoveredParams.map(p => p.name));

    // Find missing parameters (in source but not in docs)
    for (const param of endpointResult.discoveredParams) {
      if (!documentedNames.has(param.name)) {
        endpointResult.missingParams.push(param);
        results.summary.totalMissingParams++;
      } else {
        endpointResult.matchedParams.push(param);
      }
    }

    // Find extra documented parameters (in docs but not in source)
    for (const param of endpointResult.documentedParams) {
      if (!discoveredNames.has(param.name)) {
        endpointResult.extraDocumentedParams.push(param);
      }
    }

    if (endpointResult.missingParams.length > 0) {
      results.summary.endpointsWithMissingParams++;
    }

    results.endpoints.push(endpointResult);
  }

  return results;
}
