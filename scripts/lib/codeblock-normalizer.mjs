import * as json from './codeblock-validators/json.mjs';
import * as yaml from './codeblock-validators/yaml.mjs';
import * as toml from './codeblock-validators/toml.mjs';
import * as bash from './codeblock-validators/bash.mjs';
import * as python from './codeblock-validators/python.mjs';
import * as js from './codeblock-validators/javascript.mjs';

const VALIDATORS = {
  json: (c) => json.validate(c),
  jsonl: (c) => json.validate(c, { jsonl: true }),
  yaml: (c) => yaml.validate(c),
  toml: (c) => toml.validate(c),
  bash: (c) => bash.validate(c),
  python: (c) => python.validate(c),
  javascript: (c) => js.validate(c),
};

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function identifierSub(code, token) {
  return code.replace(new RegExp(`\\b${escapeRegex(token)}\\b`, 'g'), `${token}_placeholder_ci`);
}

function quotedSub(code, token) {
  const escaped = escapeRegex(token);
  // Match "TOKEN" (already quoted) OR bare TOKEN, replacing with a quoted
  // sentinel in both cases. This avoids producing ""TOKEN_ci"" when the token
  // already appears inside a JSON/YAML/TOML string value.
  return code.replace(
    new RegExp(`"${escaped}"|\\b${escaped}\\b`, 'g'),
    `"${token}_placeholder_ci"`,
  );
}

const PLACEHOLDER_SUB = {
  bash: identifierSub,
  python: identifierSub,
  javascript: identifierSub,
  json: quotedSub,
  jsonl: quotedSub,
  yaml: quotedSub,
  toml: quotedSub,
};

function applyPlaceholders(code, lang, placeholders) {
  if (!placeholders?.length) return { code, applied: false };
  const fn = PLACEHOLDER_SUB[lang];
  if (!fn) return { code, applied: false };
  let out = code;
  for (const token of placeholders) out = fn(out, token);
  return { code: out, applied: out !== code };
}

const SHORTCODE_RE = /\{\{[%<][\s\S]*?[%>]\}\}/g;
const SHORTCODE_REPLACEMENT = {
  bash: ': SHORTCODE',
  python: '__SHORTCODE__',
  javascript: '__SHORTCODE__',
  // Use an unquoted literal (0) for strict-parse languages so the replacement
  // is valid both as a bare value and inside an existing quoted string.
  // "{{< host >}}/api" → "0/api" (still a valid string),
  // not ""__SHORTCODE__"/api" (double-quoted, invalid).
  json: '0',
  jsonl: '0',
  yaml: '0',
  toml: '0',
};

function stripShortcodes(code, lang) {
  SHORTCODE_RE.lastIndex = 0;
  if (!SHORTCODE_RE.test(code)) return { code, applied: false };
  SHORTCODE_RE.lastIndex = 0;
  const replacement = SHORTCODE_REPLACEMENT[lang];
  if (replacement == null) return { code, applied: false };
  return { code: code.replace(SHORTCODE_RE, replacement), applied: true };
}

// Match standalone "elide" markers used in docs to indicate omitted
// content: a line containing only whitespace + `...` (3+ dots) or
// `[...]`. These are pervasive in Telegraf/InfluxDB TOML examples and
// in YAML config snippets, but neither parses as valid TOML/YAML —
// `...` is the YAML doc-end marker (only meaningful at column 0) and
// `[...]` is an empty TOML bare key.
const ELIDE_LINE_RE = /^([ \t]*)(\[\.{3,}\]|\.{3,})([ \t]*)$/gm;

const ELIDE_COMMENT_PREFIX = {
  yaml: '#',
  toml: '#',
  bash: '#',
  python: '#',
  javascript: '//',
  // JSON/JSONL don't allow comments; can't safely substitute, so
  // ellipsis markers in JSON fences must be removed at the source.
};

function stripElideMarkers(code, lang) {
  const prefix = ELIDE_COMMENT_PREFIX[lang];
  if (!prefix) return { code, applied: false };
  ELIDE_LINE_RE.lastIndex = 0;
  if (!ELIDE_LINE_RE.test(code)) return { code, applied: false };
  ELIDE_LINE_RE.lastIndex = 0;
  // For YAML, leave column-0 `...` alone — that's the document-end
  // marker in a YAML stream, not an ellipsis. Only substitute when the
  // marker is indented (which is unambiguous ellipsis usage).
  if (lang === 'yaml') {
    return {
      code: code.replace(ELIDE_LINE_RE, (match, leading, marker, trailing) => {
        if (leading.length === 0) return match;
        return `${leading}${prefix} ${marker}${trailing}`;
      }),
      applied: true,
    };
  }
  return {
    code: code.replace(
      ELIDE_LINE_RE,
      (_match, leading, marker, trailing) => `${leading}${prefix} ${marker}${trailing}`,
    ),
    applied: true,
  };
}

/**
 * Validate a code block with hybrid two-phase normalization.
 * Phase 1: parse as-is. If OK, return.
 * Phase 2: apply substitution rules (placeholders, shortcodes), re-parse.
 *   If retry succeeds: return OK with notice listing applied rules.
 *   If retry fails: return original phase-1 errors (honest to source).
 *
 * @param {{lang: string|null, value: string, placeholders: string[]}} block
 * @returns {Promise<{ok: boolean, errors: Array, notice?: string, skipped?: boolean}>}
 */
export async function validateWithNormalization(block) {
  const run = VALIDATORS[block.lang];
  if (!run) return { ok: true, errors: [], skipped: true };

  const phase1 = await run(block.value);
  if (phase1.ok) return { ok: true, errors: [] };

  const rules = [];
  let candidate = block.value;

  const subbed = applyPlaceholders(candidate, block.lang, block.placeholders);
  if (subbed.applied) {
    candidate = subbed.code;
    rules.push('placeholder substitution');
  }

  const stripped = stripShortcodes(candidate, block.lang);
  if (stripped.applied) {
    candidate = stripped.code;
    rules.push('shortcode strip');
  }

  const elided = stripElideMarkers(candidate, block.lang);
  if (elided.applied) {
    candidate = elided.code;
    rules.push('elide marker comment-out');
  }

  if (rules.length === 0) return { ok: false, errors: phase1.errors };

  const phase2 = await run(candidate);
  if (phase2.ok) {
    return { ok: true, errors: [], notice: `normalized before parse: ${rules.join('; ')}` };
  }
  return { ok: false, errors: phase1.errors };
}
