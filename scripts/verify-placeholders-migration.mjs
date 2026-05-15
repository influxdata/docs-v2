// THROWAWAY. Compares normalized rendered code-block output between
// two snapshot dirs of `public/`. Invariants checked per HTML page:
//   1. Text content of every <pre>...</pre> (tags stripped).
//   2. The ordered list of data-code-var="..." placeholder tokens.
// Cosmetic wrapper/class differences (e.g. color class) are ignored.
import { readFile } from 'node:fs/promises';
import { glob } from 'glob';
import path from 'node:path';

function extract(html) {
  const pres = [...html.matchAll(/<pre[\s\S]*?<\/pre>/g)].map((m) =>
    m[0]
      .replace(/<[^>]+>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim()
  );
  const vars = [...html.matchAll(/data-code-var="([^"]*)"/g)].map((m) => m[1]);
  return { pres, vars };
}

async function snapshot(dir) {
  const files = await glob('**/index.html', { cwd: dir, nodir: true });
  const map = new Map();
  for (const rel of files) {
    const html = await readFile(path.join(dir, rel), 'utf8');
    if (!html.includes('code-placeholder')) continue;
    map.set(rel, extract(html));
  }
  return map;
}

const [beforeDir, afterDir] = process.argv.slice(2);
if (!beforeDir || !afterDir) {
  console.error('usage: verify-placeholders-migration.mjs <before> <after>');
  process.exit(2);
}

const before = await snapshot(beforeDir);
const after = await snapshot(afterDir);
const pages = new Set([...before.keys(), ...after.keys()]);
let diffs = 0;

for (const p of [...pages].sort()) {
  const b = before.get(p);
  const a = after.get(p);
  if (!b || !a) {
    console.log(`PAGE-PRESENCE-CHANGED ${p} (before=${!!b} after=${!!a})`);
    diffs++;
    continue;
  }
  const preB = JSON.stringify(b.pres);
  const preA = JSON.stringify(a.pres);
  const varB = JSON.stringify(b.vars);
  const varA = JSON.stringify(a.vars);
  if (preB !== preA || varB !== varA) {
    diffs++;
    console.log(`DIFF ${p}`);
    if (preB !== preA) {
      console.log('  <pre> text differs');
      console.log(`   before: ${preB.slice(0, 400)}`);
      console.log(`   after : ${preA.slice(0, 400)}`);
    }
    if (varB !== varA) {
      console.log(`  placeholder tokens differ`);
      console.log(`   before: ${varB}`);
      console.log(`   after : ${varA}`);
    }
  }
}

console.log(
  `\npages=${pages.size} diffs=${diffs} ` +
    `(0 expected; investigate any DIFF that is not an intended list-nesting fix)`
);
process.exit(diffs === 0 ? 0 : 1);
