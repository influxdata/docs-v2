# Generate Release Notes

A JavaScript ESM script to generate release notes for InfluxDB projects by analyzing git commits between two versions.

## Features

- **Flexible repository support**: Handle single or multiple repositories
- **Multiple output formats**: Standard format or Core/Enterprise format for InfluxDB 3.x
- **Merge commit support**: Extracts features and fixes from merge commit bodies
- **Conventional commit parsing**: Supports `feat:`, `fix:`, `perf:`, etc.
- **PR link generation**: Automatically links to GitHub pull requests
- **JSON configuration**: Configurable via command line or JSON config file

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
```

### Advanced Usage

```bash
# Explicit format specification
node generate-release-notes.js --format core-enterprise v3.1.0 v3.2.0 /path/to/influxdb /path/to/influxdb_pro

# Using JSON configuration
node generate-release-notes.js --config config.json v3.1.0 v3.2.0
```

### Configuration File

Create a JSON configuration file for complex setups:

```json
{
  "outputFormat": "core-enterprise",
  "repositories": [
    {
      "name": "influxdb",
      "path": "/path/to/influxdb",
      "label": "influxdb"
    },
    {
      "name": "influxdb_pro", 
      "path": "/path/to/influxdb_pro",
      "label": "influxdb_pro"
    }
  ]
}
```

## Output Formats

### Standard Format

Basic release notes format with repository labels:

```markdown
## v3.2.1 {date="2025-07-03"}

### Features

- [influxdb] feat: Allow hard_deleted date of deleted schema to be updated
- [influxdb_pro] feat: amend license info (#987)

### Bug Fixes

- [influxdb] fix: Add help text for the new update subcommand (#26569)
```

### Core/Enterprise Format

InfluxDB 3.x specific format that separates Core and Enterprise changes:

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

- feat: Allow hard_deleted date of deleted schema to be updated

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- feat: amend license info (#987)
```

## Auto-Detection

The script automatically detects the Core/Enterprise format when both `influxdb` and `influxdb_pro` repositories are present.

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
- `--config <file>`: Load configuration from JSON file  
- `--format <type>`: Output format: 'standard' or 'core-enterprise'
- `-h, --help`: Show help message