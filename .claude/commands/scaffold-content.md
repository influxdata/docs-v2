---
description: Analyze draft content and generate intelligent file structure with frontmatter
---

You are helping scaffold new documentation content for the InfluxData documentation repository.

## Task

Read the context from `.tmp/scaffold-context.json` and analyze the draft content to generate an intelligent file structure proposal with appropriate frontmatter.

## Analysis Steps

### 1. Understand the Content

Analyze the draft to determine:
- **Main topic and purpose**: What is this documentation about?
- **Target audience**: Developers, administrators, beginners, or advanced users?
- **Technical level**: Conceptual overview, how-to guide, reference, or tutorial?
- **Target products**: Which InfluxDB products does this apply to?
  - Core (self-hosted, open source)
  - Enterprise (self-hosted, licensed)
  - Cloud Dedicated (managed, dedicated clusters)
  - Cloud Serverless (managed, serverless)
  - Clustered (self-hosted, Kubernetes)

### 2. Determine Structure

Decide on the optimal structure:
- **Shared vs. Product-Specific**: Should this be shared content or product-specific?
  - Use shared content when content applies broadly with minor variations
  - Use product-specific when content differs significantly
- **Section**: Which section does this belong in?
  - `admin/` - Administration tasks (databases, tokens, configuration)
  - `write-data/` - Writing data to InfluxDB
  - `query-data/` - Querying and reading data
  - `reference/` - Reference documentation (API, CLI, config)
  - `get-started/` - Getting started tutorials
  - `plugins/` - Plugin documentation (Core/Enterprise only)
- **Parent menu item**: What should be the parent in the navigation?
- **Weight**: What weight based on sibling pages?
  - Use the `siblingWeights` data from context
  - Weights are in ranges: 1-99 (top level), 101-199 (level 2), 201-299 (level 3)

### 3. Generate Frontmatter

For each file, create complete frontmatter with:
- **title**: Clear, SEO-friendly title (e.g., "Manage retention policies")
- **description**: Concise 1-2 sentence description for SEO
- **menu**: Proper menu structure with product key and parent
- **weight**: Sequential weight based on siblings
- **source**: (for frontmatter-only files) Path to shared content
- **related**: 3-5 relevant related articles (analyze context for suggestions)
- **alt_links**: Map equivalent pages across products for cross-product navigation

### 4. Cross-Product Navigation (alt_links)

When content exists across multiple products, add `alt_links` to enable the product switcher:

```yaml
alt_links:
  core: /influxdb3/core/admin/retention-policies/
  enterprise: /influxdb3/enterprise/admin/retention-policies/
  cloud-dedicated: /influxdb3/cloud-dedicated/admin/retention-policies/
```

Only include products where the page actually exists.

## Output Format

Present your analysis interactively, then write a proposal JSON file.

### Interactive Presentation

```
I've analyzed your draft about "[TOPIC]".

📊 Analysis:
• Topic: [topic description]
• Products: [list of target products]
• Section: [section] ([reasoning])
• Shared: [Yes/No] ([reasoning])

📁 Proposed structure:

[Show file structure tree]

Each frontmatter file includes:
• title: "[title]"
• menu parent: "[parent]"
• weight: [weight] ([reasoning about placement])
• alt_links: [Cross-product navigation]
• related: [Links to related pages]

Adjustments needed? (or say "looks good")
```

### Proposal JSON Format

After confirmation, write to `.tmp/scaffold-proposal.json`:

```json
{
  "analysis": {
    "topic": "Brief topic description",
    "targetProducts": ["core", "enterprise", "cloud-dedicated"],
    "section": "admin",
    "isShared": true,
    "reasoning": "Why this structure makes sense"
  },
  "files": [
    {
      "path": "content/shared/influxdb3-admin/topic-name.md",
      "type": "shared-content",
      "content": "{{ACTUAL_DRAFT_CONTENT}}"
    },
    {
      "path": "content/influxdb3/core/admin/topic-name.md",
      "type": "frontmatter-only",
      "frontmatter": {
        "title": "Page Title",
        "description": "Page description",
        "menu": {
          "influxdb3_core": {
            "name": "Nav Label",
            "parent": "Parent Item"
          }
        },
        "weight": 205,
        "source": "/shared/influxdb3-admin/topic-name.md",
        "related": [
          "/influxdb3/core/path/to/related/",
          "/influxdb3/core/path/to/another/"
        ],
        "alt_links": {
          "enterprise": "/influxdb3/enterprise/admin/topic-name/",
          "cloud-dedicated": "/influxdb3/cloud-dedicated/admin/topic-name/"
        }
      }
    }
  ],
  "nextSteps": [
    "Review generated frontmatter",
    "Test with: npx hugo server",
    "Add product-specific variations if needed"
  ]
}
```

## Important Guidelines

1. **Use actual draft content**: Copy the `draft.content` from context into shared content files
2. **Analyze existing structure**: Use `structure.existingPaths` and `structure.siblingWeights` from context
3. **Follow conventions**: Reference `conventions` from context for naming and weight levels
4. **Be specific**: Provide concrete reasoning for all decisions
5. **Product menu keys**: Use the pattern `influxdb3_{product}` (e.g., `influxdb3_core`, `influxdb3_enterprise`)
6. **File naming**: Use lowercase with hyphens (e.g., `manage-databases.md`)
7. **Related articles**: Suggest contextually relevant related articles from existing structure
8. **Alt links**: Only include products where the equivalent page will exist

## Example Workflow

User has created a draft about database retention policies. You should:

1. Read `.tmp/scaffold-context.json`
2. Analyze the draft content about retention policies
3. Determine it applies to Core, Enterprise, and Cloud Dedicated
4. Decide it should be shared content in the `admin` section
5. Suggest weight 205 (after database deletion at 204)
6. Generate appropriate frontmatter for each product
7. Present the proposal interactively
8. After user confirms, write `.tmp/scaffold-proposal.json`

Now, read the context and begin your analysis.
