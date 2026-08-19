# CI work from the #7614 review

Ephemeral: remove this file before merging to master
(`block-ephemeral-docs.yml` enforces it).

All of the work below is on one branch because the session was constrained to
`claude/pr-7614-circleci-review-xns5yq`.
It is intended as four separate pull requests, and each commit is
self-contained.

## Belongs in #7614

- Build the Rust converter from source only when its source changes, with an
  `actions/cache` step (`RUST_MARKDOWN_CONVERTER_SOURCE`).
- Document why JSON-LD `@id` resolves site-wide; rename the test after the
  invariant.
- Correct two claims in the workflow header: the reason not to fold into
  `pr-render-check` is its unfiltered path scope, not cost; the production
  `hugo-base-url` does not verify production strings.

## Split out: separate pull requests

1. **Compile the Rust converter in CircleCI and the release workflow.**
   The toolchain was installed and never used, so production shipped twins
   built by the last released binary rather than the tree.
2. **Inject Flux stdlib frontmatter in `build-docs-site`.**
   466 pages and 1244 alias redirects were missing from every Actions build.
3. **Derive `BASE_URL` from `hugo-base-url`.**
   Hugo and `build:md` took their base URL from unrelated sources that agreed
   by coincidence. Byte-identical output today.
4. **Add the break-glass production deploy script.**
   Independent of the CircleCI questions; ship it whenever.
5. **Make the CircleCI `build` job master-only.**
   Land this last, and only after 1 and 2 are merged — they are what make the
   Actions build a fair substitute for the production build.

## Open decisions

**Does CircleCI on pull requests ever catch something Actions misses?**
This determines whether item 5 is correct as written.
If it has caught unique failures, prefer the middle option: keep the job on
pull requests but strip it to only what Actions does not cover, realistically
just the deploy-safety floors.
Nobody has this data; check before merging item 5.

**Is `ci/circleci: build` a required status in branch protection?**
If it is, item 5 removes a required check and branch protection needs updating
in the same change, or pull requests will wait on a status that never reports.

**Does CircleCI build the branch merged with master?**
Unverified — the CircleCI API is blocked from the session that did this work.
Compare a build's SHA against the pull request head SHA.
Nothing here depends on the answer; it only affects how much the pre-merge
CircleCI signal was worth, and so how easy item 5 is to accept.

## Not planned

- Per-page JSON-LD `@id` resolution. Would fail on every article page.
- The structural `@id` assertion (reference must be under the page's own
  product landing URL). Real bug class, no evidence it occurs.
- Switching the gate to a sentinel base URL. Now unblocked by item 3, but do a
  trial build first to enumerate fallout from
  `scripts/lib/provenance.js` `FALLBACK_ORIGIN`.
- Fork-pull-request `git diff` robustness in `pr-ai-artifacts-check` and
  `pr-render-check`. Shared latent issue, not urgent.
- Migrating the deploy off CircleCI. Item 4 gets the availability benefit
  without the IAM work.
- A scheduled workflow to refresh `data/flux_influxdb_versions.yml` and commit
  it, replacing CircleCI's build-time `update-flux-versions.cjs`. Worth doing;
  needs a decision on the token.
