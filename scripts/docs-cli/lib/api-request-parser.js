/**
 * API Request/Response Body Parser for InfluxDB 3 HTTP API
 *
 * Parses Rust struct definitions from influxdb3_types/src/http.rs to extract
 * request and response body parameters for API endpoints.
 *
 * This module identifies:
 * - Request/Response struct definitions with their API endpoint associations
 * - Field names, types, and whether they're required or optional
 * - Serde attributes (skip_serializing_if, default, rename, flatten)
 * - Doc comments for field descriptions
 *
 * @module api-request-parser
 */

import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Parses API request/response structs from Rust source code
 */
export class APIRequestParser {
  constructor(repoPath) {
    this.repoPath = repoPath;
    this.structs = new Map(); // structName -> { endpoint, method, fields, isRequest, isResponse }
    this.endpointParams = new Map(); // endpoint -> { request: {...}, response: {...} }
  }

  /**
   * Discover all API request/response structs from source code
   */
  async discoverRequestTypes() {
    console.log('🔍 Parsing API request/response types from source code...');

    try {
      // Parse main http.rs file
      const mainHttpFile = join(this.repoPath, 'influxdb3_types/src/http.rs');
      await this.parseHttpFile(mainHttpFile);

      // Also check for enterprise-specific types
      const enterpriseHttpFile = join(this.repoPath, 'influxdb3_types/src/http/enterprise.rs');
      try {
        await fs.access(enterpriseHttpFile);
        await this.parseHttpFile(enterpriseHttpFile);
      } catch {
        // Enterprise file may not exist in Core repo
      }

      // Build endpoint parameter map
      this.buildEndpointParamMap();

      console.log(`✅ Discovered ${this.structs.size} request/response types`);
      console.log(`✅ Mapped parameters for ${this.endpointParams.size} endpoints`);

      return this.endpointParams;
    } catch (error) {
      console.error('❌ Error discovering request types:', error.message);
      throw error;
    }
  }

  /**
   * Parse a single http.rs file for struct definitions
   */
  async parseHttpFile(filePath) {
    let content;
    try {
      content = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.warn(`  ⚠️  Could not read ${filePath}: ${error.message}`);
      return;
    }

    // Find all struct definitions with their preceding doc comments and attributes
    // Capture struct-level attributes separately to detect #[serde(default)] at struct level
    const structPattern = /(?:\/\/\/[^\n]*\n)*((?:#\[[^\]]+\]\n)*)pub struct (\w+)\s*\{([^}]+)\}/g;

    let match;
    while ((match = structPattern.exec(content)) !== null) {
      const fullMatch = match[0];
      const structAttributes = match[1] || '';
      const structName = match[2];
      const fieldsBlock = match[3];

      // Extract endpoint info from doc comment
      const endpointInfo = this.extractEndpointFromDocComment(fullMatch);

      // Skip structs without endpoint info (not API request/response types)
      if (!endpointInfo) {
        continue;
      }

      // Check for struct-level #[serde(default)] which makes all fields optional
      const hasStructLevelDefault = /serde\([^)]*default[^)]*\)/.test(structAttributes);

      // Parse fields, passing struct-level default info
      const fields = this.parseStructFields(fieldsBlock, hasStructLevelDefault);

      this.structs.set(structName, {
        name: structName,
        endpoint: endpointInfo.endpoint,
        method: endpointInfo.method,
        isRequest: endpointInfo.isRequest,
        isResponse: endpointInfo.isResponse,
        fields,
      });
    }

    console.log(`  📋 Parsed ${this.structs.size} structs from ${filePath.split('/').pop()}`);
  }

