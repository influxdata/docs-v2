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
const EXPECTED_RE = /^<!--\s*pytest-codeblocks:expected-output\s*-->$/;

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
 * Walk the mdast tree depth-first and collect `code` nodes and `html` nodes
 * matching our continuation/expected-output markers. We need DFS (not just
 * top-level `tree.children`) because this repo uses fenced blocks inside
 * blockquotes, lists, and callout shortcodes.
 */
function collectItems(tree) {
  const items = [];
  function walk(node) {
    if (!node) return;
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
      return; // code nodes don't have children to walk
    }
    if (node.type === 'html') {
      const trimmed = (node.value ?? '').trim();
      if (CONT_RE.test(trimmed)) {
        items.push({ kind: 'cont', startLine: node.position?.start?.line ?? 0 });
      } else if (EXPECTED_RE.test(trimmed)) {
        items.push({ kind: 'expected', startLine: node.position?.start?.line ?? 0 });
      }
      return; // html nodes are leaves
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) walk(child);
    }
  }
  walk(tree);
  // DFS order can still leave nodes at the same depth in the wrong relative
  // order across siblings when children span lines; sort by start line to
  // guarantee document order for continuation/expected-output adjacency.
  items.sort((a, b) => a.startLine - b.startLine);
  return items;
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
  const items = collectItems(tree);
  // Second pass: fold continuation fences into their preceding code unit,
  // and skip fences that immediately follow an expected-output marker.
  const out = [];
  let skipNext = false;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'expected') { skipNext = true; continue; }
    if (item.kind === 'cont') continue;
    if (skipNext) { skipNext = false; continue; }
    const prevItem = items[i - 1];
    const prev = out[out.length - 1];
    if (prev && prevItem && prevItem.kind === 'cont') {
      prev.value = prev.value + '\n' + item.value;
      prev.partLines.push(item.startLine);
    } else {
      const { kind, ...rest } = item;
      out.push({ ...rest, partLines: [item.startLine] });
    }
  }
  return out;
}
