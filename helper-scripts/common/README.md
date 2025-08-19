# Common Helper Scripts

This directory contains scripts that are shared across all InfluxDB documentation products.

## Scripts

### generate-release-notes.js

JavaScript ESM script that generates release notes by analyzing git commits between two versions across multiple repositories. Supports flexible configuration for different InfluxDB products and output formats.

**Usage:**
```bash
node generate-release-notes.js [options] <from_version> <to_version> [repo_paths...]
```

**Options:**
- `--config <file>` - Load configuration from JSON file (recommended)
- `--format <type>` - Output format: 'integrated' or 'separated'
- `--no-fetch` - Skip fetching latest commits from remote
- `--pull` - Pull latest changes (use with caution)
- `--no-pr-links` - Omit PR links from commit messages

**Examples:**
```bash
# Using configuration file (recommended for InfluxDB 3 Core/Enterprise)
node generate-release-notes.js --config config/influxdb3-core-enterprise.json v3.1.0 v3.2.0

# Using configuration file for other products
node generate-release-notes.js --config config/influxdb3-clustered.json v1.0.0 v1.1.0

# Traditional command-line arguments
node generate-release-notes.js v3.1.0 v3.2.0 ~/repos/influxdb ~/repos/influxdb_pro

# Skip fetch for faster local testing
node generate-release-notes.js --no-fetch v3.1.0 v3.2.0 ~/repos/influxdb
```

**Configuration Files:**
- `config/influxdb3-core-enterprise.json` - InfluxDB 3 Core/Enterprise separated format
- `config/influxdb3-clustered.json` - InfluxDB 3 Clustered integrated format
- `config/influxdb-v2.json` - InfluxDB v2.x integrated format

**Output:**
- Creates `release-notes-<version>.md` in `../output/release-notes/`
- Supports two formats:
  - **Integrated**: All repositories' changes combined in unified sections
  - **Separated**: Primary repository first, then secondary repositories (ideal for Core/Enterprise)
- Includes sections for Features, Bug Fixes, Breaking Changes, Performance, and API changes
- Automatically links to GitHub pull requests (configurable per repository)

### update-product-version.sh

Updates product version information in documentation configuration files.

**Usage:**
```bash
./update-product-version.sh --product <product> --version <version>
```

**Supported Products:**
- `core` - InfluxDB 3 Core
- `enterprise` - InfluxDB 3 Enterprise
- `clustered` - InfluxDB 3 Clustered
- `cloud-dedicated` - InfluxDB 3 Cloud Dedicated
- `cloud-serverless` - InfluxDB Cloud Serverless

**Example:**
```bash
# Update Core to version 3.2.1
./update-product-version.sh --product core --version 3.2.1

# Update Clustered to version 2024.1
./update-product-version.sh --product clustered --version 2024.1
```

**What it updates:**
- `data/products.yml` - Main product version configuration
- Docker Compose example files
- Installation instructions
- Download links

## Library Functions

### lib/docker-utils.sh

Shared Docker utility functions used by other scripts.

**Available Functions:**
- `check_docker_running()` - Verify Docker daemon is running
- `container_exists()` - Check if a container exists
- `container_running()` - Check if a container is running
- `pull_image()` - Pull Docker image with retry logic
- `load_auth_token()` - Load authentication tokens from secret files

**Usage in scripts:**
```bash
source "$(dirname "$0")/../common/lib/docker-utils.sh"

if container_running "influxdb3-core"; then
    echo "Container is running"
fi
```

## Integration with GitHub Actions

These scripts are designed to work in both local development and CI/CD environments:

**Local Development:**
- Assumes Docker Desktop or Docker Engine installed
- Uses local file paths for repositories
- Can work with running containers

**GitHub Actions:**
- Automatically detects CI environment
- Uses workspace paths
- Handles authentication via secrets

## Best Practices

1. **Error Handling**: All scripts use `set -e` to exit on errors
2. **Logging**: Color-coded output for better readability
3. **Validation**: Input validation before processing
4. **Idempotency**: Scripts can be run multiple times safely
5. **Documentation**: Comprehensive help text in each script

## Adding New Common Scripts

When adding scripts to this directory:

1. Ensure they are truly product-agnostic
2. Follow existing naming conventions
3. Add comprehensive documentation
4. Include error handling and validation
5. Update this README
6. Test with all supported products