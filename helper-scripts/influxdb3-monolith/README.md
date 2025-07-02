# InfluxDB 3 Monolith (Core and Enterprise) Helper Scripts

This directory contains helper scripts specifically for InfluxDB 3 Core and Enterprise (monolith deployments), as opposed to distributed/clustered deployments.

## Overview

These scripts help with documentation workflows for InfluxDB 3 Core and Enterprise, including CLI change detection, authentication setup, API analysis, and release preparation.

## Prerequisites

- **Docker and Docker Compose**: For running InfluxDB 3 containers
- **Active containers**: InfluxDB 3 Core and/or Enterprise containers running via `docker compose`
- **Secret files**: Docker Compose secrets for auth tokens (`~/.env.influxdb3-core-admin-token` and `~/.env.influxdb3-enterprise-admin-token`)
- **Python 3**: For API analysis scripts

## Scripts

### 🔐 Authentication & Setup

#### `setup-auth-tokens.sh`
Creates and configures authentication tokens for InfluxDB 3 containers.

**Usage:**
```bash
./setup-auth-tokens.sh [core|enterprise|both]
```

**What it does:**
- Checks existing tokens in secret files (`~/.env.influxdb3-core-admin-token` and `~/.env.influxdb3-enterprise-admin-token`)
- Starts containers if not running
- Creates admin tokens using `influxdb3 create token --admin`
- Updates appropriate secret files with new tokens
- Tests tokens to ensure they work

**Example:**
```bash
# Set up both Core and Enterprise tokens
./setup-auth-tokens.sh both

# Set up only Enterprise
./setup-auth-tokens.sh enterprise
```

### 🔍 CLI Analysis

#### `detect-cli-changes.sh`
Compares CLI help output between different InfluxDB 3 versions to identify changes.

**Usage:**
```bash
./detect-cli-changes.sh [core|enterprise] <old-version> <new-version>
```

**Features:**
- Compare any two versions (released or local containers)
- Extract comprehensive help for all commands and subcommands
- Generate unified diff reports
- Create markdown summaries of changes
- Handle authentication automatically
- **NEW**: Analyze source code changes and correlate with CLI changes
- **NEW**: Identify related features between CLI and backend modifications
- **NEW**: Generate recommended documentation focus areas

**Examples:**
```bash
# Compare two released versions
./detect-cli-changes.sh core 3.1.0 3.2.0

# Compare released vs local development container
./detect-cli-changes.sh enterprise 3.1.0 local

# Use "local" to reference running Docker containers
./detect-cli-changes.sh core 3.1.0 local
```

**Output:**
- `helper-scripts/output/cli-changes/cli-{product}-{version}.txt` - Full CLI help
- `helper-scripts/output/cli-changes/cli-changes-{product}-{old}-to-{new}.diff` - Diff report
- `helper-scripts/output/cli-changes/cli-changes-{product}-{old}-to-{new}-summary.md` - Enhanced summary with:
  - CLI changes analysis
  - Source code features, breaking changes, and API modifications
  - Cross-referenced CLI and source correlations
  - Recommended documentation focus areas
- `helper-scripts/output/cli-changes/source-changes-{product}-{old}-to-{new}.md` - Full source code analysis (when available)

#### `compare-cli-local.sh`
Convenience script for comparing a released version against your local running container.

**Usage:**
```bash
./compare-cli-local.sh [core|enterprise] [released-version]
```

**Features:**
- Auto-starts containers if not running
- Shows local container version
- Provides quick testing commands
- Streamlined workflow for development

**Example:**
```bash
# Compare Core local container vs 3.1.0 release
./compare-cli-local.sh core 3.1.0
```

### 🔧 Development Tools

#### `extract_influxdb3_help.py`
Python script for extracting and parsing InfluxDB 3 CLI help output.

**Usage:**
```bash
python3 extract_influxdb3_help.py [options]
```

#### `compare_cli_api.py`
Python script for comparing CLI commands with API endpoints to identify discrepancies.

**Usage:**
```bash
python3 compare_cli_api.py [options]
```

#### `update-product-version.sh`
Updates product version numbers in `data/products.yml` and related files.

**Usage:**
```bash
./update-product-version.sh --product [core|enterprise] --version X.Y.Z
```

**Features:**
- Updates `data/products.yml` with new version
- Updates Docker Compose examples
- Validates version format

**Example:**
```bash
./update-product-version.sh --product core --version 3.2.1
```

## Quick Start Guide

### 1. Initial Setup

```bash
# Navigate to the monolith scripts directory
cd helper-scripts/influxdb3-monolith

# Make scripts executable
chmod +x *.sh

# Set up authentication for both products
./setup-auth-tokens.sh both

# Restart containers to load new secrets
docker compose down && docker compose up -d influxdb3-core influxdb3-enterprise
```

### 2. Basic CLI Analysis

```bash
# Start your containers
docker compose up -d influxdb3-core influxdb3-enterprise

# Compare CLI between versions
./detect-cli-changes.sh core 3.1.0 local
./detect-cli-changes.sh enterprise 3.1.0 local

# Review the output
ls ../output/cli-changes/
```

### 3. Development Workflow

```bash
# Quick comparison during development
./compare-cli-local.sh core 3.1.0

# Check what's changed
cat ../output/cli-changes/cli-changes-core-3.1.0-to-local-summary.md
```

### 4. Enhanced Analysis with Source Code Correlation

When comparing two released versions (not using "local"), the script automatically:

```bash
# Run CLI comparison with source analysis
./detect-cli-changes.sh enterprise 3.1.0 3.2.0

# Review the enhanced summary that includes:
# - CLI changes
# - Source code changes (features, fixes, breaking changes)
# - Correlation between CLI and backend
# - Recommended documentation focus areas
cat ../output/cli-changes/cli-changes-enterprise-3.1.0-to-3.2.0-summary.md
```

