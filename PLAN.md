# Remaining issues from the #7614 review

Three open items from the review of "Verify Markdown twins and JSON-LD entity
links on every PR".
Ephemeral: remove this file before merging to master
(`block-ephemeral-docs.yml` enforces it).

Already fixed on this branch: the converter path-filter gap, the CircleCI
converter no-op, the Flux stdlib frontmatter parity gap, and — as of the latest
commit — items 1 and 3 below plus the workflow's cost comment.

Remaining work, in order:

1. Export `BASE_URL` from `build-docs-site` (item 2, step 1). The only real
   defect left.
2. Add a production break-glass deploy script.
3. Make CircleCI master-only and drop its non-master artifact steps.

Not planned: per-page JSON-LD resolution, the structural `@id` assertion, the
fork-PR diff fix, and migrating the deploy off CircleCI.

## 1. JSON-LD `@id` resolves globally, not per page

### Finding: the global union is correct, and my review comment was wrong

I proposed per-page resolution as the stricter, more useful check.
Reading the templates shows that would be wrong for this site.

`layouts/partials/header/techarticle-jsonld.html:32` opens
`{{ with partial "product/landing.html" . }}`, so `.Permalink` on line 38 is the
*product landing page*, not the current page.
Every TechArticle therefore references `<landing>#software`.
`layouts/partials/header/softwareapplication-jsonld.html:17` emits that node
only when `eq .RelPermalink $landing.RelPermalink` — once per product.

Cross-page references are the design, and the template says why:

> A bare `@id` is a node reference, not a re-declared entity — emitting an
> inline `{@type:SoftwareApplication, name}` here would be parsed as a separate,
> incomplete SoftwareApplication and fail validation.

Per-page resolution would fail on every TechArticle page in the site.

The concern behind the comment is not void.
Google resolves structured data per document, so an off-page `isPartOf` target
enriches nothing.
That is a deliberate trade the templates already made, not a defect the checker
should relitigate.

### Plan

1. Document the reasoning in the `check-jsonld-links.js` header: references are
   resolved against the site-wide node set because the product
   `SoftwareApplication` is emitted once on the landing page and referenced by
   bare `@id` everywhere else.
   Cite both partials so the next reader does not repeat this investigation.
2. Rename the test `accepts references to nodes defined on another HTML page` to
   state the invariant rather than the mechanism, for example
   `resolves a product node referenced from a page that does not define it`.

Size: small, documentation only.

### Optional follow-up, not required for this PR

The union cannot distinguish a correct reference to the page's own product
landing node from a reference to *some other* product's node.
A Core article pointing at Enterprise's `#software` resolves and passes.

A structural assertion would catch it: for each page, every `isPartOf` and
`about` `@id` must be prefixed by that page's product landing URL.
It does catch a real class of bug, but nothing suggests the bug exists today.
Size: medium. Treat as a separate PR.

## 2. `hugo-base-url` set to production

### Finding: larger than the review comment said

The comment claimed the production base URL "verifies the exact strings
production emits", and I argued it only forfeits hardcoded-URL detection.
Both are incomplete.

`scripts/lib/base-url.js:7` resolves the base URL that `build:md` hands the Rust
converter.
It reads `BASE_URL`, `HUGO_ENV`, and `DEPLOY_ENV`, and otherwise returns
`https://docs.influxdata.com`.
It never reads Hugo's `--baseURL`.

So in `pr-ai-artifacts-check` the HTML base URL and the Markdown base URL are
set by two unrelated mechanisms that currently agree by coincidence.
Choosing production for `hugo-base-url` is what makes the coincidence hold.
This is the same failure shape as the CircleCI and Actions build definitions:
two sources of truth kept in agreement by discipline.

`pr-preview.yml` builds with a preview base URL but never runs `build:md`, so
the divergence has never been exercised.

### Plan

Do these in order.
Step 2 is unsafe before step 1.

1. **Give the two base URLs one source.**
   Have `build-docs-site` export `BASE_URL` from its `hugo-base-url` input, so
   any caller that changes one changes both.
   Where `hugo-base-url` is empty, leave `BASE_URL` unset so `detectBaseUrl()`
   keeps its current behavior.
   Size: small.

2. **Switch the gate to a sentinel base URL.**
   Once both derive from one input, a distinctive non-production host makes any
   surviving `docs.influxdata.com` in generated output provably hardcoded.
   Size: small, but see the unknown below.

3. **Optionally assert no production origin in generated artifacts.**
   Scope strictly to generated files — `sitemap-md.xml`, `llms.txt`, corpora,
   `.md` twins, JSON-LD, canonical tags.
   Do not scan prose: content legitimately links to production URLs.
   Size: medium.

### Unknown to resolve first

`scripts/lib/provenance.js:13` defines
`FALLBACK_ORIGIN = 'https://docs.influxdata.com'`, and 25 files under `scripts/`
mention the production host.
Some are parsers and scaffolding that should keep it; some may leak into
artifacts.

Before step 2, build once with a sentinel base URL and run
`check:md-coherence`, `test:markdown-completeness`, and `check:jsonld-links`
against it.
That enumerates the real fallout instead of guessing.
The JSON-LD templates are already safe: every `@id` derives from `.Permalink`,
and `layouts/` contains only six mentions of the production host, all in
comments, documentation, or the distinct `archive.` host.

## 3. CircleCI builds the branch merged with master

### Status: unverified from this environment

The CircleCI API is blocked by the session proxy (403), so I could not confirm
what commit build 26474 checked out.
Taking the statement as given.
To confirm: compare the SHA in the CircleCI build against the PR head SHA
(`96b04ce`); a merge build shows neither the head nor the base.

### What follows if it holds

It does not distinguish the two platforms.
GitHub Actions `pull_request` also builds the merge result — `actions/checkout`
resolves `refs/pull/N/merge` by default — so both platforms already gate on the
merged tree.

It does change how much the CircleCI PR status is worth.
GitHub recomputes `refs/pull/N/merge` when the base branch moves; CircleCI only
rebuilds when the branch is pushed.
A green `ci/circleci: build` therefore describes a merge with whatever master
was at the last push, and goes stale silently as master advances.
Gating merges on a stale merge-result build is a weak signal, which strengthens
rather than weakens the earlier recommendation to make CircleCI master-only once
Actions reaches build parity.

### Plan

1. Confirm the merge-build behavior from a CircleCI build page.
2. Record the finding in `.circleci/config.yml` near the `build` job, since it is
   not evident from the config.
3. Fold it into the master-only decision rather than treating it as separate
   work.

### Related robustness item

`pr-ai-artifacts-check.yml` and `pr-render-check.yml:84` both diff
`base.sha...head.sha`.
The three-dot form is stable regardless of which commit is checked out, so the
merge build does not affect it.
Fork pull requests are the gap: `head.sha` may not be present in the fetched
refs, and the diff fails.
`pr-preview.yml:148` already sidesteps this by skipping forks entirely.
Worth a shared fix; not urgent, and not part of this PR.

## Suggested sequencing

1. Item 1 documentation, and item 3 confirmation. Both are cheap.
2. Item 2 step 1, the shared `BASE_URL`. This is the real defect in this set.
3. Item 2 steps 2 and 3, after the sentinel build shows the fallout.
4. Fork-diff robustness and the structural JSON-LD assertion, as separate PRs.
