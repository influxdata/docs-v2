#!/usr/bin/env node
// Reads a client repo's CHANGELOG.md, runs the transform, and writes the
// shared source file. Designed to run from the docs-v2 repo root.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { CLIENTS, getClient } from './clients.js';
import { transformChangelog } from './transform-changelog.js';

const PRODUCTS = [
  'core',
  'enterprise',
  'cloud-dedicated',
  'cloud-serverless',
  'clustered',
];

function setFrontmatterFields(content, fields) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return content;
  let frontmatter = match[1];
  for (const [key, value] of Object.entries(fields)) {
    const keyRe = new RegExp(`^${key}:.*$`, 'm');
    const line = `${key}: ${value}`;
    if (keyRe.test(frontmatter)) {
      frontmatter = frontmatter.replace(keyRe, line);
    } else {
      frontmatter += `\n${line}`;
    }
  }
  return `---\n${frontmatter}\n---\n` + content.slice(match[0].length);
}

function updateStubFrontmatter(
  docsRoot,
  slug,
  latestVersion,
  latestReleaseDate
) {
  const updated = [];
  for (const product of PRODUCTS) {
    const stubPath = resolve(
      docsRoot,
      `content/influxdb3/${product}/reference/client-libraries/v3/${slug}/release-notes.md`
    );
    if (!existsSync(stubPath)) continue;
    const raw = readFileSync(stubPath, 'utf8');
    const next = setFrontmatterFields(raw, {
      latest_version: JSON.stringify(latestVersion),
      latest_release_date: JSON.stringify(latestReleaseDate),
    });
    if (next !== raw) {
      writeFileSync(stubPath, next);
      updated.push(product);
    }
  }
  return updated;
}

function parseCliArgs() {
  const { values } = parseArgs({
    options: {
      client: { type: 'string' },
      all: { type: 'boolean', default: false },
      'source-path': { type: 'string' },
      'source-root': { type: 'string' },
      'docs-root': { type: 'string', default: process.cwd() },
    },
  });

  if (!values.all && !values.client) {
    throw new Error('Must provide --client <slug> or --all');
  }
  if (values.all && values.client) {
    throw new Error('Use --client or --all, not both');
  }
  if (values.client && !values['source-path']) {
    throw new Error('--client requires --source-path <dir>');
  }
  if (values.all && !values['source-root']) {
    throw new Error('--all requires --source-root <dir>');
  }

  return values;
}

function syncOne(client, sourcePath, docsRoot) {
  const changelogPath = join(sourcePath, client.sourceFile);
  if (!existsSync(changelogPath)) {
    return {
      client: client.slug,
      status: 'skipped',
      reason: `No ${client.sourceFile} at ${changelogPath}`,
    };
  }

  const raw = readFileSync(changelogPath, 'utf8');
  const { page, latestVersion, latestReleaseDate } = transformChangelog(raw, {
    displayName: client.displayName,
    language: client.language,
    repo: client.repo,
  });

  if (latestVersion === null) {
    return {
      client: client.slug,
      status: 'warning',
      reason: `No version headings parsed in ${changelogPath}`,
    };
  }

  const outPath = resolve(docsRoot, client.outputPath);
  mkdirSync(dirname(outPath), { recursive: true });

  const previous = existsSync(outPath) ? readFileSync(outPath, 'utf8') : null;
  const bodyChanged = previous !== page;
  if (bodyChanged) {
    writeFileSync(outPath, page);
  }

  const stubsUpdated = updateStubFrontmatter(
    docsRoot,
    client.slug,
    latestVersion,
    latestReleaseDate
  );

  if (!bodyChanged && stubsUpdated.length === 0) {
    return { client: client.slug, status: 'unchanged', latestVersion };
  }

  return {
    client: client.slug,
    status: 'updated',
    latestVersion,
    outputPath: client.outputPath,
    stubsUpdated,
  };
}

function main() {
  const args = parseCliArgs();
  const results = [];

  const targets = args.all
    ? CLIENTS.map((c) => ({
        client: c,
        sourcePath: join(args['source-root'], c.repo.split('/')[1]),
      }))
    : [{ client: getClient(args.client), sourcePath: args['source-path'] }];

  for (const { client, sourcePath } of targets) {
    try {
      results.push(syncOne(client, sourcePath, args['docs-root']));
    } catch (err) {
      results.push({
        client: client.slug,
        status: 'error',
        reason: err.message,
      });
    }
  }

  console.log(JSON.stringify(results, null, 2));

  const hadError = results.some((r) => r.status === 'error');
  process.exit(hadError ? 1 : 0);
}

main();
