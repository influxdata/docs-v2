# Common Helper Scripts

This directory contains scripts that are shared across all InfluxDB documentation products.

## Scripts

No scripts are shared at the top level of this directory.
To update a product version, edit `latest_patch` in `data/products.yml`.

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
