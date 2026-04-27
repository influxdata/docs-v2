import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';

const parser = unified().use(remarkParse).use(remarkFrontmatter);

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
  // Strip only whole-line HTML comments — those whose opening `<!--` and
  // closing `-->` both sit on their own lines (with optional surrounding
  // whitespace). This targets pytest directives like `<!--pytest.mark.skip-->`
  // without altering inline `<!-- ... -->` literals that may legitimately
  // appear inside code (e.g., HTML/Markdown examples).
  //
  // Replace each match with the same number of newlines it contained so
  // that content line offsets are preserved for mapCodeLineToFileLine.
  return s.replace(
    /^[ \t]*<!--[\s\S]*?-->[ \t]*$/gm,
    (match) => '\n'.repeat((match.match(/\n/g) || []).length)
  );
}

function countLines(s) {
  if (!s) return 0;
  // Number of newline-delimited lines (matches validator line-1-indexed semantics).
  return s.split('\n').length;
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
      const value = stripHtmlComments(node.value ?? '');
      items.push({
        kind: 'code',
        rawLang: node.lang ?? null,
        lang: normalizeLang(node.lang),
        meta: node.meta ?? null,
        value,
        contentLines: countLines(value),
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
 * unit; the unit inherits the first fence's language. Each part's MD opening-
 * fence line goes in `partLines`, each part's content-line count in
 * `partContentLines`. Use `mapCodeLineToFileLine` to translate a validator's
 * 1-based line (into the joined `value`) back to the original MD file line.
 * @param {string} markdown
 * @returns {Array<{rawLang: string|null, lang: string|null, meta: string|null, value: string, placeholders: string[], startLine: number, partLines: number[], partContentLines: number[]}>}
 */
export function extractCodeBlocks(markdown) {
  const tree = parser.parse(markdown);
  const items = collectItems(tree);
  // Second pass: fold continuation fences into their preceding code unit,
  // and skip fences that immediately follow an expected-output marker.
  const out = [];
  let skipAfterLine = -1; // MD line of the expected-output marker, or -1 if none pending
  // Only skip an unlabeled fence that starts within this many lines of the marker.
  // Real usage: marker → blank line → fence = distance 2. Allow up to 3 for
  // edge cases (e.g., a Hugo comment between marker and fence).
  const EXPECTED_PROXIMITY = 3;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'expected') { skipAfterLine = item.startLine; continue; }
    if (item.kind === 'cont') continue;
    if (
      skipAfterLine >= 0 &&
      item.rawLang == null &&
      item.startLine - skipAfterLine <= EXPECTED_PROXIMITY
    ) {
      skipAfterLine = -1;
      continue;
    }
    // Marker not consumed: clear it so it doesn't affect later fences.
    skipAfterLine = -1;
    const prevItem = items[i - 1];
    const prev = out[out.length - 1];
    if (prev && prevItem && prevItem.kind === 'cont') {
      prev.value = prev.value + '\n' + item.value;
      prev.partLines.push(item.startLine);
      prev.partContentLines.push(item.contentLines);
    } else {
      const { kind, contentLines, ...rest } = item;
      out.push({
        ...rest,
        partLines: [item.startLine],
        partContentLines: [contentLines],
      });
    }
  }
  return out;
}

/**
 * Map a validator's 1-based content line (into `block.value`) to the
 * corresponding line in the original Markdown file.
 *
 * For a single-fence block: `partLines[0]` is the opening fence line, so
 *   content line N lands at `partLines[0] + N`.
 *
 * For a continuation-joined block: walk the parts in order, accumulating
 * content-line counts. The part whose cumulative range contains `codeLine`
 * owns the mapping; offset = codeLine - cumulative-before-this-part.
 *
 * @param {{partLines: number[], partContentLines: number[]}} block
 * @param {number} codeLine - 1-based line within block.value
 * @returns {number} 1-based MD file line
 */
export function mapCodeLineToFileLine(block, codeLine) {
  const n = Math.max(1, codeLine ?? 1);
  let cumulative = 0;
  for (let i = 0; i < block.partLines.length; i++) {
    const partSize = block.partContentLines?.[i] ?? 0;
    if (n <= cumulative + partSize || i === block.partLines.length - 1) {
      // Opening fence is at partLines[i]; first content line is partLines[i] + 1.
      const withinPart = n - cumulative;
      return block.partLines[i] + withinPart;
    }
    cumulative += partSize;
  }
  return block.partLines[0] + n;
}
