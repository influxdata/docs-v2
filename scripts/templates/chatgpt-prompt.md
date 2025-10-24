# Content Scaffolding Analysis Prompt (ChatGPT)

## Context

You are analyzing a documentation draft to generate an intelligent file structure proposal for the InfluxData documentation repository.

**Context file**: `.tmp/scaffold-context.json`

Read and analyze the context file, which contains:
- **draft**: The markdown content and any existing frontmatter
- **products**: Available InfluxDB products (Core, Enterprise, Cloud, etc.)
- **productHints**: Products mentioned or suggested based on content analysis
- **versionInfo**: Detected InfluxDB version (3.x, 2.x, 1.x) and tools
- **structure**: Repository structure, existing paths, and sibling weights
- **conventions**: Documentation conventions for naming, weights, and testing

## Your Tasks

### 1. Content Analysis

Analyze the draft content to determine:

- **Topic**: What is this documentation about?
- **Target audience**: Developers, administrators, beginners, or advanced users?
- **Documentation type**: Conceptual overview, how-to guide, reference, or tutorial?
- **Target products**: Which InfluxDB products does this apply to?
  - Use `productHints.mentioned` and `productHints.suggested` from context
  - Consider `versionInfo.version` (3.x, 2.x, or 1.x)
- **Section**: Which documentation section? (admin, write-data, query-data, reference, get-started, plugins)

### 2. Structure Decisions

Decide on the optimal file structure:

- **Shared vs Product-Specific**:
  - Use shared content (`content/shared/`) when content applies broadly with minor variations
  - Use product-specific when content differs significantly between products
- **Parent menu item**: What should be the navigation parent?
- **Weight**: Calculate appropriate weight based on `structure.siblingWeights`
  - Weights are in ranges: 1-99 (top level), 101-199 (level 2), 201-299 (level 3)

### 3. Frontmatter Generation

For each file, create complete frontmatter with:

- **title**: Clear, SEO-friendly title
- **description**: Concise 1-2 sentence description for SEO
- **menu**: Proper menu structure with product key (pattern: `{namespace}_{product}`)
- **weight**: Sequential weight based on siblings
- **source**: (for frontmatter-only files) Path to shared content
- **related**: 3-5 relevant related articles from `structure.existingPaths`
- **alt_links**: Map equivalent pages across products for cross-product navigation

### 4. Code Sample Considerations

Based on `versionInfo`:
- Use version-specific CLI commands (influxdb3, influx, influxctl)
- Reference appropriate API endpoints (/api/v3, /api/v2)
- Note testing requirements from `conventions.testing`

### 5. Style Compliance

Follow conventions from `conventions.namingRules`:
- Files: Use lowercase with hyphens (e.g., `manage-databases.md`)
- Directories: Use lowercase with hyphens
- Shared content: Place in appropriate `/content/shared/` subdirectory

## Output Format

Generate a JSON proposal matching the schema in `scripts/schemas/scaffold-proposal.schema.json`.

**Required structure**:

```json
{
  "analysis": {
    "topic": "Brief topic description",
    "targetProducts": ["core", "enterprise", "cloud-dedicated"],
    "section": "admin",
    "isShared": true,
    "reasoning": "Why this structure makes sense",
    "styleReview": {
      "issues": [],
      "recommendations": []
    },
    "codeValidation": {
      "tested": false,
      "tools": ["influxdb3 CLI", "influxctl"]
    }
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
          "/influxdb3/core/path/to/related/"
        ],
        "alt_links": {
          "enterprise": "/influxdb3/enterprise/admin/topic-name/"
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

## Instructions

1. Read and parse `.tmp/scaffold-context.json`
2. Analyze the draft content thoroughly
3. Make structure decisions based on the analysis
4. Generate complete frontmatter for all files
5. Save the proposal to `.tmp/scaffold-proposal.json`

The proposal will be validated and used by `yarn docs:create --proposal .tmp/scaffold-proposal.json` to create the files.
