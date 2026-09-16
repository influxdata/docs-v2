#!/usr/bin/env node
/**
 * check-release-gate.js
 *
 * Blocking check: a pull request that bumps a gated version in
 * data/products.yml must carry an approving review from a member of the
 * release team named in .ci/release-gates.yml.
 *
 * Why this exists:
 *   The `latest_patch` / `latest_patches` values feed the {{< latest-patch >}}
 *   shortcode, which builds every dl.influxdata.com download URL and the
 *   version strings in install and code examples. For gated products the bump
 *   is the publish switch, and only the release team knows when the package is
 *   greenlit for all customers. Every earlier observable event (release
 *   candidate to specific customers, Docker publish, Cloud deployment) is a
 *   false positive. So the gate is not a date or a label anyone can apply: it
 *   is an approving review from that team, on the record, on the PR.
 *
 * Modes:
 *   --print-teams   Print the teams whose gates are triggered by this diff,
 *                   one per line, and exit 0. Prints nothing when no gated
 *                   field changed. The workflow uses this to resolve only the
 *                   teams it needs.
 *   (default)       Evaluate the gates and print a Markdown report. Exit 1
 *                   when any triggered gate lacks an approval, or when a
 *                   triggered gate's team could not be resolved (fail closed).
 *
 * Usage:
 *   node .ci/scripts/check-release-gate.js \
 *     --base /tmp/products-old.yml --head data/products.yml \
 *     [--gates .ci/release-gates.yml] \
 *     [--reviews reviews.json] [--members members.json] [--print-teams]
 *
 *   reviews.json   The GitHub REST list for the PR: GET /pulls/{n}/reviews.
 *   members.json   { "org/slug": ["login", ...] | null }. null means the team
 *                  could not be resolved.
 *
 * Review semantics mirror GitHub's: the latest APPROVED, CHANGES_REQUESTED, or
 * DISMISSED review per user decides; COMMENTED reviews do not change state.
 * Stale approvals are not re-checked against the head commit here. Turn on
 * "Dismiss stale pull request approvals when new commits are pushed" in branch
 * protection so a push after approval re-closes the gate.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const DEFAULT_GATES = join(REPO_ROOT, '.ci', 'release-gates.yml');

/** Read a dotted path such as `latest_patches.v1` from an object. */
export function getPath(obj, dotted) {
  return dotted.split('.').reduce((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined;
    return acc[key];
  }, obj);
}

/**
 * A version value the shortcode can use: a non-empty scalar. null, an empty
 * or whitespace-only string, and a nested map or list are not versions.
 * The shortcode renders them as nothing, which blanks download URLs.
 */
export function isUsableVersion(value) {
  if (value == null) return false;
  if (typeof value === 'object') return false;
  return String(value).trim().length > 0;
}

/**
 * Which gated fields changed between two parsed products.yml objects.
 * Returns one entry per triggered gate. A field that is absent on both sides,
 * or unchanged, does not trigger. A change to an unusable value (null, empty,
 * nested) is flagged `invalid`; no approval can satisfy it.
 */
export function gatedBumps(oldProducts, newProducts, gates) {
  const bumps = [];
  for (const [product, gate] of Object.entries(gates || {})) {
    if (!gate || typeof gate !== 'object' || !gate.field || !gate.team) {
      throw new Error(
        `release-gates: entry "${product}" needs "field" and "team"`
      );
    }
    const before = getPath(oldProducts?.[product], gate.field);
    const after = getPath(newProducts?.[product], gate.field);
    const from = isUsableVersion(before) ? String(before).trim() : null;
    const to = isUsableVersion(after) ? String(after).trim() : null;
    const invalid = !isUsableVersion(after) && after !== before;
    if (from !== to || invalid) {
      bumps.push({
        product,
        field: gate.field,
        from,
        to,
        invalid,
        team: gate.team,
        note: (gate.note || '').trim(),
      });
    }
  }
  return bumps;
}

/**
 * Collapse a PR's reviews to the latest decisive state per user login.
 * Decisive states: APPROVED, CHANGES_REQUESTED, DISMISSED. COMMENTED and
 * PENDING are ignored. Reviews are ordered by submitted_at, then by id, so a
 * later dismissal or change request supersedes an earlier approval.
 */
export function latestReviewStates(reviews) {
  const decisive = new Set(['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED']);
  const ordered = [...(reviews || [])]
    .filter((r) => r && r.user && r.user.login && decisive.has(r.state))
    .sort((a, b) => {
      const ta = Date.parse(a.submitted_at || 0) || 0;
      const tb = Date.parse(b.submitted_at || 0) || 0;
      if (ta !== tb) return ta - tb;
      return (a.id || 0) - (b.id || 0);
    });
  const states = new Map();
  for (const r of ordered) states.set(r.user.login, r.state);
  return states;
}

