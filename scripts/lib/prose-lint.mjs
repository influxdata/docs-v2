import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import { parse as parseYaml } from 'yaml';

const DEFAULT_RULES_FILE = join(
  dirname(fileURLToPath(import.meta.url)),
  '../ci/prose-lint/rules.yml'
);
const LEVELS = new Set(['warning', 'info']);
const BLOCK_TYPES = new Set(['paragraph', 'heading', 'tableCell']);
const SHARED_CONTENT = 'content/shared/';

const MASK = '\u0001';
const BREAK = '\u0002';
const UNCHECKED_TEXT = new RegExp(`[${MASK}${BREAK}]`);

const WORD_START = '(?<![\\w@/.-])';
const WORD_END = '(?![\\w/]|[.-]\\w)';

const SHORTCODE = /\{\{[<%][\s\S]*?[%>]\}\}/g;
const PRODUCT_NAME_SHORTCODE = /^\{\{[<%]\s*product-name\b/;
const PRODUCT_NAME_TEXT = 'InfluxDB';
const URL = /https?:\/\/[^\s)\]>"]+/g;
const SLASHED_TOKEN = /[\w.@~:-]*\/[\w./@~:-]*/g;

const parser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter, ['yaml', 'toml']);

function compilePattern(pattern, { ignorecase, nonword }) {
  const source = nonword ? pattern : `${WORD_START}(?:${pattern})${WORD_END}`;
  return new RegExp(source, ignorecase ? 'gi' : 'g');
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readPhrases(rulesFile, phrasesFile) {
  return readFileSync(join(dirname(rulesFile), phrasesFile), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function compileMatchers(rule, rulesFile) {
  const options = { ignorecase: rule.ignorecase, nonword: rule.nonword };
  const tokens = rule.tokens ?? [];
  const phrases = rule.phrases_file
    ? readPhrases(rulesFile, rule.phrases_file)
    : [];
  const swaps = Object.entries(rule.swap ?? {});
  return [
    ...tokens.map((token) => ({ pattern: compilePattern(token, options) })),
    ...(phrases.length
      ? [
          {
            pattern: compilePattern(
              phrases.map(escapeRegExp).join('|'),
              options
            ),
          },
        ]
      : []),
    ...swaps.map(([pattern, replacement]) => ({
      pattern: compilePattern(pattern, options),
      replacements: String(replacement).split('|'),
    })),
  ];
}

function validateRule(rule) {
  const problems = [];
  if (!rule.id) problems.push('missing id');
  if (!LEVELS.has(rule.level))
    problems.push(`level must be ${[...LEVELS].join(' or ')}`);
  if (!rule.message) problems.push('missing message');
  if (!rule.tokens && !rule.swap && !rule.phrases_file) {
    problems.push('needs tokens, swap, or phrases_file');
  }
  if (!rule.examples?.flag || !rule.examples?.pass)
    problems.push('needs flag and pass examples');
  if (problems.length) {
    throw new Error(
      `Invalid prose rule ${rule.id ?? '(no id)'}: ${problems.join('; ')}`
    );
  }
}

/**
 * Load and compile prose rules.
 *
 * @param {string} [rulesFile] - Path to a rules YAML file.
 * @returns {object[]} Rules with compiled matchers.
 */
export function loadRules(rulesFile = DEFAULT_RULES_FILE) {
  const rules = parseYaml(readFileSync(rulesFile, 'utf8'));
  return rules.map((rule) => {
    validateRule(rule);
    return {
      ...rule,
      matchers: compileMatchers(rule, rulesFile),
      allow: (rule.allow ?? []).map(
        (pattern) => new RegExp(`^(?:${pattern})$`, 'i')
      ),
    };
  });
}

function isAutolink(link) {
  const [child] = link.children;
  return (
    link.children.length === 1 &&
    child.type === 'text' &&
    (child.value === link.url || `mailto:${child.value}` === link.url)
  );
}

function collectSegments(node, segments) {
  for (const child of node.children ?? []) {
    if (child.type === 'text') {
      segments.push({ value: child.value, position: child.position.start });
    } else if (child.type === 'break') {
      segments.push({ value: '\n', position: child.position.start });
    } else if (
      child.children &&
      !(child.type === 'link' && isAutolink(child))
    ) {
      collectSegments(child, segments);
    } else {
      segments.push({ value: BREAK, position: child.position.start });
    }
  }
  return segments;
}

function maskShortcode(shortcode) {
  if (
    !PRODUCT_NAME_SHORTCODE.test(shortcode) ||
    shortcode.length < PRODUCT_NAME_TEXT.length
  ) {
    return MASK.repeat(shortcode.length);
  }
  return (
    PRODUCT_NAME_TEXT + MASK.repeat(shortcode.length - PRODUCT_NAME_TEXT.length)
  );
}

function isPath(token) {
  return (
    /[a-z]/i.test(token) &&
    (/^[/.~]/.test(token) || /[.@]/.test(token) || token.split('/').length > 2)
  );
}

function maskUncheckedText(text) {
  return text
    .replace(SHORTCODE, maskShortcode)
    .replace(URL, (url) => MASK.repeat(url.length))
    .replace(SLASHED_TOKEN, (token) =>
      isPath(token) ? MASK.repeat(token.length) : token
    );
}

function blockText(block) {
  const segments = collectSegments(block, []);
  let text = '';
  for (const segment of segments) {
    segment.start = text.length;
    text += segment.value;
  }
  return { text: maskUncheckedText(text), segments };
}

function sourcePosition(index, segments, sourceLines) {
  const segment = segments.findLast((candidate) => candidate.start <= index);
  const before = segment.value.slice(0, index - segment.start);
  const lineOffset = before.split('\n').length - 1;
  const line = segment.position.line + lineOffset;
  if (lineOffset === 0) {
    return { line, column: segment.position.column + before.length };
  }
  const valueLineStart = before.lastIndexOf('\n') + 1;
  const valueLine = segment.value.slice(valueLineStart).split('\n')[0];
  const indent = Math.max(0, (sourceLines[line - 1] ?? '').indexOf(valueLine));
  return { line, column: indent + before.length - valueLineStart + 1 };
}

function appliesToPath(rule, path) {
  if (!rule.paths) return true;
  if (path.startsWith(SHARED_CONTENT)) return false;
  return rule.paths.some((prefix) => path.startsWith(prefix));
}

function appliesToBlock(rule, blockType) {
  if (rule.only && !rule.only.includes(blockType)) return false;
  return !rule.skip?.includes(blockType);
}

function isAllowed(rule, matcher, match) {
  return (
    UNCHECKED_TEXT.test(match) ||
    rule.allow.some((pattern) => pattern.test(match)) ||
    Boolean(matcher.replacements?.includes(match))
  );
}

function formatMessage(rule, matcher, match) {
  return rule.message
    .replaceAll('{match}', match.replace(/\s+/g, ' '))
    .replaceAll('{replacement}', matcher.replacements?.join("' or '") ?? '');
}

const SWITCH_COMMENT =
  /^<!--\s*(?:prose-lint|vale)\s+(off|on)\b\s*([\w\s,]*?)\s*-->$/;

function parseSwitch(node) {
  const found = node.type === 'html' && node.value.trim().match(SWITCH_COMMENT);
  if (!found) return null;
  const [, state, names] = found;
  const ruleIds = names.split(/[\s,]+/).filter(Boolean);
  return { off: state === 'off', ruleIds };
}

function applySwitch(disabled, { off, ruleIds }) {
  const targets = ruleIds.length ? ruleIds : ['*'];
  if (!off && !ruleIds.length) return new Set();
  const next = new Set(disabled);
  for (const id of targets) {
    if (off) next.add(id);
    else next.delete(id);
  }
  return next;
}

function blocksOf(tree) {
  const blocks = [];
  let disabled = new Set();
  const visit = (node) => {
    const toggle = parseSwitch(node);
    if (toggle) {
      disabled = applySwitch(disabled, toggle);
      return;
    }
    if (BLOCK_TYPES.has(node.type)) {
      blocks.push({ node, disabled });
      return;
    }
    node.children?.forEach(visit);
  };
  visit(tree);
  return blocks;
}

function isEnabled(rule, disabled) {
  return !disabled.has('*') && !disabled.has(rule.id);
}

/**
 * Check the prose in a Markdown document.
 *
 * @param {string} markdown - Markdown source.
 * @param {object} options - Lint options.
 * @param {string} options.path - Repository-relative path, for path-scoped rules.
 * @param {object[]} options.rules - Rules from loadRules().
 * @returns {{rule: string, level: string, message: string, link?: string,
 *   match: string, line: number, column: number}[]} Findings in source order.
 */
export function lintProse(markdown, { path, rules }) {
  const sourceLines = markdown.split('\n');
  const pathRules = rules.filter((rule) => appliesToPath(rule, path));
  const findings = [];
  for (const { node: block, disabled } of blocksOf(parser.parse(markdown))) {
    const { text, segments } = blockText(block);
    for (const rule of pathRules.filter(
      (candidate) =>
        isEnabled(candidate, disabled) && appliesToBlock(candidate, block.type)
    )) {
      for (const matcher of rule.matchers) {
        for (const found of text.matchAll(matcher.pattern)) {
          const [match] = found;
          if (isAllowed(rule, matcher, match)) continue;
          findings.push({
            rule: rule.id,
            level: rule.level,
            message: formatMessage(rule, matcher, match),
            link: rule.link,
            match,
            ...sourcePosition(found.index, segments, sourceLines),
          });
        }
      }
    }
  }
  return findings.sort((a, b) => a.line - b.line || a.column - b.column);
}
