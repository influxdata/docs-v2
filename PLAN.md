# Yarn Berry migration: requirements and tradeoffs

Ephemeral analysis for a decision. Remove before merging to `master` — a
required check blocks `PLAN.md` from the default branch.

## The question

The proactive dependency plan proposed bolting several tools onto Yarn Classic:
`osv-scanner` for multi-ecosystem vulnerability scanning, `knip` for unused
dependencies, `yarn-deduplicate` because `yarn dedupe` does not exist on Yarn 1.
Would migrating to Yarn Berry (4.x) replace enough of that to be the better
move?

Short answer: no. Berry replaces one of the three tools and leaves the largest
gap untouched. It is worth doing for one specific security capability, but that
capability is available more cheaply another way.

## Current state

| Fact | Value |
| --- | --- |
| Package manager | Yarn Classic 1.22.22 (`packageManager` field; `yarn.lock` header `# yarn lockfile v1`) |
| Root direct dependencies | 13 runtime, 28 dev, 15 `resolutions` |
| Root lockfile entries | 757 |
| npm projects in repo | 5, each with its own lockfile, none declared as workspaces |
| Other ecosystems | `Cargo.lock`, `test/pytest/requirements.txt` |
| `--frozen-lockfile` call sites | 25 occurrences across 16 files |

Berry artifacts are already committed and inert: `.yarnrc.yml`
(`nodeLinker: node-modules`, `enableScripts: true`, `approvedGitRepositories`)
and `.yarn/install-state.gz`, a generated cache file that should never have been
tracked. Yarn 1 reads `.yarnrc`, not `.yarnrc.yml`, so neither file does
anything today. Someone started this migration and stopped.

## What Berry actually buys, checked against this repo

### Lockfile integrity — no gain

This looked like the strongest argument and it does not survive checking. All
757 entries in the existing `yarn.lock` already carry an `integrity` sha512
field and a `#hash` fragment on the `resolved` URL, and Yarn 1 verifies them on
install. Berry stores the same guarantee in a different format. There is no
integrity improvement to be had here.

### Granular postinstall control — the one real gain

Berry supports `enableScripts: false` globally with a per-package allowlist:

```yaml
# .yarnrc.yml
enableScripts: false
```

```json
// package.json
"dependenciesMeta": {
  "hugo-extended": { "built": true }
}
```

Yarn 1 offers only all-or-nothing `--ignore-scripts`. Given that the threat model
for this repo is CI compromise through a malicious lifecycle script, this is the
capability that matters. Today every one of the 757 packages may run arbitrary
code on every install, on developer machines and in the CircleCI job whose
output is deployed to production.

### `yarn dedupe --check` — small gain

Native on Berry, replacing the `yarn-deduplicate` bolt-on. Convenience, not
capability.

### `yarn npm audit` — no meaningful gain

Better flags than Yarn 1's `yarn audit` (`--severity`, `--environment`,
`--recursive`), but the same npm advisory database underneath. It still sees
only npm packages, and only in the project it is run from. It does not cover
`Cargo.lock`, `requirements.txt`, or the four non-root npm lockfiles.

### `yarn constraints` — conditional gain

Declarative rules enforced across workspaces, for example "no package may
declare a dependency the root does not pin". Genuinely useful, but only if the
repo adopts workspaces. See below.

### What Berry does not touch

`knip` is still needed. Unused-dependency detection is not a package-manager
feature.

`osv-scanner` is still needed. This repo has three ecosystems and five npm
lockfiles; no Yarn version scans across them.

So of the three tools the plan proposed, Berry replaces `yarn-deduplicate` and
nothing else.

## Costs

### PnP is off the table, which removes most of Berry's headline benefits

`hugo-extended` runs a `postinstall` that downloads the Hugo binary, and the
repo invokes it as `yarn hugo`. Plug'n'Play breaks binary-shipping packages of
this shape. The existing `.yarnrc.yml` already concedes this with
`nodeLinker: node-modules`.

