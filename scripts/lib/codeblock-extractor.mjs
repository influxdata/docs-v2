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

const CONT_RE = /^<!--\s*pytest-codeblocks:cont\s*-->$/;

function normalizeLang(raw) {
  if (!raw) return null;
  return LANG_ALIASES[raw.toLowerCase()] ?? null;
}

function parsePlaceholders(meta) {
  if (!meta) return [];
  const m = meta.match(/\bplaceholders="([^"]+)"/);
  if (!m) return [];
  return m[1].split('|').map((s) => s.trim()).filter(Boolean);
}

function stripHtmlComments(s) {
  return s.replace(/<!--[\s\S]*?-->/g, '').replace(/^\n+/, '').trimEnd();
}

/**
 * Extract fenced code blocks from a Markdown string.
 * Joins fences separated by <!--pytest-codeblocks:cont--> into one logical
 * unit; the unit inherits the first fence's language and tracks per-part
 * line numbers in `partLines`.
 * @param {string} markdown
 * @returns {Array<{rawLang: string|null, lang: string|null, meta: string|null, value: string, placeholders: string[], startLine: number, partLines: number[]}>}
 */
export function extractCodeBlocks(markdown) {
  const tree = parser.parse(markdown);
  // First pass: linearize code + continuation markers in document order.
  const items = [];
  for (const node of tree.children) {
    if (node.type === 'code') {
      items.push({
        kind: 'code',
        rawLang: node.lang ?? null,
        lang: normalizeLang(node.lang),
        meta: node.meta ?? null,
        value: stripHtmlComments(node.value ?? ''),
        placeholders: parsePlaceholders(node.meta),
        startLine: node.position?.start?.line ?? 0,
      });
    } else if (node.type === 'html' && CONT_RE.test((node.value ?? '').trim())) {
      items.push({ kind: 'cont' });
    }
  }
  // Second pass: fold continuation fences into their preceding code unit.
  const out = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'cont') continue;
    const prevItem = items[i - 1];
    const prev = out[out.length - 1];
    if (prev && prevItem && prevItem.kind === 'cont') {
      prev.value = prev.value + '\n' + item.value;
      prev.partLines.push(item.startLine);
    } else {
      out.push({ ...item, partLines: [item.startLine] });
      delete out[out.length - 1].kind;
    }
  }
  return out;
}
