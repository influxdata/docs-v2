# Generate Release Notes

A JavaScript ESM script to generate release notes for InfluxDB projects by analyzing git commits between two versions.

## InfluxDB 3 Core/Enterprise

This script supports the InfluxDB 3 Core/Enterprise relationship and tagged releases.

## InfluxDB 3 Clustered

See the Clustered [release process](https://github.com/influxdata/project-clustered?tab=readme-ov-file#release-process).


## Features

- **Flexible repository support**: Handle single or multiple repositories
- **Multiple output formats**: 
  - **Integrated**: All repositories' changes integrated in unified sections
  - **Separated**: Primary repository first, then secondary repositories
- **Merge commit support**: Extracts features and fixes from merge commit bodies
- **Conventional commit parsing**: Supports `feat:`, `fix:`, `perf:`, etc.
- **PR link generation**: Automatically links to GitHub pull requests (configurable per repository)
- **JSON configuration**: Full configuration support via JSON files
- **Enhanced commit messages**: Categorizes commits based on affected areas (database, CLI, API, etc.)
- **Customizable templates**: Configure headers, labels, and intro text for separated format

## Usage

### Basic Usage

```bash
# Single repository, standard format
node generate-release-notes.js v3.1.0 v3.2.0 /path/to/repo

# Multiple repositories (auto-detects Core/Enterprise format)
node generate-release-notes.js v3.1.0 v3.2.0 /path/to/influxdb /path/to/influxdb_pro

# Skip fetching from remote
node generate-release-notes.js --no-fetch v3.1.0 v3.2.0 /path/to/repo

# Pull latest changes (use with caution)
node generate-release-notes.js --pull v3.1.0 v3.2.0 /path/to/repo

# Omit PR links from release notes
node generate-release-notes.js --no-pr-links v3.1.0 v3.2.0 /path/to/repo
```

### Advanced Usage

```bash
# Explicit format specification
node generate-release-notes.js --format separated v3.1.0 v3.2.0 /path/to/influxdb /path/to/influxdb_pro

# Using JSON configuration
node generate-release-notes.js --config config.json v3.1.0 v3.2.0

# Using product-specific configurations
node generate-release-notes.js --config config/influxdb3-core-enterprise.json v3.2.0 v3.2.1
node generate-release-notes.js --config config/influxdb-v2.json v2.7.0 v2.7.1
node generate-release-notes.js --config config/influxdb3-clustered.json v1.0.0 v1.1.0
```

### Configuration File

Create a JSON configuration file for complex setups:

```json
{
  "outputFormat": "separated",
  "primaryRepo": "influxdb",
  "repositories": [
    {
      "name": "influxdb",
      "path": "/path/to/influxdb",
      "label": "Core",
      "includePrLinks": true
    },
    {
      "name": "influxdb_pro", 
      "path": "/path/to/influxdb_pro",
      "label": "Enterprise",
      "includePrLinks": false
    }
  ],
  "separatedTemplate": {
    "header": "> [!Note]\n> Custom header text here",
    "primaryLabel": "Primary Repository",
    "secondaryLabel": "Secondary Repositories",
    "secondaryIntro": "Additional features and fixes from secondary repositories:"
  }
}
```

## Output Formats

### Integrated Format

All repositories' changes are integrated together in unified sections with repository labels and enhanced descriptions:

```markdown
## v3.2.1 {date="2025-07-03"}

### Features

- [influxdb] **Database management**: Allow hard_deleted date of deleted schema to be updated ([#26574](https://github.com/influxdata/influxdb/pull/26574))
- [influxdb_pro] **License management**: Amend license info ([#987](https://github.com/influxdata/influxdb/pull/987))

### Bug Fixes

- [influxdb] **CLI**: Add help text for the new update subcommand ([#26569](https://github.com/influxdata/influxdb/pull/26569))
```

When using `--no-pr-links`, the PR links are omitted:

```markdown
## v3.2.1 {date="2025-07-03"}

### Features

- [influxdb] **Database management**: Allow hard_deleted date of deleted schema to be updated
- [influxdb_pro] **License management**: Amend license info

### Bug Fixes

- [influxdb] **CLI**: Add help text for the new update subcommand
```

### Separated Format

Primary repository changes are shown first, followed by secondary repository changes. Ideal for products where one repository is a superset of another:

```markdown
> [!Note]
> #### InfluxDB 3 Core and Enterprise relationship
>
> InfluxDB 3 Enterprise is a superset of InfluxDB 3 Core.
> All updates to Core are automatically included in Enterprise.
> The Enterprise sections below only list updates exclusive to Enterprise.

## v3.2.1 {date="2025-07-03"}

### Core

#### Features

- **Database management**: Allow hard_deleted date of deleted schema to be updated ([#26574](https://github.com/influxdata/influxdb/pull/26574))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **License management**: Amend license info ([#987](https://github.com/influxdata/influxdb/pull/987))
```

## Configuration Options

### Repository Configuration

Each repository in the configuration can have:
- `name`: Repository identifier
- `path`: Path to the repository
- `label`: Label used in output
- `includePrLinks`: Whether to include PR links (boolean)

### Separated Format Template

When using separated format, you can customize:
- `header`: Markdown header text shown at the top
- `primaryLabel`: Section label for primary repository
- `secondaryLabel`: Section label for secondary repositories
- `secondaryIntro`: Introduction text for secondary section
- `primaryRepo`: Name or index of the primary repository

## Migration from Bash

This JavaScript version replaces the previous bash script with the following improvements:

- **Better error handling**: More robust git command execution
- **Flexible configuration**: JSON-based configuration support
- **Cleaner code structure**: Object-oriented design with clear separation of concerns
- **Enhanced regex handling**: Fixed merge commit parsing issues
- **Cross-platform compatibility**: Works on all platforms with Node.js

## Output Location

Generated release notes are saved to `helper-scripts/output/release-notes/release-notes-{version}.md`.

## Requirements

- Node.js (ES modules support)
- Git repositories with the specified version tags
- Access to the git repositories (local or remote)

## Command Line Options

- `--no-fetch`: Skip fetching latest commits from remote
- `--pull`: Pull latest changes (implies fetch) - use with caution
- `--no-pr-links`: Omit PR links from commit messages (default: include links)
- `--config <file>`: Load configuration from JSON file  
- `--format <type>`: Output format: 'integrated' or 'separated'
- `-h, --help`: Show help message

## Example Configurations

### InfluxDB 3 Core/Enterprise

See `config/influxdb3-core-enterprise.json` for a configuration that:
- Uses separated format
- Sets influxdb as primary repository (Core)
- Sets influxdb_pro as secondary repository (Enterprise)
- Includes PR links for Core, excludes them for Enterprise
- Adds custom header explaining the Core/Enterprise relationship

### InfluxDB v2

See `config/influxdb-v2.json` for a simple single-repository configuration using integrated format.

### InfluxDB 3 Clustered

See `config/influxdb3-clustered.json` for Kubernetes operator release notes.