This is the crux of the decision. With the node-modules linker, Berry is Yarn 1
with a better CLI, a different lockfile format, and script controls. Zero-installs,
strict dependency resolution, and the install-speed gains all require PnP.

### Mechanical migration surface

- 25 `--frozen-lockfile` → `--immutable`, across `.circleci/config.yml`, ten
  GitHub Actions workflows, `.github/actions/setup-docs-env/action.yml`, two
  Claude hooks (`session-start.sh`, `sync-worktree-deps.sh`),
  `.ci/remark/remark.sh`, and `scripts/build-rust-converter.js`.
- `scripts/check-package-manager.js` hardcodes "yarn 1.22.22" in its message.
- CircleCI caches `~/.cache/yarn`, keyed on three lockfile checksums. Berry
  caches elsewhere; leave this unchanged and production builds silently lose
  their dependency cache.
- Three Dockerfiles plus `.ci/Dockerfile.remark`.
- `DOCS-CONTRIBUTING.md` install instructions. This repo takes external
  contributions, so the migration is visible to people who did not ask for it.

### Lockfile diff is unreviewable

`yarn.lock` regenerates entirely: 253 KB, 757 entries, every line changed. The
PR can be accepted on trust or not at all. Worth pairing with a verification
step that resolved versions did not move — but that step has to be written.

### `pr-lockfile-lint.yml` needs re-evaluation

The workflow runs `lockfile-lint@5.0.0` with `--type yarn` against the Yarn 1
format, checking that every `resolved` URL is HTTPS and points at
`registry.yarnpkg.com`. **Verify Berry-format support before migrating.** If it
does not parse Berry lockfiles, this check either needs replacing or dropping,
and it is currently the most carefully hardened workflow in the repo.

### Yarn binary distribution is an unresolved operational choice

Berry expects either a committed `.yarn/releases/yarn-x.y.z.cjs` (roughly 2.5 MB
of vendored JavaScript in the repo — awkward given this plan just deleted an
89 KB vendored jQuery) or Corepack. Corepack ships with Node 22 but has been
unbundled from newer Node. Neither option is clean.

## Recommendation

**Do not migrate now.** The one capability worth having — turning off lifecycle
scripts by default — can be had today at a fraction of the cost.

Yarn 1 supports `--ignore-scripts` per invocation. Part 1c of the dependency
plan already proposed auditing which of the twelve CI jobs running `yarn install`
actually need `postinstall`. Doing that gets most of the security benefit with a
change measured in lines, not in a repo-wide migration. The jobs that need
scripts are the ones building the site; the ones running a linter or a link
check do not.

Two things to do regardless of the Berry decision:

1. **Untrack `.yarn/install-state.gz` and `.yarnrc.yml`.** They are inert under
   Yarn 1, and a committed `.yarnrc.yml` that does nothing is a trap — the next
   person to read it will assume Berry settings are in effect. If Berry is
   deferred, add `.yarn/` to `.gitignore` and delete both.

2. **Consider Yarn workspaces, independent of Berry.** Yarn 1 has workspaces
   too. Folding the five npm projects into one workspace root would collapse
   five lockfiles into one, give a single audit surface, and reduce the proposed
   Dependabot config from five npm entries to one. This is the largest
   structural win available and it does not require Berry at all. It is also
   not free: `api-docs/` and `.ci/remark-lint/` are deliberately isolated, and
   `sync-plugins.yml` and `pr-remark-check.yml` install into them with npm.

**Revisit Berry if** PnP ever becomes viable (Hugo installed outside npm would
remove the blocker), or if workspaces are adopted and `yarn constraints` becomes
worth the migration on its own.

## Related finding

`hugo-extended`'s installer downloads the Hugo binary and verifies it against a
`checksums.txt` fetched from the same GitHub release — the same pattern just
fixed in `scripts/build-rust-converter.js`. It is third-party code, so it is not
directly fixable here, and the trust boundary is the Hugo project's release
infrastructure, which this repo depends on regardless. Noted for completeness,
not proposed as work. `HUGO_SKIP_DOWNLOAD` is available if the binary is ever
provisioned another way.
