/**
 * API endpoint parser for InfluxDB 3 HTTP API
 *
 * Discovers API endpoints from Rust source code by parsing:
 * - influxdb3_server/src/all_paths.rs - endpoint path constants
 * - influxdb3_server/src/http.rs - route_request function for method/handler mappings
 * - Handler function signatures for parameter extraction
 *
 * @module api-parser
 */

import { promises as fs } from 'fs';
import { join } from 'path';

// Endpoints that require --test-mode flag to be available
// These are filtered out from public API documentation
const TEST_MODE_PATH_PATTERNS = [
  '/api/v3/test/',  // All /api/v3/test/* endpoints require --test-mode
];

// Endpoints that may need clarification about whether they should be public
const NEEDS_CLARIFICATION_PATTERNS = [
  { pattern: '/api/v3/plugin_test/', reason: 'Plugin testing endpoints - confirm if intended for public use' },
];

/**
 * Parses API endpoints from InfluxDB Rust source code
 */
export class APIParser {
  constructor(repoPath) {
    this.repoPath = repoPath;
    this.endpoints = new Map(); // path -> { methods: [], handler: '', params: [], description: '' }
    this.testModeEndpoints = new Map(); // Endpoints that require --test-mode
  }

  /**
   * Discover all API endpoints from source code
   */
  async discoverEndpoints() {
    console.log('🔍 Parsing API endpoints from source code...');

    try {
      // Step 1: Parse endpoint path constants from all_paths.rs
      const pathConstants = await this.parsePathConstants();

      // Step 2: Parse route_request function to map methods to endpoints
      const routeMappings = await this.parseRouteMappings();

      // Step 3: Combine path constants with route mappings
      this.buildEndpointMap(pathConstants, routeMappings);

      console.log(`✅ Discovered ${this.endpoints.size} API endpoints`);
      return this.endpoints;
    } catch (error) {
      console.error('❌ Error discovering endpoints:', error.message);
      throw error;
    }
  }

