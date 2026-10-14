import assert from 'node:assert/strict';
import { globSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { load } from 'js-yaml';

const products = load(readFileSync('data/products.yml', 'utf8'));

const unrelatedNumbers = new Map([
  [
    'query-data/troubleshoot-and-optimize/optimize-queries.md',
    'describes query cost for wide tables, not the column limit',
  ],
  [
    'reference/syntax/annotated-csv/_index.md',
    'describes annotated CSV tables, not the table limit',
  ],
]);
const expandTitle = /\{\{%\s*expand\s+"([^"]*)"/;
const limitContext = /column|table|measurement/i;
const typedNumber = /(?<![\w.,`-])(\d{3,4})(?![\w.,`])/g;

const limitedProducts = Object.values(products).filter(
  ({ limits, distributed_architecture: distributed }) => limits && distributed
);

function limitValues({ limits }) {
  return new Set(
    [...Object.values(limits), limits.column - 1].map((value) => String(value))
  );
}

function proseLines(file) {
  let inCodeBlock = false;
  return readFileSync(file, 'utf8')
    .split('\n')
    .map((text, index) => ({ text, line: index + 1 }))
    .filter(({ text }) => {
      if (text.trimStart().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        return false;
      }
      return !inCodeBlock && !text.trimStart().startsWith('|');
    });
}

function productPages({ content_path: contentPath }) {
  return globSync(`content/${contentPath}/**/*.md`).filter(
    (file) =>
      !file.includes('release-notes') &&
      ![...unrelatedNumbers.keys()].some((page) => file.endsWith(page))
  );
}

test('distributed product prose uses the influxdb3/limit shortcode', () => {
  const typedLimits = limitedProducts.flatMap((product) => {
    const values = limitValues(product);
    return productPages(product).flatMap((file) =>
      proseLines(file)
        .filter(
          ({ text }) => limitContext.test(text) && !expandTitle.test(text)
        )
        .filter(({ text }) =>
          Array.from(text.matchAll(typedNumber)).some(([number]) =>
            values.has(number)
          )
        )
        .map(({ line, text }) => `${file}:${line}: ${text.trim()}`)
    );
  });
  assert.deepEqual(typedLimits, []);
});

test('expand titles state the configured column limit', () => {
  const mismatches = limitedProducts.flatMap((product) =>
    productPages(product).flatMap((file) =>
      proseLines(file)
        .map(({ text, line }) => ({
          title: text.match(expandTitle)?.[1],
          line,
        }))
        .filter(({ title }) => title && /total columns/.test(title))
        .filter(
          ({ title }) =>
            !title.includes(`${product.limits.column} total columns`)
        )
        .map(({ line, title }) => `${file}:${line}: ${title}`)
    )
  );
  assert.deepEqual(mismatches, []);
});
