# Plan: npm Supply-Chain Security — Lockfile Lint

## Goal

Add a PR check that validates `yarn.lock` against trusted registries,
preventing lockfile injection attacks (modified `resolved` URLs pointing
to attacker-controlled hosts).

## Scope decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | Lockfile-lint only | See "Cooldown abandoned" below |
| Dependabot | Skip — handled at org level | Already configured organization-wide |
| Enforcement | PR check (GitHub Actions) | Cannot be bypassed; no local friction |
| Workflow style | Dedicated `pr-lockfile-lint.yml` | Separate concern, separate trigger path |
| lockfile-lint install | `npx` with pinned version | Zero new dependencies in `package.json` |
| Pinned version | `lockfile-lint@5.0.0` | Latest stable, published with provenance via GitHub Actions OIDC |

## Cooldown abandoned (originally Step 1)

The original plan included adding `.npmrc` with `min-release-age=3`.
Dropped after verification revealed two independent reasons it provides
zero runtime protection to this repo today:

1. **Yarn Classic v1 ignores the setting.** Yarn Classic was frozen in
   early 2022; npm CLI 11.10.0 added `min-release-age` in late 2025.
   Yarn Classic reads `.npmrc` only for registry URL and auth tokens,
   not arbitrary npm resolution config. Verified empirically — `yarn
   install --frozen-lockfile` runs cleanly with `.npmrc` present and
   silently ignores the key.

2. **Node 22.x bundles npm 10.9.7** (verified from `deps/npm/package.json`
   on the `v22.x` branch of `nodejs/node`). The one workflow in this repo
   that uses `npm install` (`auto-label.yml`) pins `node-version: '22'`,
   so even if it did use an `.npmrc`, the bundled npm is too old to
   understand `min-release-age`. Node 24.x ships npm 11.11.0 and would
   work, but upgrading `auto-label.yml` is out of scope for this PR.

Real cooldown protection for this repo requires migrating away from
Yarn Classic. Tracked separately — see "Follow-up: pnpm migration".

## Steps

### Step 1: Create `pr-lockfile-lint.yml` workflow

Create `.github/workflows/pr-lockfile-lint.yml` that:

- Triggers on PRs that modify `yarn.lock`
- Checks out the repo (no auth, shallow)
- Runs `npx --yes lockfile-lint@5.0.0` against `yarn.lock`
- Validates: all resolved URLs use HTTPS and resolve to
  `registry.yarnpkg.com` (the `yarn` alias)
- Fails the check if any URL is non-HTTPS or points to an untrusted host

### Step 2: Verify

- Baseline check: `grep 'resolved ' yarn.lock | grep -v 'https://registry.yarnpkg.com/'`
  currently returns zero matches (802 entries, all clean). The first
  run of the check must pass.
- `actionlint` validates workflow syntax.
- Open this PR; confirm the `Lockfile Lint` check appears and passes.

## Follow-up: pnpm migration (separate PR)

Real cooldown protection — plus several additional security benefits —
requires migrating from Yarn Classic to pnpm. Tracked separately.
Summary of what pnpm provides that Yarn Classic does not:

- **First-class `minimumReleaseAge` cooldown** with exclude list support
- **Post-install scripts disabled by default** (explicit allowlist via
  `onlyBuiltDependencies`)
- **`trustPolicy: no-downgrade`** — detects when a package's publish-time
  trust level decreases (e.g., previously via GitHub Actions OIDC,
  now without provenance)
- **Stricter peer dependency resolution** (catches latent issues)
- **Faster installs** via content-addressable store
- **Drop-in compatible** with this PR's `lockfile-lint` check

Migration scope for docs-v2 (single-package repo, no workspaces):

- 14 workflow files: `yarn install --frozen-lockfile` → `pnpm install --frozen-lockfile`
- Lockfile: `yarn.lock` → `pnpm-lock.yaml` (regenerated fresh)
- New config: `pnpm-workspace.yaml` (optional but needed for cooldown/trust config)
- Developer onboarding: `corepack enable` (built into Node 16+)
- Risk: stricter peer deps may surface latent issues; mitigated by
  running full test suite before merge

## Out of scope (future work)

### Medium priority

- **Add `lint:lockfile` to lefthook pre-push** — local enforcement as
  belt-and-suspenders alongside the PR check. Skippable with
  `LEFTHOOK=0`, so lower priority than CI.
- **Pin version ranges** — replace `^` and `>=` with exact versions for
  production dependencies in `package.json`. High churn, moderate risk
  reduction.

### Low priority

- **Install npq or sfw globally** — document recommended developer
  machine hardening for ad-hoc `npm install` commands.
- **Document the postinstall exemption** — explain in CONTRIBUTING or
  CLAUDE.md why `--ignore-scripts` cannot be used globally (the repo's
  `postinstall` script sets up the `docs` CLI).