  /**
   * Parse endpoint path constants from all_paths.rs
   * Also detects test-mode-only endpoints from doc comments
   */
  async parsePathConstants() {
    const pathsFile = join(this.repoPath, 'influxdb3_server/src/all_paths.rs');
    const content = await fs.readFile(pathsFile, 'utf-8');

    const constants = new Map();
    const testModeConstants = new Set();

    // First pass: identify test-mode-only constants from comments
    // Pattern: /// Test-only endpoint... \n pub(crate) const API_V3_TEST_*
    const testModePattern = /\/\/\/\s*Test-only[^\n]*\n(?:\/\/\/[^\n]*\n)*\s*pub(?:\(crate\))?\s+const\s+(\w+):/g;
    let testMatch;
    while ((testMatch = testModePattern.exec(content)) !== null) {
      testModeConstants.add(testMatch[1]);
    }

    // Second pass: extract all path constants
    // Match pattern: pub const API_V3_WRITE: &str = "/api/v3/write_lp";
    const constPattern = /pub(?:\(crate\))?\s+const\s+(\w+):\s+&str\s+=\s+"([^"]+)"/g;

    let match;
    while ((match = constPattern.exec(content)) !== null) {
      const [, constantName, path] = match;

      // Check if this is a test-mode-only endpoint
      const isTestMode = testModeConstants.has(constantName) ||
                         TEST_MODE_PATH_PATTERNS.some(p => path.startsWith(p));

      // Check if this endpoint needs clarification
      const clarification = NEEDS_CLARIFICATION_PATTERNS.find(p => path.startsWith(p.pattern));

      constants.set(constantName, {
        path,
        constantName,
        version: this.extractApiVersion(path),
        isTestMode,
        needsClarification: clarification ? clarification.reason : null,
      });
    }

    const testModeCount = Array.from(constants.values()).filter(c => c.isTestMode).length;
    console.log(`  📋 Found ${constants.size} path constants (${testModeCount} test-mode-only)`);
    return constants;
  }

  /**
   * Parse route_request function to map HTTP methods to endpoints
   */
  async parseRouteMappings() {
    const httpFile = join(this.repoPath, 'influxdb3_server/src/http.rs');
    const content = await fs.readFile(httpFile, 'utf-8');

    const mappings = [];

    // Find the perform_routing function and extract the main match block
    // The main routing is in perform_routing function, not with "let response = match"
    // Pattern looks for: match (method.clone(), path) { ... }
    const patterns = [
      // Main routing in perform_routing function - captures match block until the closing brace and .map_err
      /async fn perform_routing[\s\S]*?match \(method\.clone\(\), path\) \{([\s\S]+?)\n    \}\s*\n\s*\.map_err/,
      // Alternative pattern for match block ending with just closing brace
      /async fn perform_routing[\s\S]*?match \(method\.clone\(\), path\) \{([\s\S]+?)\n    \}/,
      // Fallback: legacy patterns for older code structure
      /let response = match \(method\.clone\(\), path\) \{([\s\S]+?)\n    \};/,
      /let response = match \(method\.clone\(\), uri\.path\(\)\) \{([\s\S]+?)\n    \};/,
    ];

    let matchContent = null;
    for (const pattern of patterns) {
      const matchBlock = pattern.exec(content);
      if (matchBlock) {
        matchContent = matchBlock[1];
        break;
      }
    }

    if (!matchContent) {
      throw new Error('Could not find route_request match block in perform_routing function');
    }

    // Parse individual route patterns
    // Pattern 1: (Method::POST, all_paths::API_V3_WRITE) => handler
    const simpleRoutePattern = /\(Method::(\w+)(?:\s*\|\s*Method::(\w+))?,\s+all_paths::(\w+)\)\s*=>/g;

    let match;
    while ((match = simpleRoutePattern.exec(matchContent)) !== null) {
      const [, method1, method2, constantName] = match;
      const methods = method2 ? [method1, method2] : [method1];

      // Extract handler function name
      const handlerMatch = matchContent.substring(match.index).match(/=>\s*(\{[\s\S]*?\n\s+\}|http_server\.(\w+)\([^)]*\))/);
      const handler = handlerMatch ? (handlerMatch[2] || 'inline_handler') : 'unknown';

      mappings.push({
        methods,
        constantName,
        handler,
      });
    }

    // Pattern 2: (Method::GET | Method::POST, path) if path.starts_with(...) => { ... handler ... }
    // Need to extract the handler from within the block, not the next match arm
    // Handle nested braces and multiline blocks
    const conditionalRoutePattern = /\(Method::(\w+)(?:\s*\|\s*Method::(\w+))?,\s*path\)\s+if\s+path\.starts_with\(all_paths::(\w+)\)\s*=>\s*\{([\s\S]*?)\n        \}/g;

    while ((match = conditionalRoutePattern.exec(matchContent)) !== null) {
      const [, method1, method2, constantName, blockContent] = match;
      const methods = method2 ? [method1, method2] : [method1];

      // Extract handler from within the block content - handle multiline with .await
      // Pattern: http_server.handler_name(...) or http_server\n.handler_name(...)
      const handlerMatch = blockContent.match(/http_server\s*[\n\s]*\.(\w+)\s*\(/);
      const handler = handlerMatch ? handlerMatch[1] : 'prefix_handler';

      mappings.push({
        methods,
        constantName,
        handler,
        isPrefix: true,
      });
    }

    console.log(`  🔗 Found ${mappings.length} route mappings`);
    return mappings;
  }

  /**
   * Build endpoint map by combining path constants and route mappings
   * Filters out test-mode-only endpoints and flags those needing clarification
   */
  buildEndpointMap(pathConstants, routeMappings) {
    let filteredCount = 0;

    for (const mapping of routeMappings) {
      const pathInfo = pathConstants.get(mapping.constantName);

      if (!pathInfo) {
        console.warn(`  ⚠️  Route mapping references unknown constant: ${mapping.constantName}`);
        continue;
      }

      // Skip test-mode-only endpoints - they shouldn't be in public docs
      if (pathInfo.isTestMode) {
        this.testModeEndpoints.set(pathInfo.path, {
          path: pathInfo.path,
          methods: mapping.methods,
          handler: mapping.handler,
          constantName: mapping.constantName,
          reason: 'Requires --test-mode flag',
        });
        filteredCount++;
        continue;
      }

      const endpoint = {
        path: pathInfo.path,
        methods: mapping.methods,
        handler: mapping.handler,
        constantName: mapping.constantName,
        version: pathInfo.version,
        isPrefix: mapping.isPrefix || false,
        params: [], // Will be populated by parseHandlerParams if needed
        description: this.generateDescription(pathInfo.path, mapping.handler),
        needsClarification: pathInfo.needsClarification,
      };

      this.endpoints.set(pathInfo.path, endpoint);
    }

    if (filteredCount > 0) {
      console.log(`  🚫 Filtered ${filteredCount} test-mode-only endpoints`);
    }

    const clarificationCount = Array.from(this.endpoints.values())
      .filter(e => e.needsClarification).length;
    if (clarificationCount > 0) {
      console.log(`  ⚠️  ${clarificationCount} endpoints need clarification`);
    }
  }

  /**
   * Extract API version from path (v1, v2, v3)
   */
  extractApiVersion(path) {
    if (path.includes('/api/v3/')) return 'v3';
    if (path.includes('/api/v2/')) return 'v2';
    if (path.includes('/api/v1/')) return 'v1';
    if (path === '/write' || path === '/query') return 'v1-compat';
    return 'unversioned';
  }

  /**
   * Generate endpoint description from path and handler
   */
  generateDescription(path, handler) {
    // Convert handler name to human-readable description
    const descriptions = {
      write_lp: 'Write line protocol data',
      query_sql: 'Execute SQL query',
      query_influxql: 'Execute InfluxQL query',
      v1_query: 'Execute v1 query',
      health: 'Check health status',
      ping: 'Ping the server',
      handle_metrics: 'Get Prometheus metrics',
      create_database: 'Create a database',
      delete_database: 'Delete a database',
      show_databases: 'List databases',
      update_database: 'Update database configuration',
      create_table: 'Create a table',
      delete_table: 'Delete a table',
      configure_distinct_cache_create: 'Create distinct value cache',
      configure_distinct_cache_delete: 'Delete distinct value cache',
      configure_last_cache_create: 'Create last value cache',
      configure_last_cache_delete: 'Delete last value cache',
      configure_processing_engine_trigger: 'Create processing engine trigger',
      delete_processing_engine_trigger: 'Delete processing engine trigger',
      enable_processing_engine_trigger: 'Enable processing engine trigger',
      disable_processing_engine_trigger: 'Disable processing engine trigger',
      processing_engine_request_plugin: 'Execute processing engine plugin',
      install_plugin_environment_packages: 'Install Python packages',
      install_plugin_environment_requirements: 'Install packages from requirements file',
      create_admin_token: 'Create admin token',
      regenerate_admin_token: 'Regenerate admin token',
      create_named_admin_token: 'Create named admin token',
      delete_token: 'Delete token',
      set_retention_period_for_database: 'Set database retention period',
      clear_retention_period_for_database: 'Clear database retention period',
      test_processing_engine_wal_plugin: 'Test WAL plugin',
      test_processing_engine_schedule_plugin: 'Test scheduled plugin',
    };

    return descriptions[handler] || `Endpoint: ${path}`;
  }

  /**
   * Get endpoints grouped by version
   */
  getEndpointsByVersion() {
    const byVersion = {
      v3: [],
      v2: [],
      v1: [],
      'v1-compat': [],
      unversioned: [],
    };

    for (const endpoint of this.endpoints.values()) {
      byVersion[endpoint.version].push(endpoint);
    }

    return byVersion;
  }

  /**
   * Get endpoints grouped by category
   */
  getEndpointsByCategory() {
    const categories = {
      write: [],
      query: [],
      database: [],
      table: [],
      cache: [],
      'processing-engine': [],
      token: [],
      health: [],
      other: [],
    };

    for (const endpoint of this.endpoints.values()) {
      const path = endpoint.path.toLowerCase();

      if (path.includes('write')) {
        categories.write.push(endpoint);
      } else if (path.includes('query')) {
        categories.query.push(endpoint);
      } else if (path.includes('database')) {
        categories.database.push(endpoint);
      } else if (path.includes('table')) {
        categories.table.push(endpoint);
      } else if (path.includes('cache')) {
        categories.cache.push(endpoint);
      } else if (path.includes('processing_engine') || path.includes('plugin') || path.includes('engine')) {
        categories['processing-engine'].push(endpoint);
      } else if (path.includes('token')) {
        categories.token.push(endpoint);
      } else if (path.includes('health') || path.includes('ping') || path.includes('metrics')) {
        categories.health.push(endpoint);
      } else {
        categories.other.push(endpoint);
      }
    }

    return categories;
  }
}

