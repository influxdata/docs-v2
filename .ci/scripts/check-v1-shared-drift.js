#!/usr/bin/env node
/**
 * Divergence ratchet for the InfluxDB v1 shared-content migration.
 *
 * InfluxDB v1 OSS (content/influxdb/v1) and v1 Enterprise
 * (content/enterprise_influxdb/v1) still keep two copies of some pages. Those
 * copies drifted silently for years because nothing tied them together. The
 * pages listed in .ci/v1-shared-drift-manifest.json are scheduled to become
 * shared content; until they do, this check keeps them from drifting further.
 *
 * The rule is a ratchet, not a sync requirement: a pair's divergence may stay
 * the same or shrink, never grow. Demanding the pair be identical would be
 * unachievable, because the listed pairs are already hundreds of lines apart --
 * an author fixing one typo would have to reconcile all of it.
 *
 * Divergence is measured after normalizing the two things that legitimately
 * differ between editions:
 *   - the product URL root (/influxdb/v1/ vs /enterprise_influxdb/v1/)
 *   - front matter (menu keys, alt_links, and other per-edition metadata)
 *
 * Usage:
 *   node .ci/scripts/check-v1-shared-drift.js --base <git-ref>
 *   node .ci/scripts/check-v1-shared-drift.js --report
 *
 * Exit codes: 0 = no pair got worse, 1 = at least one pair diverged further.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const MANIFEST = '.ci/v1-shared-drift-manifest.json';

export function stripFrontMatter(text) {
  const m = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(text);
  return m ? text.slice(m[0].length) : text;
}

export function normalize(text) {
  return stripFrontMatter(text).replace(
    /\/(?:influxdb|enterprise_influxdb)\/v1\//g,
    '/product/version/'
  );
}

/** Number of added plus removed lines between two texts, via LCS. */
export function divergence(a, b) {
  const x = normalize(a).split('\n');
  const y = normalize(b).split('\n');
  // Longest common subsequence length via dynamic programming.
  const n = x.length;
  const m = y.length;
  let prev = new Uint32Array(m + 1);
  let cur = new Uint32Array(m + 1);
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      cur[j] =
        x[i - 1] === y[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    }
    [prev, cur] = [cur, prev];
    cur.fill(0);
  }
  const common = prev[m];
  return n - common + (m - common);
}

function readManifest() {
  return JSON.parse(readFileSync(MANIFEST, 'utf8'));
}

function readAt(ref, file) {
  if (ref === null) return existsSync(file) ? readFileSync(file, 'utf8') : null;
  try {
    return execFileSync('git', ['show', `${ref}:${file}`], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return null; // file did not exist at that ref
  }
}

function measure(ref, manifest) {
  const out = new Map();
  for (const rel of manifest.pairs) {
    const oss = readAt(ref, path.posix.join(manifest.oss_root, rel));
    const ent = readAt(ref, path.posix.join(manifest.enterprise_root, rel));
    if (oss === null || ent === null) continue; // migrated or removed
    out.set(rel, divergence(oss, ent));
  }
  return out;
}

function main(argv) {
  const manifest = readManifest();
  const baseIdx = argv.indexOf('--base');
  const head = measure(null, manifest);

  if (baseIdx === -1) {
    const total = [...head.values()].reduce((a, b) => a + b, 0);
    console.log(
      `InfluxDB v1 shared-content worklist: ${head.size} pairs, ${total} diverging lines`
    );
    for (const [rel, n] of [...head].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(n).padStart(5)}  ${rel}`);
    }
    return 0;
  }

  const base = measure(argv[baseIdx + 1], manifest);
  const worse = [];
  for (const [rel, n] of head) {
    const was = base.get(rel);
    if (was !== undefined && n > was) worse.push({ rel, was, now: n });
  }

  if (worse.length === 0) {
    console.log(`No v1 pair diverged further (${head.size} pairs checked).`);
    return 0;
  }

  for (const { rel, was, now } of worse) {
    console.log(
      `::error file=${path.posix.join(manifest.oss_root, rel)}::` +
        `${rel} diverged further between InfluxDB v1 OSS and v1 Enterprise ` +
        `(${was} -> ${now} lines). Apply the change to both copies, or migrate ` +
        `the page to content/shared/influxdb-v1/ and remove it from ${MANIFEST}.`
    );
  }
  return 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(main(process.argv.slice(2)));
}
