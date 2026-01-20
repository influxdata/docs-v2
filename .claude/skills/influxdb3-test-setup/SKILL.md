---
name: influxdb3-test-setup
description: Set up InfluxDB 3 Core and Enterprise instances for running documentation code block tests. Handles service initialization, worktree-specific databases, and test environment configuration.
author: InfluxData
version: "1.0"
---

# InfluxDB 3 Test Setup Skill

## Purpose

This skill guides agents through setting up InfluxDB 3 Core and Enterprise instances for testing documentation code blocks. It covers service initialization, creating worktree-specific databases for test isolation, and configuring the test environment.

## Architecture Overview

```
~/influxdata-docs/.influxdb3/          # Shared across all worktrees
├── enterprise/
│   ├── .env                           # License email (INFLUXDB3_ENTERPRISE_LICENSE_EMAIL)
│   └── data/                          # Enterprise data (persists license)
└── plugins/                           # Shared plugins

<worktree>/test/.influxdb3/            # Per-worktree (gitignored)
├── core/
│   ├── .token                         # Core auth token
│   ├── data/                          # Core data
│   └── plugins/                       # Custom plugins
└── .env.test                          # Test credentials
```

**Key Design Decisions:**

- **Core**: Per-worktree instance (port 8282) - data isolated to worktree
- **Enterprise**: Shared instance (port 8181) - license persists across worktrees
- **Databases**: Create worktree-named databases for test isolation on shared Enterprise

## Quick Reference

| Task                    | Command                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| Initialize Core         | `./test/scripts/init-influxdb3.sh core`                                |
| Initialize Enterprise   | `./test/scripts/init-influxdb3.sh enterprise`                          |
| Initialize both         | `./test/scripts/init-influxdb3.sh all`                                 |
| Check Core status       | `curl -i http://localhost:8282/ping`                                   |
| Check Enterprise status | `curl -i http://localhost:8181/ping -H "Authorization: Bearer $TOKEN"` |
| Run code block tests    | `yarn test:codeblocks:v2`                                              |

## Setup Workflows

### Workflow 1: Core Only (Per-Worktree)

Use when testing Core-specific documentation or when you need complete isolation.

```bash
# 1. Initialize Core
./test/scripts/init-influxdb3.sh core

# 2. Verify it's running
curl -i http://localhost:8282/ping

# 3. Get your token (JSON format)
jq -r .token test/.influxdb3/core/.token

# 4. Create a database for testing
curl -X POST "http://localhost:8282/api/v3/configure/database" \
  -H "Authorization: Bearer $(jq -r .token test/.influxdb3/core/.token)" \
  -H "Content-Type: application/json" \
  -d '{"db": "test_db"}'
```

### Workflow 2: Enterprise (Shared Instance)

Use when testing Enterprise-specific documentation. Creates worktree-named database for isolation.

```bash
# 1. First-time only: Create .env file with license email
mkdir -p ~/influxdata-docs/.influxdb3/enterprise
echo 'INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=your-email@example.com' > \
  ~/influxdata-docs/.influxdb3/enterprise/.env

# 2. Initialize Enterprise (generates admin token and starts service)
./test/scripts/init-influxdb3.sh enterprise

# 3. Get admin token from the generated file
ADMIN_TOKEN=$(jq -r .token ~/influxdata-docs/.influxdb3/enterprise/admin-token.json)

# 4. Verify it's running
curl -i http://localhost:8181/ping \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 5. Create worktree-named database for test isolation
WORKTREE_NAME=$(basename "$(pwd)" | tr '-' '_')
curl -X POST "http://localhost:8181/api/v3/configure/database" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"db\": \"${WORKTREE_NAME}_db\"}"
```

### Workflow 3: Both Services

Use when testing documentation that covers both Core and Enterprise.

```bash
# Initialize both
./test/scripts/init-influxdb3.sh all

# Verify both are running
curl -i http://localhost:8282/ping  # Core (no auth by default)
curl -i http://localhost:8181/ping -H "Authorization: Bearer $TOKEN"  # Enterprise
```

## Creating Worktree-Specific Databases

When using the shared Enterprise instance, create databases named after the worktree to isolate test data:

