import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = process.env.PUBLIC_DIR || 'public';

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name === 'index.md') yield p;
  }
}

function htmlArticleText(html) {
  const m = html.match(
    /<article[^>]*article--content[^>]*>([\s\S]*?)<\/article>/i
  );
  return (m ? m[1] : '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mdBody(md) {
  const m = md.match(/^---\n[\s\S]+?\n---\n([\s\S]*)$/);
  return (m ? m[1] : md).trim();
}

test('generated .md pages are not truncated vs their source HTML', async () => {
  const truncated = [];
  let checked = 0;
  for await (const mdPath of walk(PUBLIC)) {
    const htmlPath = mdPath.replace(/index\.md$/, 'index.html');
    let html;
    try {
      html = await fs.readFile(htmlPath, 'utf-8');
    } catch {
      continue;
    }
    const text = htmlArticleText(html);
    if (text.length < 3000) continue; // only meaningful for substantial pages
    const body = mdBody(await fs.readFile(mdPath, 'utf-8'));
    checked++;
    // The .md body should retain most of the article's visible text. 0.5 is a
    // conservative floor (the baseline build had 0 pages below it); tighten
    // once a real truncated example sets the bar.
    if (body.length < text.length * 0.5) {
      truncated.push(
        `${path.relative(PUBLIC, mdPath)} (md ${body.length} vs html ${text.length})`
      );
    }
  }
  assert.ok(checked > 0, 'no pages checked — build public/ first');
  assert.equal(truncated.length, 0, `Truncated pages:\n${truncated.join('\n')}`);
});

test('section bundles contain their child pages (not truncated)', async () => {
  // A section's body should be roughly the sum of its parent + child page
  // bodies. Far less means combineMarkdown dropped children. Guards #6792 at
  // the generation layer (the runtime clipboard path is covered by Cypress).
  const short = [];
  let checked = 0;
  async function* walkSections(dir) {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) yield* walkSections(p);
      else if (e.name === 'index.section.md') yield p;
    }
  }
  for await (const secPath of walkSections(PUBLIC)) {
    const dir = path.dirname(secPath);
    const parts = [path.join(dir, 'index.md')];
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      if (e.isDirectory()) parts.push(path.join(dir, e.name, 'index.md'));
    }
    let sum = 0;
    for (const p of parts) {
      try {
        sum += mdBody(await fs.readFile(p, 'utf-8')).length;
      } catch {
        /* missing child md — skip */
      }
    }
    if (sum < 3000) continue;
    const secBody = mdBody(await fs.readFile(secPath, 'utf-8'));
    checked++;
    if (secBody.length < sum * 0.6) {
      short.push(
        `${path.relative(PUBLIC, secPath)} (section ${secBody.length} vs parts ${sum})`
      );
    }
  }
  assert.ok(checked > 0, 'no section bundles checked — build public/ first');
  assert.equal(short.length, 0, `Truncated sections:\n${short.join('\n')}`);
});
