/**
 * API audit reporter - generates markdown reports for API documentation coverage
 *
 * @module api-audit-reporter
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';

/**
 * Generate API audit report in markdown format
 */
export async function generateAPIAuditReport(comparison, product, version, outputDir) {
  const { missing, documented, coverage } = comparison;

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `documentation-audit-api-${product}-${version}.md`;
  const outputPath = join(outputDir, filename);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  const report = [];

  // Header
  report.push(`# API Documentation Audit - InfluxDB 3 ${product === 'core' ? 'Core' : 'Enterprise'}`);
  report.push('');
  report.push(`**Version:** ${version}`);
  report.push(`**Generated:** ${timestamp}`);
  report.push('');

  // Coverage Summary
  report.push('## Coverage Summary');
  report.push('');
  report.push(`- **Total Endpoints:** ${coverage.total}`);
  report.push(`- **Documented:** ${coverage.documented} (${coverage.percentage}%)`);
  report.push(`- **Missing Documentation:** ${coverage.missing}`);
  report.push('');

  // Coverage by Version
  const byVersion = groupByVersion(missing, documented);
  report.push('### Coverage by API Version');
  report.push('');
  report.push('| Version | Total | Documented | Missing | Coverage |');
  report.push('|---------|-------|------------|---------|----------|');

  for (const [version, stats] of Object.entries(byVersion)) {
    const pct = stats.total > 0 ? Math.round((stats.documented / stats.total) * 100) : 0;
    report.push(`| ${version} | ${stats.total} | ${stats.documented} | ${stats.missing} | ${pct}% |`);
  }
  report.push('');

  // Coverage by Category
  const byCategory = groupByCategory(missing, documented);
  report.push('### Coverage by Category');
  report.push('');
  report.push('| Category | Total | Documented | Missing | Coverage |');
  report.push('|----------|-------|------------|---------|----------|');

  for (const [category, stats] of Object.entries(byCategory)) {
    const pct = stats.total > 0 ? Math.round((stats.documented / stats.total) * 100) : 0;
    report.push(`| ${category} | ${stats.total} | ${stats.documented} | ${stats.missing} | ${pct}% |`);
  }
  report.push('');

  // Missing Documentation Section
  if (missing.length > 0) {
    report.push('## Missing Documentation');
    report.push('');
    report.push(`The following ${missing.length} endpoints are not documented:`);
    report.push('');

    // Group missing endpoints by category for better organization
    const missingByCategory = groupMissingByCategory(missing);

    for (const [category, endpoints] of Object.entries(missingByCategory)) {
      if (endpoints.length === 0) continue;

      report.push(`### ${capitalizeCategory(category)}`);
      report.push('');

      for (const endpoint of endpoints) {
        report.push(`#### ${endpoint.methods.join(', ')} \`${endpoint.path}\``);
        report.push('');
        report.push(`- **Description:** ${endpoint.description}`);
        report.push(`- **Handler:** \`${endpoint.handler}\``);
        report.push(`- **API Version:** ${endpoint.version}`);
        report.push('');
      }
    }
  }

  // Documented Endpoints Section
  if (documented.length > 0) {
    report.push('## Documented Endpoints');
    report.push('');
    report.push(`The following ${documented.length} endpoints have documentation:`);
    report.push('');

    // Group by version
    const documentedByVersion = groupDocumentedByVersion(documented);

    for (const [version, endpoints] of Object.entries(documentedByVersion)) {
      if (endpoints.length === 0) continue;

      report.push(`### API ${version.toUpperCase()}`);
      report.push('');
      report.push('| Endpoint | Methods | Documentation |');
      report.push('|----------|---------|---------------|');

      for (const endpoint of endpoints) {
        const methods = endpoint.methods.join(', ');
        const docFile = endpoint.documentation?.file || 'Unknown';
        report.push(`| \`${endpoint.path}\` | ${methods} | ${docFile} |`);
      }
      report.push('');
    }
  }

  // Endpoints Needing Clarification Section
  const needsClarification = [
    ...missing.filter(e => e.needsClarification),
    ...documented.filter(e => e.needsClarification)
  ];

  if (needsClarification.length > 0) {
    report.push('## Endpoints Needing Clarification');
    report.push('');
    report.push('The following endpoints may need engineering clarification about their public API status:');
    report.push('');
    report.push('| Endpoint | Methods | Reason |');
    report.push('|----------|---------|--------|');

    for (const endpoint of needsClarification) {
      const methods = endpoint.methods.join(', ');
      report.push(`| \`${endpoint.path}\` | ${methods} | ${endpoint.needsClarification} |`);
    }
    report.push('');
  }

  // Recommendations Section
  report.push('## Recommendations');
  report.push('');

  if (missing.length > 0) {
    report.push('### Priority Documentation Needs');
    report.push('');

    // Prioritize v3 API endpoints
    const v3Missing = missing.filter(e => e.version === 'v3');
    if (v3Missing.length > 0) {
      report.push(`1. **V3 API Endpoints** (${v3Missing.length} endpoints)`);
      report.push('   - Focus on Core v3 API as it\'s the primary API for InfluxDB 3');
      report.push('');
    }

    // Prioritize write and query endpoints
    const criticalMissing = missing.filter(e =>
      e.path.includes('write') || e.path.includes('query')
    );
    if (criticalMissing.length > 0) {
      report.push(`2. **Write and Query Endpoints** (${criticalMissing.length} endpoints)`);
      report.push('   - These are core functionality endpoints used by all users');
      report.push('');
    }

    // Database and configuration endpoints
    const configMissing = missing.filter(e =>
      e.path.includes('configure') || e.path.includes('database')
    );
    if (configMissing.length > 0) {
      report.push(`3. **Configuration Endpoints** (${configMissing.length} endpoints)`);
      report.push('   - Document database and system configuration endpoints');
      report.push('');
    }
  }

  // Write report to file
  const reportContent = report.join('\n');
  await fs.writeFile(outputPath, reportContent, 'utf-8');

  console.log([
    `📄 API audit report saved: ${outputPath}`,
    `📊 Coverage: ${coverage.percentage}% (${coverage.documented}/${coverage.total} endpoints)`
  ].join('\n'));

  return outputPath;
}

