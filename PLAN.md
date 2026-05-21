# #7240 — robots.txt named AI-bot allow blocks

**Issue:** [influxdata/docs-v2#7240](https://github.com/influxdata/docs-v2/issues/7240)
**Parent:** #7230 (AI visibility — Phase 0)
**Branch:** `worktree-add-decision-pages-pr4` (bundled with decision-pages PR per user direction)
**Status:** Implemented (not yet committed). Production and staging output verified via `npx hugo --quiet [--environment staging]`.

## Goal

Make AI crawler intent explicit in `layouts/robots.txt` by emitting a named `User-agent:` block per AI/LLM crawler. The blocks document an `Allow: /` stance on production and mirror the existing wildcard `Disallow: /` on staging.

## Why

`/robots.txt` currently has only a wildcard `User-agent: *` block. Crawlers that read named blocks first (every major AI crawler) fall through to the wildcard with no explicit signal from docs-v2. Naming each bot:

- Documents the current allow stance so a future policy change (default-disallow wildcard) doesn't silently flip AI visibility.
- Survives bot-vendor identifier changes — legacy identifiers stay listed alongside the current canonical names.
- Centralizes the policy in a structured data file so future generators (audit script, policy docs page) share one source of truth.

## Design

### 1. `data/ai_bots.yml` (new)

Flat YAML list of bot identifiers, with vendor names as comments for human navigation. Flat is sufficient — the only consumer today is the robots.txt template iterator. If a future use case needs vendor grouping, restructure then.

```yaml
# AI/LLM crawlers we explicitly allow on production (Disallow on staging).
# Each entry becomes a named User-agent block in /robots.txt.
# Bot identifiers come from each vendor's published crawler documentation.

# OpenAI
- GPTBot          # training + search
- OAI-SearchBot   # ChatGPT search results
- ChatGPT-User    # user-initiated browsing

# Anthropic
- ClaudeBot       # current canonical name
- anthropic-ai    # legacy identifier still observed
- Claude-Web      # legacy identifier still observed

# Perplexity
- PerplexityBot

# Common Crawl (feeds many LLM training corpora)
- CCBot

# Google (controls Gemini/Vertex AI; separate from Googlebot search)
- Google-Extended

# Meta
- FacebookBot

# ByteDance (powers Doubao)
- Bytespider

# Amazon
- Amazonbot
```

### 2. `layouts/robots.txt` (modified)

Prepend a `{{ range }}` over the data file emitting one named block per bot. Each block mirrors the wildcard's staging guard. Wildcard block stays unchanged.

```
{{- range $.Site.Data.ai_bots }}
User-agent: {{ . }}
{{ if eq $.Site.Params.environment "staging" -}}
Disallow: /
{{ else -}}
Allow: /
{{ end }}
{{ end -}}
User-agent: *
{{ if eq .Site.Params.environment "staging" }}Disallow: /
{{- else }}{{ range where .Site.Pages ".Params.noindex" true }}
Disallow: {{ .RelPermalink }}
{{ end -}}
{{ end -}}
Sitemap: {{ .Site.BaseURL }}sitemap.xml
Sitemap: {{ .Site.BaseURL }}sitemap-md.xml
```

## Acceptance criteria (from issue)

- Named `User-agent:` blocks for: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, CCBot, Google-Extended, FacebookBot, Bytespider, Amazonbot — 12 total
- Each block emits `Allow: /` on production (and `Disallow: /` on staging — addresses the staging-leak risk the issue didn't call out)
- Existing wildcard `User-agent: *` block kept verbatim, including the `noindex` page disallow loop
- Verify the generated `/robots.txt` with a sample fetch

## Implementation steps

1. ✅ Create `data/ai_bots.yml` with the bot list above.
2. ✅ Modify `layouts/robots.txt` to prepend the named-bot loop. Used `{{- range -}}` (trim both sides) with an explicit blank line inside the loop body for clean block separation.
3. ✅ Build: `npx hugo --quiet`.
4. ✅ Inspect `public/robots.txt` — confirmed 12 named blocks each with `Allow: /`, wildcard block intact (14 `noindex` disallow entries), both sitemaps present.
5. ✅ Spot-check staging via `npx hugo --quiet --environment staging` (cleaner than mutating config files — no revert needed). All 12 named blocks switched to `Disallow: /`.
6. ⏳ Commit: `feat(platform): add named AI-bot Allow blocks to robots.txt (closes #7240)`.

## Verification

- Build output `public/robots.txt` is the authoritative artifact; the test is reading it.
- No new Cypress test — the file is static-generated and the assertion would be a literal output comparison. Build inspection is the verification.

## Out of scope

- JSON-LD work (#7242, #7243).
- `__tests__/shortcodes/` removal (#7241).
- Canonical audit (#7245).
- Removing legacy Anthropic identifiers (`anthropic-ai`, `Claude-Web`) — vendors still publish them; keep both.
- Staging wildcard-block whitespace bug (#7251) — discovered during verification; pre-existing on master, tracked separately.

## Assumptions

- `Allow: /` documents *intent*; the file is advisory. Bots that ignore robots.txt are unaffected — this is consistent with the acceptance criteria wording.
- Named-block-first ordering helps human readers; spec-wise, crawlers match on user-agent string regardless of order.
