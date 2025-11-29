/**
 * Markdown Validation Helper for Cypress Tests
 *
 * Uses remark/unified to parse and validate Markdown structure
 * instead of brittle regex patterns.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import { visit } from 'unist-util-visit';

/**
 * Parse Markdown and return AST (Abstract Syntax Tree)
 */
export function parseMarkdown(markdown) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter, ['yaml'])
    .parse(markdown);
}

/**
 * Validate Markdown structure and return validation results
 */
export function validateMarkdown(markdown) {
  const ast = parseMarkdown(markdown);
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    info: {
      hasFrontmatter: false,
      frontmatter: null,
      hasLists: false,
      hasTables: false,
      tableCount: 0,
      tables: [],
      headings: [],
      codeBlocks: [],
      links: [],
    }
  };

  // Extract frontmatter
  visit(ast, 'yaml', (node) => {
    results.info.hasFrontmatter = true;
    try {
      // Store raw frontmatter for parsing
      results.info.frontmatter = node.value;
    } catch (error) {
      results.errors.push(`Invalid YAML frontmatter: ${error.message}`);
      results.valid = false;
    }
  });

  // Check for lists
  visit(ast, 'list', (node) => {
    results.info.hasLists = true;
  });

  // Check for tables and validate structure
  visit(ast, 'table', (node) => {
    results.info.hasTables = true;
    results.info.tableCount++;

    const table = {
      rows: node.children.length,
      columns: node.children[0]?.children.length || 0,
      headers: [],
      cells: []
    };

    // Extract headers from first row
    if (node.children[0]) {
      node.children[0].children.forEach(cell => {
        const text = extractText(cell);
        table.headers.push(text);
      });
    }

    // Extract all cell content
    node.children.forEach((row, rowIndex) => {
      const rowCells = [];
      row.children.forEach(cell => {
        rowCells.push(extractText(cell));
      });
      table.cells.push(rowCells);
    });

    results.info.tables.push(table);
  });

  // Extract headings
  visit(ast, 'heading', (node) => {
    results.info.headings.push({
      depth: node.depth,
      text: extractText(node)
    });
  });

  // Extract code blocks
  visit(ast, 'code', (node) => {
    results.info.codeBlocks.push({
      lang: node.lang || null,
      value: node.value
    });
  });

  // Extract links
  visit(ast, 'link', (node) => {
    results.info.links.push({
      url: node.url,
      title: node.title || null,
      text: extractText(node)
    });
  });

  return results;
}

/**
 * Extract text content from a node (recursively handles all node types)
 */
function extractText(node) {
  if (!node) {
    return '';
  }

  if (node.type === 'text') {
    return node.value;
  }

  // Handle inline code
  if (node.type === 'inlineCode') {
    return node.value;
  }

  // Handle links - extract the text children
  if (node.type === 'link') {
    if (node.children) {
      return node.children.map(extractText).join('');
    }
    return '';
  }

  // Handle emphasis, strong, etc - recursively extract children
  if (node.children) {
    return node.children.map(extractText).join('');
  }

  // For any other node type with a value
  if (node.value) {
    return node.value;
  }

  return '';
}

/**
 * Check if content contains specific text (case-insensitive)
 */
export function containsText(markdown, searchText) {
  return markdown.toLowerCase().includes(searchText.toLowerCase());
}

/**
 * Check if content does NOT contain specific text (case-insensitive)
 */
export function doesNotContainText(markdown, searchText) {
  return !containsText(markdown, searchText);
}

/**
 * Validate frontmatter has required fields
 */
export function validateFrontmatter(frontmatter, requiredFields) {
  const errors = [];

  if (!frontmatter) {
    return { valid: false, errors: ['No frontmatter found'] };
  }

  // Parse YAML frontmatter
  let parsed;
  try {
    // Simple YAML parsing - split by lines and extract key-value pairs
    parsed = {};
    const lines = frontmatter.split('\n');
    lines.forEach(line => {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        parsed[match[1].trim()] = match[2].trim();
      }
    });
  } catch (error) {
    return { valid: false, errors: [`Failed to parse frontmatter: ${error.message}`] };
  }

  // Check required fields
  requiredFields.forEach(field => {
    if (!parsed[field]) {
      errors.push(`Missing required frontmatter field: ${field}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    data: parsed
  };
}

/**
 * Validate table structure
 */
export function validateTable(tableInfo, expectedHeaders = null, minRows = 0) {
  const errors = [];

  if (!tableInfo) {
    return { valid: false, errors: ['Table not found'] };
  }

  // Check column count consistency
  const columnCounts = tableInfo.cells.map(row => row.length);
  const uniqueCounts = [...new Set(columnCounts)];
  if (uniqueCounts.length > 1) {
    errors.push(`Inconsistent column count: ${uniqueCounts.join(', ')}`);
  }

  // Check expected headers
  if (expectedHeaders) {
    expectedHeaders.forEach(header => {
      if (!tableInfo.headers.some(h => h.toLowerCase().includes(header.toLowerCase()))) {
        errors.push(`Missing expected header: ${header}`);
      }
    });
  }

  // Check minimum rows
  if (tableInfo.rows < minRows) {
    errors.push(`Table has ${tableInfo.rows} rows, expected at least ${minRows}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