```bash
# Get worktree name (converts hyphens to underscores for valid DB names)
WORKTREE_NAME=$(basename "$(pwd)" | tr '-' '_')
echo "Database name: ${WORKTREE_NAME}_db"

# Create database
curl -X POST "http://localhost:8181/api/v3/configure/database" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"db\": \"${WORKTREE_NAME}_db\"}"

# List databases to verify
curl "http://localhost:8181/api/v3/configure/database" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Naming Convention:**

- Worktree: `docs-v2-influxdb3-version-detection-headers`
- Database: `docs_v2_influxdb3_version_detection_headers_db`

## Test Environment Configuration

### Configure .env.test for Code Block Tests

Create `content/<product>/.env.test` with test credentials:

```bash
# For Enterprise testing
ADMIN_TOKEN=$(jq -r .token ~/influxdata-docs/.influxdb3/enterprise/admin-token.json)
cat > content/influxdb3/enterprise/.env.test << EOF
INFLUX_HOST=http://localhost:8181
INFLUX_TOKEN=$ADMIN_TOKEN
INFLUX_DATABASE=YOUR_WORKTREE_DB
EOF

# For Core testing
cat > content/influxdb3/core/.env.test << EOF
INFLUX_HOST=http://localhost:8282
INFLUX_TOKEN=$(jq -r .token test/.influxdb3/core/.token)
INFLUX_DATABASE=test_db
EOF
```

### Run Code Block Tests

```bash
# Test specific product
yarn test:codeblocks:v2

# Or run pytest directly
docker compose run --rm v2-pytest
```

## Troubleshooting

### Enterprise Won't Start

**Symptom:** Container exits immediately

**Check:**

```bash
# View container logs
docker logs influxdb3-enterprise

# Common issues:
# 1. Missing .env file
ls -la ~/influxdata-docs/.influxdb3/enterprise/.env

# 2. Wrong env var name (must be INFLUXDB3_ENTERPRISE_LICENSE_EMAIL)
cat ~/influxdata-docs/.influxdb3/enterprise/.env

# 3. Missing admin-token.json (run init script to generate)
ls -la ~/influxdata-docs/.influxdb3/enterprise/admin-token.json
```

### Core Token Not Working

**Symptom:** 401 Unauthorized

**Check:**

```bash
# Verify token file exists and is valid JSON
cat test/.influxdb3/core/.token
jq . test/.influxdb3/core/.token  # Should parse without errors

# Verify token is accessible in container (as secret)
docker exec influxdb3-core cat /run/secrets/influxdb3-core-token
```

### Port Already in Use

**Symptom:** "port is already allocated"

**Fix:**

```bash
# Find what's using the port
lsof -i :8181  # Enterprise
lsof -i :8282  # Core

# Stop existing containers
docker compose down influxdb3-enterprise influxdb3-core
```

### Getting the Admin Token

The init script generates and saves admin tokens to JSON files for both Core and Enterprise:

```bash
# Core token
cat test/.influxdb3/core/.token
jq -r .token test/.influxdb3/core/.token

# Enterprise token
cat ~/influxdata-docs/.influxdb3/enterprise/admin-token.json
jq -r .token ~/influxdata-docs/.influxdb3/enterprise/admin-token.json

# Export for use in commands
export INFLUXDB3_CORE_TOKEN=$(jq -r .token test/.influxdb3/core/.token)
export INFLUXDB3_ENTERPRISE_TOKEN=$(jq -r .token ~/influxdata-docs/.influxdb3/enterprise/admin-token.json)

# Use in API calls
curl -i http://localhost:8282/ping -H "Authorization: Bearer $INFLUXDB3_CORE_TOKEN"
curl -i http://localhost:8181/ping -H "Authorization: Bearer $INFLUXDB3_ENTERPRISE_TOKEN"
```

**Token File Format** (both Core and Enterprise):
```json
{
  "token": "64-character-hexadecimal-token",
  "description": "Admin token for InfluxDB 3 Core/Enterprise"
}
```

## Service Comparison

| Aspect        | Core             | Enterprise                       |
| ------------- | ---------------- | -------------------------------- |
| Port          | 8282             | 8181                             |
| Data location | Per-worktree     | Shared                           |
| Auth default  | Optional         | Required                         |
| License       | None             | Trial/Paid                       |
| Use case      | Isolated testing | Shared testing with worktree DBs |

## Related Files

- **Init script**: `test/scripts/init-influxdb3.sh`
- **Docker Compose**: `compose.yaml` (services: influxdb3-core, influxdb3-enterprise)
- **Test config**: `content/<product>/.env.test`

## Related Skills

- **cypress-e2e-testing** - For running E2E tests on documentation UI
- **docs-cli-workflow** - For creating/editing documentation content
