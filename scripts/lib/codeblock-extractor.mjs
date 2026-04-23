import { unified } from 'unified';
import remarkParse from 'remark-parse';

const parser = unified().use(remarkParse);

const LANG_ALIASES = {
  bash: 'bash', sh: 'bash', shell: 'bash', zsh: 'bash',
  js: 'javascript', javascript: 'javascript',
  py: 'python', python: 'python',
  yml: 'yaml', yaml: 'yaml',
  json: 'json', jsonl: 'jsonl',
  toml: 'toml',
};

function normalizeLang(raw) {
  if (!raw) return null;
  return LANG_ALIASES[raw.toLowerCase()] ?? null;
}

/**
 * Extract fenced code blocks from a Markdown string.
 * @param {string} markdown
 * @returns {Array<{rawLang: string|null, lang: string|null, meta: string|null, value: string, startLine: number}>}
 */
export function extractCodeBlocks(markdown) {
  const tree = parser.parse(markdown);
  const blocks = [];
  for (const node of tree.children) {
    if (node.type === 'code') {
      blocks.push({
        rawLang: node.lang ?? null,
        lang: normalizeLang(node.lang),
        meta: node.meta ?? null,
        value: node.value ?? '',
        startLine: node.position?.start?.line ?? 0,
      });
    }
  }
  return blocks;
}