/**
 * Evaluate triggered gates against reviews and resolved team members.
 * Returns one result per bump:
 *   { ...bump, status, approvedBy }
 * status is one of:
 *   'approved'    a team member's latest decisive review is APPROVED
 *   'missing'     no such approval
 *   'unresolved'  members[team] was null or absent: the gate fails closed
 *   'invalid'     the new value is unusable (null, empty, nested); no
 *                 approval can satisfy it
 */
export function evaluate(bumps, reviews, members) {
  const states = latestReviewStates(reviews);
  return bumps.map((bump) => {
    if (bump.invalid) {
      return { ...bump, status: 'invalid', approvedBy: [] };
    }
    const team = members?.[bump.team];
    if (!Array.isArray(team)) {
      return { ...bump, status: 'unresolved', approvedBy: [] };
    }
    const lower = new Set(team.map((l) => String(l).toLowerCase()));
    const approvedBy = [...states.entries()]
      .filter(([login, state]) => {
        return state === 'APPROVED' && lower.has(login.toLowerCase());
      })
      .map(([login]) => login);
    return {
      ...bump,
      status: approvedBy.length ? 'approved' : 'missing',
      approvedBy,
    };
  });
}

/** Markdown report for the step summary and the failure annotation. */
export function formatReport(results) {
  const lines = ['## Release gate', ''];
  if (!results.length) {
    lines.push('No gated version bump in this pull request.');
    return lines.join('\n');
  }
  for (const r of results) {
    const change = `\`${r.product}.${r.field}\`: ${r.from ?? '(none)'} → ${r.to ?? '(none)'}`;
    if (r.status === 'approved') {
      lines.push(
        `- ✅ ${change} — approved by ${r.approvedBy.map((l) => `@${l}`).join(', ')} (${r.team})`
      );
    } else if (r.status === 'missing') {
      lines.push(
        `- ❌ ${change} — needs an approving review from a member of \`@${r.team}\`.`
      );
    } else if (r.status === 'invalid') {
      lines.push(
        `- ❌ ${change} — the new value is empty or not a version. The \`latest-patch\` shortcode would render nothing and every download URL for this product would break. Set a version or revert the change; approval cannot clear this.`
      );
    } else {
      lines.push(
        `- ❌ ${change} — cannot resolve members of \`@${r.team}\`. Check that the \`RELEASE_GATE_ORG_TOKEN\` secret exists, has \`read:org\`, and that the team slug is correct. The gate fails closed until it can.`
      );
    }
    if (r.note && r.status !== 'approved') {
      lines.push('', `  ${r.note.replace(/\s+/g, ' ')}`, '');
    }
  }
  return lines.join('\n');
}

function parseArgs(argv) {
  const args = { gates: DEFAULT_GATES, printTeams: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--print-teams') args.printTeams = true;
    else if (a.startsWith('--')) args[a.slice(2)] = argv[++i];
  }
  return args;
}

/**
 * Parse a YAML file or throw. A products.yml that cannot be read or parsed
 * must stop the check with a clear error, not be treated as empty: empty
 * would report every gated version as removed and hide the real problem.
 */
function loadYaml(path) {
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch (e) {
    throw new Error(`cannot read ${path}: ${e.message}`);
  }
  let data;
  try {
    data = yaml.load(text);
  } catch (e) {
    throw new Error(`cannot parse ${path}: ${e.message}`);
  }
  if (data == null || typeof data !== 'object') {
    throw new Error(`${path} is empty or not a YAML mapping`);
  }
  return data;
}

function loadJson(path, fallback) {
  if (!path) return fallback;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.base || !args.head) {
    console.error(
      'usage: check-release-gate.js --base <old.yml> --head <new.yml>'
    );
    process.exit(2);
  }
  let bumps;
  try {
    bumps = gatedBumps(
      loadYaml(args.base),
      loadYaml(args.head),
      loadYaml(args.gates)
    );
  } catch (e) {
    console.error(`::error::Release gate: ${e.message}`);
    process.exit(2);
  }

  if (args.printTeams) {
    for (const team of new Set(bumps.map((b) => b.team))) console.log(team);
    return;
  }

  const reviews = loadJson(args.reviews, []);
  const members = loadJson(args.members, {});
  const results = evaluate(bumps, reviews, members);
  const report = formatReport(results);
  console.log(report);

  const blocked = results.filter((r) => r.status !== 'approved');
  for (const r of blocked) {
    const why = {
      missing: `needs approval from a member of @${r.team}`,
      invalid:
        'new value is empty or not a version; approval cannot clear this',
      unresolved: `cannot resolve @${r.team}; gate fails closed`,
    }[r.status];
    console.log(
      `::error::Release gate: ${r.product}.${r.field} → ${r.to} ${why}`
    );
  }
  process.exit(blocked.length ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
