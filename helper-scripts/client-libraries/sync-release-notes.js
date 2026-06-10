#!/usr/bin/env node
// Reads a client repo's CHANGELOG.md, runs the transform, and writes the
// shared source file. Designed to run from the docs-v2 repo root.

import {
  readFileSync,
  writeFileSync,
  appendFileSync,
  existsSync,
  mkdirSync,
} from 'node:fs';
import { randomBytes } from 'node:crypto';
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

// `warning` and `error` indicate likely upstream drift (renamed CHANGELOG,
// changed heading format) and must fail the job. `skipped` means the source
// file is genuinely absent — surfaced but non-fatal so onboarding a new client
// before its first CHANGELOG ships doesn't break the nightly.
const FATAL_STATUSES = new Set(['warning', 'error']);
const ATTENTION_STATUSES = new Set(['skipped', 'warning', 'error']);

/**
 * Escape special characters in GitHub Actions workflow command properties
 * (title, etc.). Colons and commas delimit command metadata fields.
 */
function escapeWorkflowCommandProperty(s) {
  return String(s)
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A')
    .replace(/:/g, '%3A')
    .replace(/,/g, '%2C');
}

/**
 * Escape special characters in GitHub Actions workflow command message bodies.
 */
function escapeWorkflowCommandData(s) {
  return String(s)
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A');
}

/**
 * Sanitize a value for use inside a GitHub Flavored Markdown table cell.
 * Pipe characters would break the column structure; newlines would break the row.
 */
function sanitizeTableCell(s) {
  return String(s ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

function formatSummary(results) {
  const rows = results.map((r) => {
    const detail =
      r.status === 'updated'
        ? `latest: \`${sanitizeTableCell(r.latestVersion)}\``
        : r.status === 'unchanged'
          ? `latest: \`${sanitizeTableCell(r.latestVersion)}\``
          : sanitizeTableCell(r.reason ?? '');
    return `| \`${r.client}\` | ${r.status} | ${detail} |`;
  });
  return [
    '| Client | Status | Detail |',
    '| --- | --- | --- |',
    ...rows,
  ].join('\n');
}

function emitAnnotations(results) {
  for (const r of results) {
    if (r.status === 'error' || r.status === 'warning') {
      console.log(
        `::error title=${escapeWorkflowCommandProperty(`Client release-notes sync (${r.client})`)}::${escapeWorkflowCommandData(r.reason)}`
      );
    } else if (r.status === 'skipped') {
      console.log(
        `::warning title=${escapeWorkflowCommandProperty(`Client release-notes sync (${r.client})`)}::${escapeWorkflowCommandData(r.reason)}`
      );
    }
  }
}

function writeStepOutputs(outputs) {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;
  const lines = [];
  for (const [key, value] of Object.entries(outputs)) {
    if (typeof value === 'string' && value.includes('\n')) {
      const delim = `EOF_${randomBytes(8).toString('hex')}`;
      lines.push(`${key}<<${delim}`, value, delim);
    } else {
      lines.push(`${key}=${value}`);
    }
  }
  appendFileSync(file, lines.join('\n') + '\n');
}

function writeStepSummary(markdown) {
  const file = process.env.GITHUB_STEP_SUMMARY;
  if (!file) return;
  appendFileSync(file, markdown + '\n');
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

  const summary = formatSummary(results);
  const needsAttention = results.some((r) => ATTENTION_STATUSES.has(r.status));

  emitAnnotations(results);
  writeStepSummary(`## Client library release-notes sync\n\n${summary}`);
  writeStepOutputs({
    needs_attention: needsAttention ? 'true' : 'false',
    summary,
  });

  const hadFatal = results.some((r) => FATAL_STATUSES.has(r.status));
  process.exit(hadFatal ? 1 : 0);
}

main();