  /**
   * Extract endpoint information from doc comment
   * Looks for patterns like:
   *   /// Request definition for the `POST /api/v3/configure/processing_engine_trigger` API
   *   /// Response definition for the `POST /api/v3/configure/distinct_cache` API
   */
  extractEndpointFromDocComment(fullMatch) {
    // Pattern: /// (Request|Response) definition for the `(METHOD) (PATH)` API
    const docPattern = /\/\/\/\s*(Request|Response)\s+definition\s+for\s+the\s+`(\w+)\s+([^`]+)`\s+API/i;
    const match = docPattern.exec(fullMatch);

    if (!match) {
      return null;
    }

    const [, type, method, endpoint] = match;

    return {
      endpoint: endpoint.trim(),
      method: method.toUpperCase(),
      isRequest: type.toLowerCase() === 'request',
      isResponse: type.toLowerCase() === 'response',
    };
  }

  /**
   * Parse struct fields from a fields block
   * @param {string} fieldsBlock - The content between struct braces
   * @param {boolean} hasStructLevelDefault - Whether the struct has #[serde(default)]
   */
  parseStructFields(fieldsBlock, hasStructLevelDefault = false) {
    const fields = [];

    // Split by lines and process each field
    const lines = fieldsBlock.split('\n');
    let currentDocComment = '';
    let currentAttributes = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Collect doc comments
      if (trimmedLine.startsWith('///')) {
        currentDocComment += trimmedLine.replace(/^\/\/\/\s*/, '') + ' ';
        continue;
      }

      // Collect attributes
      if (trimmedLine.startsWith('#[')) {
        currentAttributes.push(trimmedLine);
        continue;
      }

      // Parse field definition: pub field_name: FieldType,
      const fieldMatch = trimmedLine.match(/^pub\s+(\w+):\s*(.+?),?\s*$/);
      if (fieldMatch) {
        const [, fieldName, fieldType] = fieldMatch;

        // Analyze field attributes
        const fieldInfo = this.analyzeFieldAttributes(
          fieldName,
          fieldType,
          currentAttributes,
          currentDocComment.trim(),
          hasStructLevelDefault
        );

        fields.push(fieldInfo);

        // Reset for next field
        currentDocComment = '';
        currentAttributes = [];
      }
    }

    return fields;
  }

  /**
   * Analyze field attributes to determine if optional, has default, etc.
   * @param {string} fieldName - The field name
   * @param {string} fieldType - The field type
   * @param {string[]} attributes - Field-level attributes
   * @param {string} docComment - Doc comment for the field
   * @param {boolean} hasStructLevelDefault - Whether the struct has #[serde(default)]
   */
  analyzeFieldAttributes(fieldName, fieldType, attributes, docComment, hasStructLevelDefault = false) {
    const attributeStr = attributes.join(' ');

    // Check if field is optional (Option<T> type)
    const isOptionType = fieldType.startsWith('Option<');

    // Check for #[serde(default)] at field level
    // This includes both #[serde(default)] and #[serde(default = "path::to::fn")]
    const hasFieldDefault = attributeStr.includes('serde(default)') ||
                            /serde\([^)]*default[^)]*\)/.test(attributeStr);

    // Field has default if either struct-level or field-level default is set
    const hasDefault = hasStructLevelDefault || hasFieldDefault;

    // Check for #[serde(skip_serializing_if = "Option::is_none")]
    const skipIfNone = attributeStr.includes('skip_serializing_if');

    // Check for #[serde(rename = "...")]
    const renameMatch = attributeStr.match(/serde\([^)]*rename\s*=\s*"([^"]+)"/);
    const serializedName = renameMatch ? renameMatch[1] : fieldName;

    // Check for #[serde(flatten)]
    const isFlatten = attributeStr.includes('flatten');

    // Check for #[serde(with = "...")]
    const withMatch = attributeStr.match(/serde\([^)]*with\s*=\s*"([^"]+)"/);
    const serdeWith = withMatch ? withMatch[1] : null;

    // Extract inner type from Option<T>
    let innerType = fieldType;
    if (isOptionType) {
      const innerMatch = fieldType.match(/Option<(.+)>/);
      if (innerMatch) {
        innerType = innerMatch[1];
      }
    }

    // Determine if field is required (not optional and no default at field or struct level)
    const required = !isOptionType && !hasDefault;

    return {
      name: fieldName,
      serializedName,
      type: fieldType,
      innerType,
      required,
      isOption: isOptionType,
      hasDefault,
      skipIfNone,
      isFlatten,
      serdeWith,
      description: docComment || null,
      attributes: attributes,
    };
  }

  /**
   * Build a map of endpoint -> { request, response } params
   */
  buildEndpointParamMap() {
    for (const [structName, structInfo] of this.structs) {
      const key = `${structInfo.method} ${structInfo.endpoint}`;

      if (!this.endpointParams.has(key)) {
        this.endpointParams.set(key, {
          endpoint: structInfo.endpoint,
          method: structInfo.method,
          request: null,
          response: null,
        });
      }

      const entry = this.endpointParams.get(key);
      if (structInfo.isRequest) {
        entry.request = {
          structName,
          fields: structInfo.fields,
        };
      } else if (structInfo.isResponse) {
        entry.response = {
          structName,
          fields: structInfo.fields,
        };
      }
    }
  }

  /**
   * Get parameters for a specific endpoint
   */
  getEndpointParams(method, path) {
    const key = `${method.toUpperCase()} ${path}`;
    return this.endpointParams.get(key) || null;
  }

  /**
   * Get all discovered endpoints with their parameters
   */
  getAllEndpointsWithParams() {
    return Array.from(this.endpointParams.values());
  }

  /**
   * Get summary statistics
   */
  getStats() {
    let totalFields = 0;
    let requiredFields = 0;
    let optionalFields = 0;
    let endpointsWithRequest = 0;
    let endpointsWithResponse = 0;

    for (const entry of this.endpointParams.values()) {
      if (entry.request) {
        endpointsWithRequest++;
        for (const field of entry.request.fields) {
          totalFields++;
          if (field.required) {
            requiredFields++;
          } else {
            optionalFields++;
          }
        }
      }
      if (entry.response) {
        endpointsWithResponse++;
      }
    }

    return {
      totalStructs: this.structs.size,
      totalEndpoints: this.endpointParams.size,
      endpointsWithRequest,
      endpointsWithResponse,
      totalFields,
      requiredFields,
      optionalFields,
    };
  }
}

/**
 * Parse the TriggerSettings struct specifically
 * This is a nested type that needs special handling
 */
export async function parseTriggerSettings(repoPath) {
  const catalogPath = join(repoPath, 'influxdb3_catalog/src/log/versions');

  // Try v4.rs first, then v3.rs, then v2.rs
  const versions = ['v4.rs', 'v3.rs', 'v2.rs'];

  for (const version of versions) {
    try {
      const filePath = join(catalogPath, version);
      const content = await fs.readFile(filePath, 'utf-8');

      // Find TriggerSettings struct
      const structMatch = content.match(
        /(?:\/\/\/[^\n]*\n)*#\[derive\([^\]]+\)\]\n(?:#\[[^\]]+\]\n)*pub struct TriggerSettings\s*\{([^}]+)\}/
      );

      if (structMatch) {
        const fields = [];
        const fieldsBlock = structMatch[1];
        const lines = fieldsBlock.split('\n');

        for (const line of lines) {
          const fieldMatch = line.trim().match(/^pub\s+(\w+):\s*(.+?),?\s*$/);
          if (fieldMatch) {
            fields.push({
              name: fieldMatch[1],
              type: fieldMatch[2],
            });
          }
        }

        // Also find ErrorBehavior enum
        const errorBehaviorMatch = content.match(
          /pub enum ErrorBehavior\s*\{([^}]+)\}/
        );

        let errorBehaviorValues = [];
        if (errorBehaviorMatch) {
          const enumBlock = errorBehaviorMatch[1];
          const valueMatches = enumBlock.matchAll(/^\s*(?:\/\/\/[^\n]*\n)*\s*(\w+),?/gm);
          for (const m of valueMatches) {
            if (m[1] && !m[1].startsWith('#') && !m[1].startsWith('/')) {
              errorBehaviorValues.push(m[1]);
            }
          }
        }

        return {
          fields,
          errorBehaviorValues,
          sourceFile: version,
        };
      }
    } catch {
      // File doesn't exist, try next version
    }
  }

  return null;
}
