# InfluxData Documentation Helper Scripts

This directory contains scripts to assist with InfluxDB documentation workflows, including release notes generation, CLI/API documentation auditing, and version management.

## Directory Structure

```
helper-scripts/
├── common/                    # Shared scripts used across all products
├── influxdb3-monolith/       # Scripts for InfluxDB 3 Core & Enterprise
├── influxdb3-distributed/    # Scripts for InfluxDB 3 Clustered & Cloud Dedicated
├── cloud-serverless/         # Scripts for InfluxDB Cloud Serverless
└── output/                   # Generated outputs from all scripts
```

## Product Categories

### InfluxDB 3 Monolith
- **Products**: InfluxDB 3 Core, InfluxDB 3 Enterprise
- **Deployment**: Single binary deployment
- **Scripts Location**: `influxdb3-monolith/`

### InfluxDB 3 Distributed
- **Products**: InfluxDB 3 Clustered, InfluxDB 3 Cloud Dedicated
- **Deployment**: Distributed/Kubernetes deployment
- **Scripts Location**: `influxdb3-distributed/`

### Cloud Serverless
- **Product**: InfluxDB Cloud Serverless
- **Deployment**: Fully managed cloud service
- **Scripts Location**: `cloud-serverless/`

## Common Scripts

### `common/generate-release-notes.js`
JavaScript ESM script that generates release notes by analyzing git commits across multiple repositories. Supports flexible configuration for different InfluxDB products and output formats.

**Usage:**
```bash
node common/generate-release-notes.js [options] <from_version> <to_version> [repo_paths...]
```

**Options:**
- `--config <file>` - Load configuration from JSON file
- `--format <type>` - Output format: 'integrated' or 'separated'
- `--no-fetch` - Skip fetching latest commits from remote
- `--pull` - Pull latest changes (use with caution)
- `--no-pr-links` - Omit PR links from commit messages

**Examples:**
```bash
# Using configuration file (recommended)
node common/generate-release-notes.js --config common/config/influxdb3-core-enterprise.json v3.1.0 v3.2.0

# Traditional command-line arguments
node common/generate-release-notes.js v3.1.0 v3.2.0 ~/repos/influxdb ~/repos/influxdb_pro
```

### `common/update-product-version.sh`
Updates product version numbers in `data/products.yml` and related documentation files.

**Usage:**
```bash
./common/update-product-version.sh --product <product> --version <version>
```

**Example:**
```bash
./common/update-product-version.sh --product core --version 3.2.1
```

## Product-Specific Scripts

### InfluxDB 3 Monolith (Core & Enterprise)

See [`influxdb3-monolith/README.md`](influxdb3-monolith/README.md) for detailed documentation.

**Key Scripts:**
- `audit-cli-documentation.sh` - Audits CLI commands against existing documentation
- `setup-auth-tokens.sh` - Sets up authentication tokens for local containers

### InfluxDB 3 Distributed (Clustered & Cloud Dedicated)

See [`influxdb3-distributed/README.md`](influxdb3-distributed/README.md) for detailed documentation.

**Key Scripts:**
- `clustered-release-artifacts.sh` - Downloads release artifacts for Clustered releases

## Output Directory

All scripts write their outputs to organized subdirectories:

```
output/
├── release-notes/      # Generated release notes
├── cli-audit/         # CLI documentation audit reports
├── api-audit/         # API documentation audit reports
└── artifacts/         # Downloaded release artifacts
```

## GitHub Workflow Integration

These scripts are integrated with GitHub Actions workflows:

- **Workflow**: `.github/workflows/prepare-release.yml`
- **Uses**: `generate-release-notes.js`, `update-product-version.sh`

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/influxdata/docs-v2.git
   cd docs-v2/helper-scripts
   ```

2. **Make scripts executable**
   ```bash
   find . -name "*.sh" -type f -exec chmod +x {} \;
   ```

3. **Run a script**
   ```bash
   # Generate release notes
   node common/generate-release-notes.js --config common/config/influxdb3-core-enterprise.json v3.1.0 v3.2.0
   
   # Audit CLI documentation
   node influxdb3-monolith/audit-cli-documentation.js core local
   ```

## Contributing

When adding new scripts:

1. Place in the appropriate product directory
2. Follow naming conventions (lowercase with hyphens)
3. Include comprehensive help text and documentation
4. Update the relevant README files
5. Test with all applicable products
6. Ensure outputs go to the `output/` directory

## Archived Scripts

Deprecated scripts are moved to `archive/` subdirectories. These scripts are kept for reference but should not be used in active workflows.