/**
 * Group endpoints by API version
 */
function groupByVersion(missing, documented) {
  const versions = {};

  const allEndpoints = [
    ...missing.map(e => ({ ...e, isDocumented: false })),
    ...documented.map(e => ({ ...e, isDocumented: true }))
  ];

  for (const endpoint of allEndpoints) {
    const version = endpoint.version;

    if (!versions[version]) {
      versions[version] = { total: 0, documented: 0, missing: 0 };
    }

    versions[version].total++;
    if (endpoint.isDocumented) {
      versions[version].documented++;
    } else {
      versions[version].missing++;
    }
  }

  return versions;
}

/**
 * Group endpoints by category
 */
function groupByCategory(missing, documented) {
  const categories = {};

  const allEndpoints = [
    ...missing.map(e => ({ ...e, isDocumented: false })),
    ...documented.map(e => ({ ...e, isDocumented: true }))
  ];

  for (const endpoint of allEndpoints) {
    const category = categorizeEndpoint(endpoint.path);

    if (!categories[category]) {
      categories[category] = { total: 0, documented: 0, missing: 0 };
    }

    categories[category].total++;
    if (endpoint.isDocumented) {
      categories[category].documented++;
    } else {
      categories[category].missing++;
    }
  }

  return categories;
}

/**
 * Group missing endpoints by category
 */
function groupMissingByCategory(missing) {
  const byCategory = {
    write: [],
    query: [],
    database: [],
    table: [],
    cache: [],
    'processing-engine': [],
    token: [],
    health: [],
    other: []
  };

  for (const endpoint of missing) {
    const category = categorizeEndpoint(endpoint.path);
    byCategory[category].push(endpoint);
  }

  return byCategory;
}

/**
 * Group documented endpoints by version
 */
function groupDocumentedByVersion(documented) {
  const byVersion = {
    v3: [],
    v2: [],
    v1: [],
    'v1-compat': [],
    unversioned: []
  };

  for (const endpoint of documented) {
    byVersion[endpoint.version].push(endpoint);
  }

  return byVersion;
}

/**
 * Categorize endpoint based on path
 */
function categorizeEndpoint(path) {
  const lower = path.toLowerCase();

  if (lower.includes('write')) return 'write';
  if (lower.includes('query')) return 'query';
  if (lower.includes('database')) return 'database';
  if (lower.includes('table')) return 'table';
  if (lower.includes('cache')) return 'cache';
  if (lower.includes('processing_engine') || lower.includes('plugin') || lower.includes('engine')) {
    return 'processing-engine';
  }
  if (lower.includes('token')) return 'token';
  if (lower.includes('health') || lower.includes('ping') || lower.includes('metrics')) {
    return 'health';
  }

  return 'other';
}

/**
 * Capitalize category name for display
 */
function capitalizeCategory(category) {
  const names = {
    'write': 'Write Endpoints',
    'query': 'Query Endpoints',
    'database': 'Database Management',
    'table': 'Table Management',
    'cache': 'Cache Configuration',
    'processing-engine': 'Processing Engine',
    'token': 'Token Management',
    'health': 'Health & Metrics',
    'other': 'Other Endpoints'
  };

  return names[category] || category;
}

/**
 * Generate parameter audit report in markdown format
 *
 * This report highlights API parameters that exist in the source code
 * but are not documented in the OpenAPI specs.
 */
