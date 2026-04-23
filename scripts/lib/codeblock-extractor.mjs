import { unified } from 'unified';
import remarkParse from 'remark-parse';

const parser = unified().use(remarkParse);

/**
 * Extract fenced code blocks from a Markdown string.
 * @param {string} markdown
 * @returns {Array<{lang: string|null, meta: string|null, value: string, startLine: number}>}
 */
export function extractCodeBlocks(markdown) {
  const tree = parser.parse(markdown);
  const blocks = [];
  for (const node of tree.children) {
    if (node.type === 'code') {
      blocks.push({
        lang: node.lang ?? null,
        meta: node.meta ?? null,
        value: node.value ?? '',
        startLine: node.position?.start?.line ?? 0,
      });
    }
  }
  return blocks;
}