**Requirements for source analysis:**
- InfluxDB source repository available (searches common locations)
- Git tags for the versions being compared (e.g., v3.1.0, v3.2.0)
- Works best with the `generate-release-notes.sh` script in parent directory

## Container Integration

The scripts work with your Docker Compose setup:

**Expected container names:**
- `influxdb3-core` (port 8282)
- `influxdb3-enterprise` (port 8181)

**Docker Compose secrets:**
- `influxdb3-core-admin-token` - Admin token for Core (stored in `~/.env.influxdb3-core-admin-token`)
- `influxdb3-enterprise-admin-token` - Admin token for Enterprise (stored in `~/.env.influxdb3-enterprise-admin-token`)
- `INFLUXDB3_LICENSE_EMAIL` - Enterprise license email (set in `.env.3ent` env_file)

## Use Cases

### 📋 Release Documentation

1. **Pre-release analysis:**
   ```bash
   ./detect-cli-changes.sh core 3.1.0 3.2.0
   ```

2. **Update documentation based on changes**
3. **Test new commands and options**
4. **Update CLI reference pages**

### 🔬 Development Testing

1. **Compare local development:**
   ```bash
   ./compare-cli-local.sh enterprise 3.1.0
   ```

2. **Verify new features work**
3. **Test authentication setup**
4. **Validate CLI consistency**

### 🚀 Release Preparation

1. **Update version numbers:**
   ```bash
   ./update-product-version.sh --product core --version 3.2.1
   ```

2. **Generate change reports**
3. **Update examples and tutorials**

## Output Structure

```
helper-scripts/
├── output/
│   └── cli-changes/
│       ├── cli-core-3.1.0.txt                         # Full CLI help
│       ├── cli-core-3.2.0.txt                         # Full CLI help
│       ├── cli-changes-core-3.1.0-to-3.2.0.diff      # Diff report
│       ├── cli-changes-core-3.1.0-to-3.2.0-summary.md # Enhanced summary with:
│       │                                              #   - CLI changes
│       │                                              #   - Source code analysis
│       │                                              #   - CLI/Source correlations
│       │                                              #   - Documentation recommendations
│       └── source-changes-core-3.1.0-to-3.2.0.md     # Full source analysis
└── influxdb3-monolith/
    ├── README.md                            # This file
    ├── setup-auth-tokens.sh                 # Auth setup
    ├── detect-cli-changes.sh                # CLI comparison with source analysis
    ├── compare-cli-local.sh                 # Local comparison
    ├── extract_influxdb3_help.py            # Help extraction
    ├── compare_cli_api.py                   # CLI/API comparison
    └── update-product-version.sh            # Version updates
```

## Error Handling

### Common Issues

**Container not running:**
```bash
# Check status
docker compose ps

# Start specific service
docker compose up -d influxdb3-core
```

**Authentication failures:**
```bash
# Recreate tokens
./setup-auth-tokens.sh both

# Test manually
docker exec influxdb3-core influxdb3 create token --admin
```

**Version not found:**
```bash
# Check available versions
docker pull influxdb:3-core:3.2.0
docker pull influxdb:3-enterprise:3.2.0
```

### Debug Mode

Enable debug output for troubleshooting:
```bash
set -x
./detect-cli-changes.sh core 3.1.0 local
set +x
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
- name: Detect CLI Changes
  run: |
    cd helper-scripts/influxdb3-monolith
    ./detect-cli-changes.sh core ${{ env.OLD_VERSION }} ${{ env.NEW_VERSION }}
    
- name: Upload CLI Analysis
  uses: actions/upload-artifact@v3
  with:
    name: cli-analysis
    path: helper-scripts/output/cli-changes/
```

### CircleCI Example

```yaml
- run:
    name: CLI Change Detection
    command: |
      cd helper-scripts/influxdb3-monolith
      ./detect-cli-changes.sh enterprise 3.1.0 3.2.0
      
- store_artifacts:
    path: helper-scripts/output/cli-changes/
```

## Best Practices

### 🔒 Security
- Secret files (`~/.env.influxdb3-*-admin-token`) are stored in your home directory and not in version control
- Rotate auth tokens regularly by re-running `setup-auth-tokens.sh`
- Use minimal token permissions when possible

### 📚 Documentation
- Run comparisons early in release cycle
- Review all diff output for breaking changes
- Update examples to use new features
- Test all documented commands

### 🔄 Workflow
- Use `local` version for development testing
- Compare against previous stable release
- Generate reports before documentation updates
- Validate changes with stakeholders

## Troubleshooting

### Script Permissions
```bash
chmod +x *.sh
```

### Missing Dependencies
```bash
# Python dependencies
pip3 install -r requirements.txt  # if exists

# Docker Compose
docker compose version
```

### Container Health
```bash
# Check container logs
docker logs influxdb3-core
docker logs influxdb3-enterprise

# Test basic connectivity
docker exec influxdb3-core influxdb3 --version
```

## Contributing

When adding new scripts to this directory:

1. **Follow naming conventions**: Use lowercase with hyphens
2. **Add usage documentation**: Include help text in scripts
3. **Handle errors gracefully**: Use proper exit codes
4. **Test with both products**: Ensure Core and Enterprise compatibility
5. **Update this README**: Document new functionality

## Related Documentation

- [InfluxDB 3 Core CLI Reference](/influxdb3/core/reference/cli/)
- [InfluxDB 3 Enterprise CLI Reference](/influxdb3/enterprise/reference/cli/)
- [Release Process Documentation](../../.context/templates/release-checklist-template.md)
- [CLI Testing Guide](../../.context/templates/cli-testing-guide.md)