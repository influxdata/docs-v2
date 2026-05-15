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
