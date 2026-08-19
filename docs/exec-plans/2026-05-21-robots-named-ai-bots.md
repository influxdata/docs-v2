# robots.txt: named AI-bot crawl directives

**Status:** In review — PR [#7252](https://github.com/influxdata/docs-v2/pull/7252)
**Closes:** [#7240](https://github.com/influxdata/docs-v2/issues/7240), [#7251](https://github.com/influxdata/docs-v2/issues/7251)
**Parent:** [#7230](https://github.com/influxdata/docs-v2/issues/7230) (AI visibility — Phase 0)

## Goal

Make AI/LLM crawler intent explicit in `/robots.txt`. Emit a named `User-agent:` block per crawler so the current "allow on production, disallow on staging" stance is documented, not implicit through wildcard fall-through.

## Why now

The previous `/robots.txt` had only `User-agent: *`. Major AI crawlers read named blocks first and fall through to the wildcard with no explicit signal from docs-v2. That works today, but offers no audit trail when the policy changes — a future default-disallow wildcard would silently flip AI visibility with no diff in the named-bot stance.

Phase 0 of the AI visibility epic (#7230) requires this signal to be explicit.

## Decisions

- **Flat YAML list of identifiers** (`data/ai_bots.yml`), not vendor-grouped. One consumer today (the robots.txt template iterator). Restructure if a second use case appears — premature grouping costs more than it earns.
- **Legacy Anthropic identifiers kept** (`anthropic-ai`, `Claude-Web`) alongside the canonical `ClaudeBot`. Vendors still publish them as active; dropping them weakens intent signal during the transition.
- **Mirror the wildcard's staging guard.** Named blocks emit `Disallow: /` on staging, `Allow: /` elsewhere. Addresses a staging-leak risk the original issue didn't call out — staging shouldn't be discoverable.
- **Allow stance, not Disallow.** `Allow: /` documents *intent* on an advisory file. Bots that ignore robots.txt are unaffected either way; this matches the acceptance criteria.
- **Bundled the wildcard whitespace fix (#7251)** rather than splitting into a follow-up. Same file, same review context, one-character change.

## Explicitly out of scope

- JSON-LD work (#7242, #7243)
- `__tests__/shortcodes/` cleanup (#7241)
- Canonical audit (#7245)
- Lint / CI validation of `data/ai_bots.yml` — deferred (the user plans to add doc-graph validation later)

## How to update

Add a bot identifier to `data/ai_bots.yml`. Hugo regenerates `/robots.txt` on every build. No other surface to update.

## Verification

- `npx hugo --quiet` → `public/robots.txt` contains the 12 named blocks with `Allow: /`, wildcard block intact, both sitemaps present
- `npx hugo --quiet --environment staging` → all 12 named blocks switch to `Disallow: /`; wildcard staging line reads `Disallow: /\nSitemap: ...` (not the concatenated `Disallow: /Sitemap: ...` the bug produced)
