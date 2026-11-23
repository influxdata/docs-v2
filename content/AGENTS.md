<!-- This file is auto-generated from .agents/instructions. Do not edit directly. -->

<!-- Run 'yarn build:agent:instructions' to regenerate it. -->

# Documentation Content Agent Instructions

These instructions apply when working in `content/`.

## Content files

Use [DOCS-FRONTMATTER.md](../DOCS-FRONTMATTER.md) and
[DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md) as the syntax authority.
Use the [content-editing skill](../.agents/skills/content-editing/SKILL.md) for workflow
and the [docs-cli-workflow skill](../.agents/skills/docs-cli-workflow/SKILL.md) to select
the `docs` CLI or direct editing.

### Requirements

- Page frontmatter supplies `title`, `description`, appropriate `menu`, and
  page-level `weight` when it appears in navigation.
- Do not add a body h1. Use semantic line feeds, active present-tense second
  person, long CLI options, and `python` rather than `py` fences.
- Use `lp` for line protocol. Add `{lint="false"}` only to intentional invalid
  examples.
- Do not hardcode production docs URLs when a relative link or `relref` works.
- Shared files have no frontmatter. A stub's `source:` must begin `/shared/`.
  Identify every consumer before editing shared content. When previewing changes
  with a running `hugo server`, touch each consuming stub or restart the server
  because the watcher doesn't rebuild consumers automatically after shared-source
  changes. Fresh builds, including CI builds and checks, don't require touching
  consumer stubs. Edit stub content only when its frontmatter needs to change.
- Use resource-ownership language for import/write/load guidance and write
  recommendations in InfluxData's first-person plural voice.
- For capability or lifecycle claims, check the exact offering with
  [feature evidence](../.agents/skills/content-editing/references/fact-checking.md).
- Preserve existing inbound fragments when changing headings. For FAQ titles
  backed by YAML, set the existing `anchor` and verify the visible title and
  FAQPage question agree. See [FAQ shortcode](../DOCS-SHORTCODES.md#faq).

Run `yarn verify:changed -- <files>` to select manual checks. See
[content/example.md](./example.md) for working shortcode examples.


## Content Review Criteria

Review documentation changes against these rules.
Only flag issues you are confident about.
Reference the linked docs for detailed rules.

Before publishing corrections or approving an existing PR, follow the
[collaborative PR review skill](../.agents/skills/collaborative-pr-review/SKILL.md).

### Frontmatter

Rules: [DOCS-FRONTMATTER.md](../DOCS-FRONTMATTER.md)

- `title` and `description` are required on every page
- `menu` structure matches the product's menu key
- `weight` is present for pages in navigation
- `source` paths point to valid `/shared/` paths
- No duplicate or conflicting frontmatter keys

### Shortcode Syntax

Rules: [DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md)

- `{{< >}}` for HTML output, `{{% %}}` for Markdown-processed content
- Closing tags match opening tags
- Required parameters are present
- Callouts use GitHub-style syntax: `> [!Note]`, `> [!Warning]`, etc.
- Conditional shortcodes wrap complete callouts, blockquotes, lists, or tables;
  shortcode boundaries don't split Markdown containers

### Heading Hierarchy

- No h1 headings in content (h1 comes from `title` frontmatter)
- Headings don't skip levels (h2 -> h4 without h3)

### Semantic Line Feeds

Rules: [DOCS-CONTRIBUTING.md](../DOCS-CONTRIBUTING.md)

- One sentence per line (better diffs)
- Long sentences on their own line, not concatenated

### Terminology and Product Names

Products defined in [data/products.yml](../data/products.yml):

- Write **InfluxDB Cloud Serverless**, **InfluxDB Cloud Dedicated**, and
  **InfluxDB Clustered**. Use **InfluxDB 3** separately for their generation.
- Use the exact cloud product name. Resolve bare "Cloud" or "InfluxDB Cloud"
  from the docs path, hostname, or context. Ask which product the author means
  if the context is inconclusive.
- InfluxCloud and Cloud 1 mean **InfluxDB 1 Cloud**, based on InfluxDB 1
  Enterprise. **InfluxDB Cloud (TSM)** means the managed InfluxDB 2 product.
  Both services use TSM.
- **InfluxDB 3 Cloud** is managed InfluxDB 3 Enterprise.
  **InfluxDB Cloud Serverless** is the multi-tenant, self-service v3 offering.
  See [InfluxDB cloud product names](../DOCS-CONTRIBUTING.md#influxdb-cloud-product-names)
  for naming and documentation paths.
- Match terminology and version references to the product and content path.

### Links

- Internal links use relative paths or Hugo `relref` shortcodes
- No hardcoded `docs.influxdata.com` links in content files
- Anchor links match actual heading IDs

### Code Blocks

- Use `python` not `py` for language identifiers (pytest requirement)
- Use `lp` for line protocol examples. `lp` fences are blocking syntax checks;
  use `{lint="false"}` only for examples that intentionally show invalid input.
- Long options in CLI examples (`--output` not `-o`)
- Keep lines within 80 characters
- Include language identifier on fenced code blocks

### Shared Content

- `source:` frontmatter points to an existing shared file
- Shared files don't contain frontmatter (only content)
- Changes to shared content affect multiple products — flag if unintentional
- Claims and links match every consuming product's supported surface and sibling
  navigation; flag missing product targets as blocking mismatches
- Conditional shared content renders as intact containers for every consumer;
  verify the content and layout in a browser

### Severity

- **BLOCKING**: Broken rendering, wrong product names, missing required
  frontmatter, malformed shortcodes, h1 in content body
- **WARNING**: Missing semantic line feeds, skipped heading levels, missing
  `weight`, long CLI options not used
- **INFO**: Suggestions, code block missing language identifier, opportunities
  to use shared content


## Release updates

For release notes, product patch versions, and notifications, use the
[content-editing skill](../.agents/skills/content-editing/SKILL.md) and its
[release-update workflow](../.agents/skills/content-editing/references/release-updates.md).
