---
description: Generate and enhance release notes using the docs CLI
---

# Prepare Release Notes

Generate release notes from git commits and enhance them for documentation.

## Overview

This command uses the `docs release-notes` CLI tool to:

1. Extract commits between version tags from source repositories
2. Categorize changes (features, fixes, performance)
3. Generate markdown-formatted release notes
4. Optionally enhance descriptions for clarity

## Prerequisites

- GitHub CLI authenticated: `gh auth login`
- Product repositories configured (see Configuration below)

## Usage

### Step 1: Generate Release Notes

Use the `docs release-notes` command with version tags:

```bash
# Using product keys
docs release-notes <from-version> <to-version> --products <product-keys>

# Using content paths
docs release-notes <from-version> <to-version> --products <content-paths>

# Using direct repository paths
docs release-notes <from-version> <to-version> --repos <repo-paths>
```

### Examples

```bash
# Generate release notes for InfluxDB 3 Core
docs release-notes v3.1.0 v3.2.0 --products influxdb3_core

# Using content path instead of product key
docs release-notes v3.1.0 v3.2.0 --products /influxdb3/core

# Multiple products (Core and Enterprise)
docs release-notes v3.1.0 v3.2.0 --products influxdb3_core,influxdb3_enterprise
docs release-notes v3.1.0 v3.2.0 --products /influxdb3/core,/influxdb3/enterprise

# Using direct repository path
docs release-notes v3.1.0 v3.2.0 --repos ~/github/influxdata/influxdb

# Separated format (primary/secondary sections)
docs release-notes v3.1.0 v3.2.0 --products influxdb3_core --format separated
```

### Step 2: Review Generated Output

The command outputs release notes to `.tmp/release-notes/release-notes-<version>.md`.

Review and verify:

- Correct categorization (features, fixes, performance)
- PR links are accurate
- No sensitive information exposed
- Descriptions are clear and user-focused

### Step 3: Enhance Descriptions (Optional)

If descriptions need improvement, enhance them following these guidelines:

**Google Developer Documentation Style**:

- Use clear, action-oriented language
- Focus on what users can do
- Avoid marketing speak ("enhanced", "improved", "better")
- Start with action verbs when possible

**Component Categories**:

| File Path Pattern       | Category            |
| ----------------------- | ------------------- |
| `database/`, `catalog/` | Database operations |
| `cmd/`, `cli/`          | CLI commands        |
| `api/`, `http/`         | HTTP API            |
| `query/`, `sql/`        | Query engine        |
| `auth/`, `token/`       | Authentication      |
| `storage/`, `parquet/`  | Storage engine      |

**Transform Examples**:

Before:

```markdown
- **Database management**: Allow hard_deleted date of deleted schema to be updated
```

After:

```markdown
- **Database operations**: Set custom hard deletion dates for deleted databases and tables
```

### Step 4: Add to Documentation

Copy the enhanced release notes to the appropriate location:

```bash
# For InfluxDB 3 Core
content/influxdb3/core/reference/release-notes/

# For InfluxDB 3 Enterprise
content/influxdb3/enterprise/reference/release-notes/
```

## CLI Options

| Option              | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `--products <keys>` | Product keys or content paths (comma-separated)      |
| `--repos <paths>`   | Direct repository paths or URLs                      |
| `--format <type>`   | Output format: `integrated` (default) or `separated` |
| `--no-fetch`        | Skip fetching latest commits from remote             |
| `--no-pr-links`     | Omit PR links from commit messages                   |
| `--help`            | Show full help                                       |

**Note:** `--products` and `--repos` are mutually exclusive.

## Configuration

### Product Repository Paths

Configure repository paths in `~/.influxdata-docs/docs-cli.yml`:

```yaml
repositories:
  influxdb3_core:
    path: ~/github/influxdata/influxdb
  influxdb3_enterprise:
    path: ~/github/influxdata/influxdb-enterprise
  telegraf:
    path: ~/github/influxdata/telegraf
```

### Environment Variables

- `GITHUB_TOKEN`: For authenticated GitHub API access (higher rate limits)

## Output Format

### Integrated Format (Default)

All changes from all repositories in a single list:

```markdown
## v3.2.0 {date="2024-01-15"}

### Features

- [Core] **Database operations**: Set custom hard deletion dates
- [Enterprise] **Clustering**: Add node health monitoring

### Bug fixes

- [Core] **Query engine**: Fix null pointer in aggregation
```

### Separated Format

Primary repository changes first, then secondary:

```markdown
## v3.2.0 {date="2024-01-15"}

### Core Changes

#### Features
- **Database operations**: Set custom hard deletion dates

#### Bug fixes
- **Query engine**: Fix null pointer in aggregation

### Additional Changes

All core updates are included above. Additional repository-specific changes:

#### Features
- [Enterprise] **Clustering**: Add node health monitoring
```

## Troubleshooting

### "Version tag does not exist"

The specified version tag wasn't found in the repository:

```bash
# List available tags
git -C ~/github/influxdata/influxdb tag --list --sort=-version:refname | head -20
```

### "No repositories specified"

You must provide either `--products` or `--repos`:

```bash
docs release-notes v3.1.0 v3.2.0 --products influxdb3_core
```

### "Product not found"

The product key or path couldn't be resolved:

```bash
# Valid product keys
influxdb3_core, influxdb3_enterprise, telegraf

# Or use content paths
/influxdb3/core, /influxdb3/enterprise, /telegraf
```

## Related

- **docs-cli-workflow** skill - When to use CLI tools
- **content-editing** skill - Complete documentation workflow
