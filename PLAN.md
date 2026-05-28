# Plan: Stop serving `/__tests__/` paths in production (#7241)

Parent epic: #7230 (Phase 0). Follow-up filed: #7266 (reclassify `example.md` / `create.md`).

## Problem

`test_only` test fixtures (`content/**/__tests__/shortcodes.md`, ×14) build and
serve HTTP 200 in production. The only `test_only` guard lives in
`layouts/index.html` (home page); the fixtures render via
`layouts/_default/single.html`, which has no guard. Compliant crawlers respect
the `robots.txt` `Disallow:` lines, but curl-based agents and non-compliant
retrievers fetch the fixtures anyway.

## Approach

Suppress fixture pages **only in the production environment** with a config-level
`cascade` that sets `_build.render: never`. Pages are not written to disk →
genuine HTTP 404. `config/production/` is not loaded for `testing`/`development`,
so Cypress (`--environment testing`) and local dev (`hugo server` → development)
keep rendering the fixtures unchanged.

Establish the convention: **test fixtures live under `__tests__/`, and `__tests__/`
never ships to production.** A single path glob then covers every fixture.

## Changes

1. **`config/production/hugo.yml`** — add a top-level cascade:
   ```yaml
   cascade:
     - _target:
         path: '**/__tests__/**'
       _build:
         render: never
         list: never
         publishResources: false
   ```
   Note the leading `**` (no leading slash) so a root-level `/__tests__/...`
   path also matches.

2. **Move** `content/test-version-detector.md` →
   `content/__tests__/test-version-detector.md` (genuine component fixture, no
   URL references). Brings it under the same glob.

3. **Leave `robots.txt` unchanged.** Excluded pages drop out of `.Site.Pages` in
   production, so their auto-generated `Disallow:` lines simply stop emitting —
   harmless, since the pages 404. (Acceptance says the lines "can stay," not "must.")

4. **Out of scope** (→ #7266): `example.md`, `create.md`. They keep current
   behavior in this PR.

## Verification

- Production build excludes fixtures:
  ```sh
  npx hugo --environment production -d /tmp/prodbuild --quiet
  test ! -e /tmp/prodbuild/influxdb3/core/__tests__/shortcodes/index.html
  test ! -e /tmp/prodbuild/test-version-detector/index.html
  ```
- Testing build still renders them: run the shortcodes Cypress spec
  (`cypress/e2e/content/shortcodes.cy.js`, served via `--environment testing`)
  and confirm green.
- Add an automated guard (CI or node test) asserting a production build emits no
  `public/**/__tests__/**` HTML, so the fix can't silently regress.

## CI impact

| Activity                                    | Env                                  | Fixtures render?         |
| ------------------------------------------- | ------------------------------------ | ------------------------ |
| Cypress E2E (shortcodes, render-regression) | testing (pinned in `hugo-server.js`) | yes — cascade not loaded |
| pytest code-blocks                          | reads `.md` source, no build         | source unaffected        |
| PR render / link check, deploy              | production (Hugo build default)      | no — intended            |

Watch-point: `pr-link-check` on a PR that edits a now-excluded page would not find
its production HTML map. Only `example.md`/`create.md` are edited with any
frequency, and those are out of scope here. Revisit in #7266 if it bites.
