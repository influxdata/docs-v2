# Broken API Link Redirects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make 13 known-legacy API documentation URLs redirect to the product's canonical `/api/` page instead of returning 404.

**Architecture:** Extend each product's existing `api-docs/<product>/content/page.yml` overlay with an `aliases:` list. `generate-openapi-articles.ts` already reads this field (lines 705-706) and writes it to the generated `content/<product>/api/_index.md` frontmatter. Hugo emits HTML meta-refresh stubs at each alias path at build time. No new code, no templates, no Lambda.

**Tech Stack:** Hugo aliases, YAML overlay, Cypress for regression testing, the docs-v2 `generate-api-docs.sh` pipeline.

**Spec:** [`docs/superpowers/specs/2026-04-20-broken-api-link-redirects-design.md`](../specs/2026-04-20-broken-api-link-redirects-design.md)

---

## File Map

**Edit existing `page.yml` (add `aliases:` field):**

- `api-docs/influxdb3/cloud-dedicated/content/page.yml`
- `api-docs/influxdb3/cloud-serverless/content/page.yml`
- `api-docs/influxdb3/clustered/content/page.yml`

**Create new `page.yml` (minimal file, `aliases:` only):**

- `api-docs/influxdb3/core/content/page.yml`
- `api-docs/influxdb3/enterprise/content/page.yml`
- `api-docs/influxdb/v2/content/page.yml`
- `api-docs/influxdb/cloud/content/page.yml`

**Modify test file:**

- `cypress/e2e/content/api-reference.cy.js` — add a regression `describe` block

**No changes to:**

- `api-docs/scripts/generate-openapi-articles.ts` — already reads `aliases` from `page.yml`
- Any Hugo layout, partial, or shortcode
- Any TypeScript or JavaScript source

---

## Task Ordering

TDD sequence:

1. Write failing Cypress test covering all 13 redirects.
2. Add aliases to existing `page.yml` files (3 files).
3. Create new `page.yml` files with aliases (4 files).
4. Regenerate API content.
5. Rerun Cypress — all 13 pass.
6. Link-checker spot-check.
7. Commit and push, open PR.

---

### Task 1: Failing Cypress regression test

**Files:**
- Modify: `cypress/e2e/content/api-reference.cy.js` (append one new `describe` block at end of file, before the final `});` if wrapped)

**Why a failing test first:** locks in the exact behavior change. If someone reverts or deletes a `page.yml` alias entry in the future, CI catches it.

- [ ] **Step 1: Add the regression test to `cypress/e2e/content/api-reference.cy.js`**

Append the following block after the last existing `describe(...)` block. Do NOT wrap in an outer describe — the file's existing `describe`s are top-level.

```javascript
// ── Legacy URL redirects ─────────────────────────────────────────────
// Covers URLs that 404'd on production before Hugo aliases were added
// via api-docs/<product>/content/page.yml. See
// docs/superpowers/specs/2026-04-20-broken-api-link-redirects-design.md.

describe('Legacy API URL redirects', () => {
  const redirects = [
    // /reference/api/ stubs (5 products)
    ['/influxdb3/cloud-dedicated/reference/api/',  '/influxdb3/cloud-dedicated/api/'],
    ['/influxdb3/cloud-serverless/reference/api/', '/influxdb3/cloud-serverless/api/'],
    ['/influxdb3/clustered/reference/api/',        '/influxdb3/clustered/api/'],
    ['/influxdb/v2/reference/api/',                '/influxdb/v2/api/'],
    ['/influxdb/cloud/reference/api/',             '/influxdb/cloud/api/'],
    // Redoc-era /api/vN/ URLs (8 URLs across 7 products)
    ['/influxdb3/core/api/v3/',                    '/influxdb3/core/api/'],
    ['/influxdb3/enterprise/api/v3/',              '/influxdb3/enterprise/api/'],
    ['/influxdb3/cloud-dedicated/api/v2/',         '/influxdb3/cloud-dedicated/api/'],
    ['/influxdb3/cloud-serverless/api/v2/',        '/influxdb3/cloud-serverless/api/'],
    ['/influxdb3/clustered/api/v2/',               '/influxdb3/clustered/api/'],
    ['/influxdb/v2/api/v2/',                       '/influxdb/v2/api/'],
    ['/influxdb/v2/api/v1/',                       '/influxdb/v2/api/'],
    ['/influxdb/cloud/api/v2/',                    '/influxdb/cloud/api/'],
  ];

  redirects.forEach(([from, to]) => {
    it(`${from} → ${to}`, () => {
      cy.visit(from);
      // Hugo aliases return HTML with <meta http-equiv="refresh" content="0; url=..."/>.
      // Cypress's cy.visit waits for page-load events including the refresh,
      // so cy.location after the visit reflects the final URL. Use .should (retry)
      // to give the meta-refresh time to fire.
      cy.location('pathname', { timeout: 10000 }).should('eq', to);
    });
  });
});
```

