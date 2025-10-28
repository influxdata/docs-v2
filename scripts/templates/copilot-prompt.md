# Content Scaffolding Analysis (GitHub Copilot)

Generate a documentation scaffolding proposal from the context file.

## Input

Read `.tmp/scaffold-context.json` which contains:
- `draft`: Documentation draft content and frontmatter
- `products`: Available InfluxDB products
- `productHints`: Suggested products based on content analysis
- `versionInfo`: Detected version (3.x/2.x/1.x) and tools
- `structure`: Repository structure and sibling weights
- `conventions`: Documentation standards

## Analysis

Determine:
1. **Topic** and **audience** from draft content
2. **Target products** from `productHints` and `versionInfo`
3. **Documentation section** (admin/write-data/query-data/reference/get-started/plugins)
4. **Shared vs product-specific** structure
5. **Weight** from `structure.siblingWeights` for the section

## File Structure

Generate files following these patterns:

### Shared Content Pattern
```
content/shared/{namespace}-{section}/{topic-name}.md
  ├─ content/{namespace}/{product}/{section}/{topic-name}.md (frontmatter only)
  ├─ content/{namespace}/{product}/{section}/{topic-name}.md (frontmatter only)
  └─ ...
```

### Product-Specific Pattern
```
content/{namespace}/{product}/{section}/{topic-name}.md (full content)
```

## Frontmatter Template

For frontmatter-only files:
```yaml
---
title: Clear SEO title
description: 1-2 sentence description
menu:
  {namespace}_{product}:
    name: Nav label
    parent: Parent item
weight: {calculated from siblings}
source: /shared/{namespace}-{section}/{topic-name}.md
related:
  - /path/to/related1/
  - /path/to/related2/
alt_links:
  {product}: /path/to/equivalent/
---
```

## Code Samples

Based on `versionInfo`:
- **v3.x**: Use `influxdb3` CLI, `influxctl`, `/api/v3`
- **v2.x**: Use `influx` CLI, `/api/v2`
- **v1.x**: Use `influx` CLI (v1), `influxd`, InfluxQL

## Output

Generate JSON matching `scripts/schemas/scaffold-proposal.schema.json`:

```json
{
  "analysis": {
    "topic": "...",
    "targetProducts": ["..."],
    "section": "...",
    "isShared": true/false,
    "reasoning": "...",
    "styleReview": {
      "issues": [],
      "recommendations": []
    },
    "codeValidation": {
      "tested": false,
      "tools": []
    }
  },
  "files": [
    {
      "path": "content/...",
      "type": "shared-content" | "frontmatter-only",
      "content": "..." OR "frontmatter": {...}
    }
  ],
  "nextSteps": ["..."]
}
```

Save to: `.tmp/scaffold-proposal.json`

## Conventions

- **Files**: lowercase-with-hyphens.md
- **Menu keys**: `{namespace}_{product}` (e.g., `influxdb3_core`)
- **Weights**: 1-99 (top), 101-199 (level 2), 201-299 (level 3)
- **Shared content**: `content/shared/` subdirectories
- **Related links**: 3-5 contextually relevant articles

Begin analysis of `.tmp/scaffold-context.json`.
