# Retire plugin docs when all registry versions are yanked

**Status:** Implemented locally
**Refs:** [#7854](https://github.com/influxdata/docs-v2/issues/7854)

## Goal

Full plugin syncs omit retired plugins from generated data and prune their
shared page and Core and Enterprise stubs, with dry-run previews and summary
rows identifying the removed files.

## Decisions

- Require every published version to explicitly have `yanked: true`.
  The registry records retirement intent; a missing README can mean an
  incomplete checkout. Missing or nonboolean flags do not authorize retirement.
- Classify retirement before deduplicating to the latest published entry.
  A yanked latest version does not retire a plugin with an active older version.
- Use the same active registry set for sync and coverage, so pruning does not
  create false coverage gaps. Coverage no longer depends on an upstream checkout.
- Keep plugins absent from the registry under manual review. Only an explicit
  retirement signal authorizes deletion. Registry fetch failures retain the
  configured transform fallback without pruning or rewriting generated data.

## Scope

Named plugin syncs retain their existing transform-only behavior.
Latest-version metadata selection for active plugins remains unchanged.

## Verification

Run `yarn test:sync-plugins`. Registry tests cover mixed, missing, nonboolean,
excluded, and all-yanked statuses. Full-sync tests run the CLI against temporary
files with present, absent, and empty upstream checkouts, checking data omission,
page retention, pruning, repeated runs, dry runs, and registry failures.