- [ ] **Step 2: Run the test and confirm all 13 fail**

Run:

```bash
node cypress/support/run-e2e-specs.js --no-mapping \
  --spec "cypress/e2e/content/api-reference.cy.js"
```

Expected: `Legacy API URL redirects` suite has 13 failures. Each asserts the final pathname equals the canonical `/api/` route, but currently those URLs 404 so the final pathname stays on the legacy URL (or lands on Hugo's 404 page). The rest of the existing tests in the file still pass.

- [ ] **Step 3: Commit the failing test**

```bash
git add cypress/e2e/content/api-reference.cy.js
git commit -m "test(api-docs): add failing redirect suite for 13 legacy URLs"
```

---

### Task 2: Add aliases to existing page.yml files

**Files:**
- Modify: `api-docs/influxdb3/cloud-dedicated/content/page.yml`
- Modify: `api-docs/influxdb3/cloud-serverless/content/page.yml`
- Modify: `api-docs/influxdb3/clustered/content/page.yml`

- [ ] **Step 1: Edit `api-docs/influxdb3/cloud-dedicated/content/page.yml`**

Append the `aliases:` block at the end of the file, after the existing `body_extra:` / `description:` content. Exact content to add:

```yaml
aliases:
  - /influxdb3/cloud-dedicated/reference/api/
  - /influxdb3/cloud-dedicated/api/v2/
```

- [ ] **Step 2: Edit `api-docs/influxdb3/cloud-serverless/content/page.yml`**

Append:

```yaml
aliases:
  - /influxdb3/cloud-serverless/reference/api/
  - /influxdb3/cloud-serverless/api/v2/
```

- [ ] **Step 3: Edit `api-docs/influxdb3/clustered/content/page.yml`**

Append:

```yaml
aliases:
  - /influxdb3/clustered/reference/api/
  - /influxdb3/clustered/api/v2/
```

- [ ] **Step 4: Commit**

```bash
git add api-docs/influxdb3/cloud-dedicated/content/page.yml \
        api-docs/influxdb3/cloud-serverless/content/page.yml \
        api-docs/influxdb3/clustered/content/page.yml
git commit -m "feat(api-docs): add legacy URL aliases for distributed v3 products"
```

---

### Task 3: Create new page.yml files for products without one

**Files (all new):**
- Create: `api-docs/influxdb3/core/content/page.yml`
- Create: `api-docs/influxdb3/enterprise/content/page.yml`
- Create: `api-docs/influxdb/v2/content/page.yml`
- Create: `api-docs/influxdb/cloud/content/page.yml`

- [ ] **Step 1: Create `api-docs/influxdb3/core/content/page.yml`**

File contents:

```yaml
# Parent page content for the InfluxDB 3 Core API section landing page.
aliases:
  - /influxdb3/core/api/v3/
```

- [ ] **Step 2: Create `api-docs/influxdb3/enterprise/content/page.yml`**

File contents:

```yaml
# Parent page content for the InfluxDB 3 Enterprise API section landing page.
aliases:
  - /influxdb3/enterprise/api/v3/
```

- [ ] **Step 3: Create `api-docs/influxdb/v2/content/page.yml`**

File contents:

```yaml
# Parent page content for the InfluxDB OSS v2 API section landing page.
aliases:
  - /influxdb/v2/reference/api/
  - /influxdb/v2/api/v2/
  - /influxdb/v2/api/v1/
```

- [ ] **Step 4: Create `api-docs/influxdb/cloud/content/page.yml`**

File contents:

```yaml
# Parent page content for the InfluxDB Cloud (TSM) API section landing page.
aliases:
  - /influxdb/cloud/reference/api/
  - /influxdb/cloud/api/v2/
```

- [ ] **Step 5: Commit**

```bash
git add api-docs/influxdb3/core/content/page.yml \
        api-docs/influxdb3/enterprise/content/page.yml \
        api-docs/influxdb/v2/content/page.yml \
        api-docs/influxdb/cloud/content/page.yml
git commit -m "feat(api-docs): add legacy URL aliases for core, enterprise 3, v2, and cloud"
```

---

### Task 4: Regenerate API content

**Files:** no direct edits. This task runs the generator and verifies the aliases reached the generated frontmatter.

- [ ] **Step 1: Regenerate**

Run:

```bash
yarn build:api-docs
```

Expected: completes with no errors. Lots of `[post-process] influxdb/v2/... applied ...` output lines.

- [ ] **Step 2: Verify aliases in one representative generated file**

```bash
grep -A 15 "^aliases:" content/influxdb/v2/api/_index.md
```

Expected output (3 alias lines plus context):

```yaml
aliases:
  - /influxdb/v2/reference/api/
  - /influxdb/v2/api/v2/
  - /influxdb/v2/api/v1/
```

Repeat the check for one more product:

```bash
grep -A 10 "^aliases:" content/influxdb3/core/api/_index.md
```

Expected:

```yaml
aliases:
  - /influxdb3/core/api/v3/
```

- [ ] **Step 3: Audit for alias/tag-slug collisions**

An alias path that collides with a real generated tag page would be shadowed by the tag page. For each of the 13 aliases, confirm no directory exists at the alias path:

```bash
for path in \
  /influxdb3/cloud-dedicated/reference/api \
  /influxdb3/cloud-serverless/reference/api \
  /influxdb3/clustered/reference/api \
  /influxdb/v2/reference/api \
  /influxdb/cloud/reference/api \
  /influxdb3/core/api/v3 \
  /influxdb3/enterprise/api/v3 \
  /influxdb3/cloud-dedicated/api/v2 \
  /influxdb3/cloud-serverless/api/v2 \
  /influxdb3/clustered/api/v2 \
  /influxdb/v2/api/v2 \
  /influxdb/v2/api/v1 \
  /influxdb/cloud/api/v2 \
; do
  if [ -d "content$path" ]; then
    echo "COLLISION: content$path is a real directory"
  fi
done
echo "collision check done"
```

Expected: only `collision check done` printed. If any `COLLISION:` line prints, stop and investigate — a tag slugified into the alias path. Rename the tag or pick a different alias.

- [ ] **Step 4: No commit**

Generated API content under `content/influxdb*/api/` is gitignored. `git status` should show no changes.

```bash
git status --short | grep "content/influxdb" || echo "clean"
```

Expected: `clean`.

---

### Task 5: Rerun Cypress — redirect suite now passes

**Files:** no edits.

- [ ] **Step 1: Run the full api-reference spec**

```bash
node cypress/support/run-e2e-specs.js --no-mapping \
  --spec "cypress/e2e/content/api-reference.cy.js"
```

Expected: `Legacy API URL redirects` — all 13 tests pass. Every other test in the file still passes. Summary line shows `xx passing` with no failures (number depends on pre-existing test count; the important thing is 0 failures and the 13 new tests are green).

- [ ] **Step 2: If any fail, diagnose**

- If the test fails with `Expected pathname X, got Y` where Y is the legacy URL itself — the meta-refresh didn't fire. Increase `cy.location` timeout or inspect the generated HTML at `public<legacy-url>/index.html` and confirm it contains a `<meta http-equiv="refresh">` tag.
- If the test fails with a timeout on `cy.visit` — the legacy URL is returning 404 (i.e., Hugo didn't generate the alias). Confirm the alias reached `content/<product>/api/_index.md` frontmatter (re-run Task 4 Step 2).

---

### Task 6: Link-checker spot-check

**Files:** no edits.

- [ ] **Step 1: Build Hugo**

```bash
npx hugo --quiet
```

- [ ] **Step 2: Check the 13 URLs against the built site**

```bash
for path in \
  /influxdb3/cloud-dedicated/reference/api/ \
  /influxdb3/cloud-serverless/reference/api/ \
  /influxdb3/clustered/reference/api/ \
  /influxdb/v2/reference/api/ \
  /influxdb/cloud/reference/api/ \
  /influxdb3/core/api/v3/ \
  /influxdb3/enterprise/api/v3/ \
  /influxdb3/cloud-dedicated/api/v2/ \
  /influxdb3/cloud-serverless/api/v2/ \
  /influxdb3/clustered/api/v2/ \
  /influxdb/v2/api/v2/ \
  /influxdb/v2/api/v1/ \
  /influxdb/cloud/api/v2/ \
; do
  file="public${path}index.html"
  if [ -f "$file" ] && grep -q 'http-equiv="refresh"' "$file"; then
    echo "OK      $path"
  else
    echo "MISSING $path"
  fi
done
```

Expected: 13 `OK` lines, 0 `MISSING`.

---

### Task 7: Commit, push, and open PR

- [ ] **Step 1: Verify the branch has the expected three commits**

```bash
git log --oneline origin/master..HEAD
```

Expected: exactly three commits, in order:

```
<sha3> feat(api-docs): add legacy URL aliases for core, enterprise 3, v2, and cloud
<sha2> feat(api-docs): add legacy URL aliases for distributed v3 products
<sha1> test(api-docs): add failing redirect suite for 13 legacy URLs
```

(Plus the spec commit from brainstorming: `spec(docs): design for broken API link redirects`.)

- [ ] **Step 2: Push the branch**

```bash
git push -u origin fix/broken-api-link-redirects
```

- [ ] **Step 3: Open the PR**

```bash
gh pr create --title "fix(api-docs): redirect 13 legacy API URLs to canonical /api/ pages" \
  --body "$(cat <<'EOF'
## Summary

Adds Hugo aliases via `page.yml` overlays to redirect 13 legacy API URLs that currently return 404 on production. Every legacy URL lands on its product's canonical \`/api/\` page. Closes #5801.

Mechanism is the same one v1 and Enterprise v1 already use (see \`api-docs/influxdb/v1/content/page.yml\`). No new code, no Lambda.

## Redirects added

| Legacy URL | → | Target |
| :--- | :---: | :--- |
| \`/influxdb3/cloud-dedicated/reference/api/\` | → | \`/influxdb3/cloud-dedicated/api/\` |
| \`/influxdb3/cloud-serverless/reference/api/\` | → | \`/influxdb3/cloud-serverless/api/\` |
| \`/influxdb3/clustered/reference/api/\` | → | \`/influxdb3/clustered/api/\` |
| \`/influxdb/v2/reference/api/\` | → | \`/influxdb/v2/api/\` |
| \`/influxdb/cloud/reference/api/\` | → | \`/influxdb/cloud/api/\` |
| \`/influxdb3/core/api/v3/\` | → | \`/influxdb3/core/api/\` |
| \`/influxdb3/enterprise/api/v3/\` | → | \`/influxdb3/enterprise/api/\` |
| \`/influxdb3/cloud-dedicated/api/v2/\` | → | \`/influxdb3/cloud-dedicated/api/\` |
| \`/influxdb3/cloud-serverless/api/v2/\` | → | \`/influxdb3/cloud-serverless/api/\` |
| \`/influxdb3/clustered/api/v2/\` | → | \`/influxdb3/clustered/api/\` |
| \`/influxdb/v2/api/v2/\` | → | \`/influxdb/v2/api/\` |
| \`/influxdb/v2/api/v1/\` | → | \`/influxdb/v2/api/\` |
| \`/influxdb/cloud/api/v2/\` | → | \`/influxdb/cloud/api/\` |

## Not covered

URL fragments (e.g. \`#tag/Query\`, \`#operation/PostX\`) are not preserved. A user who bookmarked a fragment lands on the \`/api/\` section and scrolls. Per product owner guidance.

## Test plan

- [x] Cypress regression suite (\`Legacy API URL redirects\` in \`cypress/e2e/content/api-reference.cy.js\`) — 13 new assertions, all passing locally
- [x] Manual link-checker spot-check of the 13 URLs against locally-built \`public/\`
- [x] \`yarn build:api-docs\` runs clean
- [x] No alias-vs-tag-slug collisions
EOF
)"
```

- [ ] **Step 4: Verify the PR exists**

```bash
gh pr view --json url --jq .url
```

Expected: a GitHub URL for the newly opened PR.

---

## Self-Review

**Spec coverage check:** Every row of the spec's 13-URL table maps to (a) a `page.yml` alias entry in Task 2 or 3, and (b) a Cypress assertion in Task 1. ✓

**Placeholder scan:** No TBDs, TODOs, or "implement later". Every step shows actual YAML, commands, or expected output. ✓

**Type/name consistency:** Every alias path in the plan matches verbatim across the Cypress test (Task 1), the `page.yml` edits (Tasks 2-3), and the link-checker spot-check (Task 6). ✓

**Risk coverage:** Spec's three risks each have mitigations in tasks — alias/tag collision check in Task 4 Step 3, 200-vs-refresh verification in Task 6 Step 2, Cypress regression coverage in Task 1 (catches future drift). ✓