/**
 * Detect Enterprise-specific endpoints by checking if they exist in Enterprise repo
 */
export async function detectEnterpriseEndpoints(coreEndpoints, enterpriseRepoPath) {
  // For now, we'll mark endpoints as Enterprise if they're in the Enterprise repo
  // In practice, Enterprise includes all Core endpoints plus additional ones

  // Check if Enterprise repo has additional routes
  try {
    const enterpriseHttpFile = join(enterpriseRepoPath, 'influxdb3_server/src/http.rs');
    await fs.access(enterpriseHttpFile);

    // Enterprise repo exists, parse its endpoints
    const enterpriseParser = new APIParser(enterpriseRepoPath);
    const enterpriseEndpoints = await enterpriseParser.discoverEndpoints();

    // Mark Enterprise-specific endpoints
    const corePaths = new Set(coreEndpoints.keys());
    const enterpriseOnly = new Map();

    for (const [path, endpoint] of enterpriseEndpoints.entries()) {
      if (!corePaths.has(path)) {
        enterpriseOnly.set(path, { ...endpoint, enterpriseOnly: true });
      }
    }

    return enterpriseOnly;
  } catch (error) {
    console.warn('  ⚠️  Could not access Enterprise repo, skipping Enterprise detection');
    return new Map();
  }
}
