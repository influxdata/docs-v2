import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

// THROWAWAY codemod. Removed before merge with PLAN.md.
// Converts {{% code-placeholders "RE" %}} ... wrappers to the
// ```lang { placeholders="RE" } fenced-code attribute.

/**
 * Inject (or merge) a placeholders attribute into a fence opening line.
 * @param {string} line  the fence-open line (may be indented)
 * @param {string} regex the placeholder regexp from the wrapper
 * @returns {{line:string, status:'injected'|'merged'|'present'|'skip'}}
 */
export function injectAttr(line, regex) {
  const m = line.match(/^(\s*)(`{3,}|~{3,})[ \t]*(.*?)\s*$/);
  if (!m) return { line, status: 'skip' };
  const [, indent, fence, info] = m;
  if (/\bplaceholders\s*=/.test(info)) {
    return { line, status: 'present' };
  }
  const brace = info.match(/^(.*?)\{\s*([\s\S]*?)\s*\}\s*$/);
  if (brace) {
    const lang = brace[1].trim();
    const inner = brace[2].trim();
    const merged = inner.length
      ? `${inner} placeholders="${regex}"`
      : `placeholders="${regex}"`;
    const sep = lang.length ? `${lang} ` : ' ';
    return {
      line: `${indent}${fence}${sep}{ ${merged} }`,
      status: 'merged',
    };
  }
  const lang = info.trim();
  return {
    line: `${indent}${fence}${lang} { placeholders="${regex}" }`,
    status: 'injected',
  };
}

const OPEN_RE =
  /^(\s*)\{\{[%<]\s*code-placeholders\s+"([^"]*)"(?:\s+\S+)*\s*[%>]\}\}\s*$/;
const CLOSE_RE =
  /^\s*\{\{[%<]\s*\/\s*code-placeholders\s*[%>]\}\}\s*$/;
const OPEN_ANY_RE =
  /^\s*\{\{[%<]\s*code-placeholders\s+"[^"]*"(?:\s+\S+)*\s*[%>]\}\}\s*$/;

/** @returns {{indent:string, regex:string}|null} */
export function parseOpenTag(line) {
  const m = line.match(OPEN_RE);
  return m ? { indent: m[1], regex: m[2] } : null;
}

/** @returns {boolean} */
export function isCloseTag(line) {
  return CLOSE_RE.test(line);
}

/** @returns {boolean} */
export function isOpenTagAny(line) {
  return OPEN_ANY_RE.test(line);
}

const TABS_RE =
  /\{\{[%<]\s*\/?\s*(code-tabs-wrapper|code-tabs|code-tab-content)\b/;

/** @param {string[]} lines @returns {boolean} */
export function regionContainsTabs(lines) {
  return lines.some((l) => TABS_RE.test(l));
}

/**
 * Re-indent a wrapper region for list-nested placement.
 * Fence openers/closers and non-fence lines (prose, comments) are
 * normalized to exactly `width` spaces. Lines inside a fence preserve
 * their internal relative indentation, shifted by the fence opener's
 * delta so code structure is retained. Blank lines become ''.
 * @param {string[]} region @param {number} width
 * @returns {string[]}
 */
export function reindentRegion(region, width) {
  const pad = ' '.repeat(width);
  const out = [];
  let marker = null; // { char, len } when inside a fence
  let delta = 0; // shift applied to lines inside the current fence
  for (const line of region) {
    if (line.trim() === '') {
      out.push('');
      continue;
    }
    const m = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
    if (!marker) {
      if (m) {
        const origIndent = m[1].length;
        delta = width - origIndent;
        marker = { char: m[2][0], len: m[2].length };
        out.push(pad + line.slice(origIndent));
      } else {
        out.push(pad + line.replace(/^\s+/, ''));
      }
    } else {
      const isClose =
        m &&
        m[2][0] === marker.char &&
        m[2].length >= marker.len &&
        m[3].trim() === '';
      if (isClose) {
        marker = null;
        out.push(pad + line.replace(/^\s+/, ''));
      } else {
        const cur = line.match(/^ */)[0].length;
        const shifted = Math.max(0, cur + delta);
        out.push(' '.repeat(shifted) + line.slice(cur));
      }
    }
  }
  return out;
}

const SHORTCODE_LINE_RE = /^\s*\{\{[%<].*[%>]\}\}\s*$/;

/**
 * Insert a blank line between a Hugo shortcode line and an adjacent
 * fenced code block so goldmark parses the fence. Only Hugo shortcode
 * lines trigger separation — HTML comments (e.g.
 * <!--pytest-codeblocks:cont-->) must stay attached to their fence.
 * @param {string[]} region @returns {string[]}
 */
export function separateShortcodeAdjacentFences(region) {
  const result = [];
  let marker = null; // { char, len } when inside a fence
  for (let k = 0; k < region.length; k++) {
    const line = region[k];
    const fm = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
    const isFenceOpen = !marker && !!fm;
    const isFenceClose =
      !!marker &&
      !!fm &&
      fm[1][0] === marker.char &&
      fm[1].length >= marker.len &&
      fm[2].trim() === '';
    if (isFenceOpen) {
      if (
        result.length > 0 &&
        result[result.length - 1].trim() !== '' &&
        SHORTCODE_LINE_RE.test(result[result.length - 1])
      ) {
        result.push('');
      }
      result.push(line);
      marker = { char: fm[1][0], len: fm[1].length };
    } else if (isFenceClose) {
      result.push(line);
      marker = null;
      if (
        k + 1 < region.length &&
        region[k + 1].trim() !== '' &&
        SHORTCODE_LINE_RE.test(region[k + 1])
      ) {
        result.push('');
      }
    } else {
      result.push(line);
    }
  }
  return result;
}

/**
 * Indices (within `region`) of fence-OPEN lines at top level
 * (not inside another fence). Handles ``` and ~~~, length-aware close.
 * @param {string[]} region @returns {number[]}
 */
function regionFenceOpenIndices(region) {
  const opens = [];
  let marker = null; // { char, len }
  for (let i = 0; i < region.length; i++) {
    const m = region[i].match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (!marker) {
      if (m) {
        marker = { char: m[1][0], len: m[1].length };
        opens.push(i);
      }
    } else if (
      m &&
      m[1][0] === marker.char &&
      m[1].length >= marker.len &&
      m[2].trim() === ''
    ) {
      marker = null;
    }
  }
  return opens;
}

/**
 * Convert all code-placeholders wrappers in `source`.
 * @param {string} source
 * @param {{file?:string}} [opts]
 * @returns {{content:string, report:{
 *   transformed:number, alreadyPresent:number,
 *   skipped:{file:string,line:number,reason:string}[]
 * }}}
 */
export function migrate(source, opts = {}) {
  const file = opts.file ?? '<unknown>';
  const lines = source.split('\n');
  const out = [];
  const report = { transformed: 0, alreadyPresent: 0, skipped: [] };
  let i = 0;

  while (i < lines.length) {
    const open = parseOpenTag(lines[i]);
    if (!open) {
      out.push(lines[i]);
      i++;
      continue;
    }

    // Find the matching close with depth-balanced scanning so a
    // (malformed) nested open is skipped as one unit, not re-entered.
    let j = i + 1;
    let depth = 1;
    let sawNested = false;
    while (j < lines.length && depth > 0) {
      if (isOpenTagAny(lines[j])) {
        depth++;
        if (depth > 1) sawNested = true;
      } else if (isCloseTag(lines[j])) {
        depth--;
        if (depth === 0) break;
      }
      j++;
    }

    if (depth !== 0) {
      report.skipped.push({ file, line: i + 1, reason: 'unclosed' });
      out.push(lines[i]);
      i++;
      continue;
    }

    if (sawNested) {
      report.skipped.push({ file, line: i + 1, reason: 'nested' });
      for (let k = i; k <= j; k++) out.push(lines[k]);
      i = j + 1;
      continue;
    }

    let region = lines.slice(i + 1, j);

    // A regex containing { or } cannot be placed verbatim into a
    // goldmark fence attribute ({ placeholders="..." }) — the braces
    // break Hugo's attribute parser. Skip + report; leave the wrapper
    // intact for manual handling.
    if (/[{}]/.test(open.regex)) {
      report.skipped.push({
        file,
        line: i + 1,
        reason: 'unsafe-attr-regex',
      });
      for (let k = i; k <= j; k++) out.push(lines[k]);
      i = j + 1;
      continue;
    }

    if (regionContainsTabs(region)) {
      report.skipped.push({ file, line: i + 1, reason: 'code-tabs-wrapper' });
      for (let k = i; k <= j; k++) out.push(lines[k]);
      i = j + 1;
      continue;
    }

    const fenceIdx = regionFenceOpenIndices(region);
    if (fenceIdx.length === 0) {
      report.skipped.push({ file, line: i + 1, reason: 'no-fence' });
      for (let k = i; k <= j; k++) out.push(lines[k]);
      i = j + 1;
      continue;
    }

    for (const idx of fenceIdx) {
      const res = injectAttr(region[idx], open.regex);
      region[idx] = res.line;
      if (res.status === 'present') report.alreadyPresent++;
      else if (res.status === 'injected' || res.status === 'merged')
        report.transformed++;
    }

    // Trim blank lines at region boundaries (separators to the
    // removed wrapper tags).
    while (region.length && region[0].trim() === '') region.shift();
    while (region.length && region[region.length - 1].trim() === '')
      region.pop();

    region = separateShortcodeAdjacentFences(region);

    if (open.indent.length > 0) {
      region = reindentRegion(region, open.indent.length);
    }

    // Markdown needs the de-wrapped fenced block separated from
    // adjacent non-blank content (e.g. an enclosing {{% %}} shortcode);
    // otherwise goldmark won't parse the fence. Added blank lines do
    // not affect rendered code output.
    if (out.length > 0 && out[out.length - 1].trim() !== '') {
      out.push('');
    }

    for (const rl of region) out.push(rl);

    if (j + 1 < lines.length && lines[j + 1].trim() !== '') {
      out.push('');
    }

    i = j + 1;
  }

  return { content: out.join('\n'), report };
}

async function main(argv) {
  const dryRun = argv.includes('--dry-run');
  const files = await glob('content/**/*.md', { nodir: true });
  const summary = {
    filesScanned: 0,
    filesChanged: 0,
    transformed: 0,
    alreadyPresent: 0,
    skipped: [],
  };

  for (const f of files.sort()) {
    const src = await readFile(f, 'utf8');
    if (!/\{\{[%<]\s*code-placeholders\s+"/.test(src)) continue;
    summary.filesScanned++;
    const { content, report } = migrate(src, { file: f });
    summary.transformed += report.transformed;
    summary.alreadyPresent += report.alreadyPresent;
    summary.skipped.push(...report.skipped);
    if (content !== src) {
      summary.filesChanged++;
      if (!dryRun) await writeFile(f, content, 'utf8');
    }
  }

  console.log(JSON.stringify(summary, null, 2));
  console.log(
    `\n${dryRun ? '[DRY RUN] ' : ''}scanned=${summary.filesScanned} ` +
      `changed=${summary.filesChanged} transformed=${summary.transformed} ` +
      `alreadyPresent=${summary.alreadyPresent} ` +
      `skipped=${summary.skipped.length}`
  );
  if (summary.skipped.length) {
    console.log('\nSkipped (manual handling required):');
    for (const s of summary.skipped)
      console.log(`  ${s.file}:${s.line}  (${s.reason})`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
