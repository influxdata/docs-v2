# Broken API link redirects — design

**Date:** 2026-04-20
**Branch:** `fix/broken-api-link-redirects`
**Issue:** [#5801](https://github.com/influxdata/docs-v2/issues/5801) + related legacy URLs

## Problem

Thirteen legacy API documentation URLs return `404` on `docs.influxdata.com` today. They were canonical URLs before PR #6622 (Migrate API reference docs to Hugo-native) restructured the API reference section. Core and Enterprise 3 got explicit redirect stubs for the `/reference/api/` path during that migration; no product got stubs for the Redoc-era `/api/v{1,2,3}/` paths. External sites, bookmarks, and search engine results still link to the legacy URLs.

Issue #5801 reports one example (`/influxdb3/cloud-serverless/reference/api/`). A user-provided example (`/influxdb/v2/api/v2/#tag/Query`) surfaced the broader `/api/v{1,2,3}/` pattern.

## Goals

- Every legacy URL that returns `404` on production today returns `200` (or `301`) after this change, landing the user on the product's canonical `/api/` page.
- No new code, no infrastructure changes, no Lambda rewrite.
- Reuse the existing `page.yml` + `generate-openapi-articles.ts` alias pipeline — the same one v1 and Enterprise v1 already use.

## Non-goals

- Preserving URL fragments. A user who bookmarked `/api/v2/#tag/Query` will land on `/api/` and scroll. Per product owner decision: "preventing 404s and getting users to the correct page" is the bar; fragments not in scope.
- Fixing legacy URLs that aren't returning `404` today. No speculative aliases for paths nobody is hitting.
- Catching every conceivable future pattern. If new 404s surface, they get added in follow-up PRs using the same mechanism.

## Scope — the 13 URLs

Confirmed 404 on `https://docs.influxdata.com` as of 2026-04-20:

| Legacy URL                                                 | Redirect target                              |
| :--------------------------------------------------------- | :------------------------------------------- |
| `/influxdb3/cloud-dedicated/reference/api/`                | `/influxdb3/cloud-dedicated/api/`            |
| `/influxdb3/cloud-serverless/reference/api/`               | `/influxdb3/cloud-serverless/api/`           |
| `/influxdb3/clustered/reference/api/`                      | `/influxdb3/clustered/api/`                  |
| `/influxdb/v2/reference/api/`                              | `/influxdb/v2/api/`                          |
| `/influxdb/cloud/reference/api/`                           | `/influxdb/cloud/api/`                       |
| `/influxdb3/core/api/v3/`                                  | `/influxdb3/core/api/`                       |
| `/influxdb3/enterprise/api/v3/`                            | `/influxdb3/enterprise/api/`                 |
| `/influxdb3/cloud-dedicated/api/v2/`                       | `/influxdb3/cloud-dedicated/api/`            |
| `/influxdb3/cloud-serverless/api/v2/`                      | `/influxdb3/cloud-serverless/api/`           |
| `/influxdb3/clustered/api/v2/`                             | `/influxdb3/clustered/api/`                  |
| `/influxdb/v2/api/v2/`                                     | `/influxdb/v2/api/`                          |
| `/influxdb/v2/api/v1/`                                     | `/influxdb/v2/api/`                          |
| `/influxdb/cloud/api/v2/`                                  | `/influxdb/cloud/api/`                       |

## Design

### Mechanism

`generate-openapi-articles.ts` already reads an `aliases` field from each product's `api-docs/<product>/content/page.yml` and writes it to the generated `/api/_index.md` frontmatter. Hugo emits an HTML meta-refresh stub at each alias path at build time.

No template, generator, or template partial changes needed. The feature is already wired — we're just adding data.

### File changes

Seven `page.yml` files:

**Edit existing (add `aliases:` list):**
- `api-docs/influxdb3/cloud-dedicated/content/page.yml`
- `api-docs/influxdb3/cloud-serverless/content/page.yml`
- `api-docs/influxdb3/clustered/content/page.yml`

**Create new (minimal file, `aliases:` only):**
- `api-docs/influxdb3/core/content/page.yml`
- `api-docs/influxdb3/enterprise/content/page.yml`
- `api-docs/influxdb/v2/content/page.yml`
- `api-docs/influxdb/cloud/content/page.yml`

Example (v2):

```yaml
# api-docs/influxdb/v2/content/page.yml
aliases:
  - /influxdb/v2/reference/api/
  - /influxdb/v2/api/v2/
  - /influxdb/v2/api/v1/
```

After the edits, run `bash api-docs/generate-api-docs.sh` to regenerate article content. The aliases land in each product's generated `content/<product>/api/_index.md`. Those generated files are gitignored (intentional — they're build output). Only the `page.yml` source changes get committed.

### Risks and mitigations

1. **Alias conflicts with generated tag pages.** If a tag happens to slugify to `v1`, `v2`, or `v3`, a real page would live at `/api/v1/` and shadow our alias. Mitigation: check each product's generated tag slugs before committing. Audit is cheap — `ls content/<product>/api/` after regeneration.

2. **Alias vs. Hugo section resolution.** Hugo prefers real pages over aliases. If any legacy URL happens to match a Hugo section boundary, the alias is ignored. Mitigation: build locally and verify each of the 13 URLs returns 200/301 with correct redirect target.

3. **Future pattern drift.** This fix addresses the 13 known 404s. If `getswagger.sh` is re-run upstream and introduces a new Redoc-era URL pattern, we'd see new 404s. Mitigation: add Cypress assertions so a future regression is caught at PR time.

## Verification

1. **Local build.** Run `yarn build:api-docs` and `npx hugo --quiet`. For each of the 13 legacy URLs, assert a `200` response whose body contains a `meta http-equiv="refresh"` tag pointing at the expected canonical `/api/` path. (Hugo aliases return the refresh-stub page with status `200`, not `301`.)
2. **Cypress regression test.** Add to `cypress/e2e/content/api-reference.cy.js`:
   - Iterate the 13 URLs. For each, `cy.visit` and assert the final URL matches the expected canonical `/api/` page.
3. **Link-checker confirmation.** Run `link-checker check public/ --config .ci/link-checker/production.lycherc.toml` and confirm none of the 13 URLs appear as errors.

## Rollout

Single PR off `master`. No feature flag, no staged rollout — redirects are additive and idempotent. Merges and deploys through the standard docs pipeline.

## Out of scope / follow-ups

- **Hash-fragment preservation.** If we later decide to land users at the right operation tag (not just the `/api/` section root), that's a client-side JS shim on the landing page — separate PR.
- **Legacy URL audit automation.** A CI check that enumerates aliases and verifies each returns 200. Useful, but deferred until a second instance of this issue shows up.
- **Lambda@Edge / CloudFront rewrites.** Mentioned as an option and rejected. Hugo aliases are simpler for a static, known list and keep redirects reviewable in the docs repo.