export async function generateParameterAuditReport(paramComparison, product, version, outputDir) {
  const { endpoints, summary } = paramComparison;

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `documentation-audit-api-params-${product}-${version}.md`;
  const outputPath = join(outputDir, filename);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  const report = [];

  // Header
  report.push(`# API Parameter Documentation Audit - InfluxDB 3 ${product === 'core' ? 'Core' : 'Enterprise'}`);
  report.push('');
  report.push(`**Version:** ${version}`);
  report.push(`**Generated:** ${timestamp}`);
  report.push('');

  // Summary
  report.push('## Summary');
  report.push('');
  report.push(`- **Endpoints Analyzed:** ${summary.totalEndpoints}`);
  report.push(`- **Endpoints with Missing Parameters:** ${summary.endpointsWithMissingParams}`);
  report.push(`- **Total Parameters in Source:** ${summary.totalDiscoveredParams}`);
  report.push(`- **Total Parameters in Docs:** ${summary.totalDocumentedParams}`);
  report.push(`- **Missing Parameters:** ${summary.totalMissingParams}`);
  report.push('');

  // Missing Parameters Section
  const endpointsWithMissing = endpoints.filter(e => e.missingParams.length > 0);

  if (endpointsWithMissing.length > 0) {
    report.push('## Missing Parameters');
    report.push('');
    report.push('The following parameters exist in the source code but are not documented:');
    report.push('');

    // Group by category
    const byCategory = groupEndpointsByCategory(endpointsWithMissing);

    for (const [category, categoryEndpoints] of Object.entries(byCategory)) {
      if (categoryEndpoints.length === 0) continue;

      report.push(`### ${capitalizeCategory(category)}`);
      report.push('');

      for (const endpoint of categoryEndpoints) {
        report.push(`#### ${endpoint.method} \`${endpoint.endpoint}\``);
        report.push('');
        report.push('| Parameter | Type | Required | Description |');
        report.push('|-----------|------|----------|-------------|');

        for (const param of endpoint.missingParams) {
          const required = param.required ? '✅' : '❌';
          const type = formatType(param.type);
          const desc = param.description || '_No description_';
          report.push(`| \`${param.name}\` | ${type} | ${required} | ${desc} |`);
        }
        report.push('');
      }
    }
  }

  // Detailed Endpoint Analysis
  report.push('## Detailed Endpoint Analysis');
  report.push('');

  for (const endpoint of endpoints) {
    if (endpoint.discoveredParams.length === 0) continue;

    report.push(`### ${endpoint.method} \`${endpoint.endpoint}\``);
    report.push('');

    // Show discovered parameters
    report.push('**Parameters from Source Code:**');
    report.push('');
    report.push('| Parameter | Type | Required | Status |');
    report.push('|-----------|------|----------|--------|');

    for (const param of endpoint.discoveredParams) {
      const required = param.required ? '✅' : '❌';
      const type = formatType(param.type);
      const isMissing = endpoint.missingParams.some(m => m.name === param.name);
      const status = isMissing ? '❗ **UNDOCUMENTED**' : '✓ Documented';
      report.push(`| \`${param.name}\` | ${type} | ${required} | ${status} |`);
    }
    report.push('');
  }

  // Recommendations
  report.push('## Recommendations');
  report.push('');

  if (summary.totalMissingParams > 0) {
    report.push('### Priority Updates');
    report.push('');
    report.push('1. **Update OpenAPI Specs**: Add the missing parameters to the appropriate spec files');
    report.push('2. **Document New Features**: Some parameters may be from recently added features');
    report.push('3. **Verify Required Fields**: Ensure required/optional status matches implementation');
    report.push('');

    // Highlight high-priority missing params
    const highPriority = endpointsWithMissing.filter(e =>
      e.endpoint.includes('processing_engine') ||
      e.endpoint.includes('trigger') ||
      e.endpoint.includes('write') ||
      e.endpoint.includes('query')
    );

    if (highPriority.length > 0) {
      report.push('### High Priority Endpoints');
      report.push('');
      report.push('These endpoints are frequently used and should be prioritized:');
      report.push('');
      for (const endpoint of highPriority) {
        const params = endpoint.missingParams.map(p => `\`${p.name}\``).join(', ');
        report.push(`- **${endpoint.method} ${endpoint.endpoint}**: ${params}`);
      }
      report.push('');
    }
  }

  // Write report to file
  const reportContent = report.join('\n');
  await fs.writeFile(outputPath, reportContent, 'utf-8');

  console.log([
    `📄 Parameter audit report saved: ${outputPath}`,
    `📊 Missing parameters: ${summary.totalMissingParams} across ${summary.endpointsWithMissingParams} endpoints`
  ].join('\n'));

  return outputPath;
}

/**
 * Group endpoints by category based on path
 */
function groupEndpointsByCategory(endpoints) {
  const categories = {
    'write': [],
    'query': [],
    'database': [],
    'table': [],
    'cache': [],
    'processing-engine': [],
    'token': [],
    'health': [],
    'other': []
  };

  for (const endpoint of endpoints) {
    const category = categorizeEndpoint(endpoint.endpoint);
    categories[category].push(endpoint);
  }

  return categories;
}

/**
 * Format Rust type for display
 */
function formatType(type) {
  if (!type) return 'unknown';

  // Simplify common Rust types for display
  return type
    .replace(/Option<(.+)>/, '$1?')
    .replace(/Vec<(.+)>/, '[$1]')
    .replace(/HashMap<(.+),\s*(.+)>/, 'Map<$1, $2>')
    .replace(/Arc<str>/, 'string')
    .replace(/String/, 'string')
    .replace(/bool/, 'boolean')
    .replace(/u64|i64|u32|i32/, 'integer')
    .replace(/f64|f32/, 'number');
}
