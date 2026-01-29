# Configuration Guide

## Overview

The docs CLI uses environment variables for configuration. All sensitive information (repository URLs, access flags) is user-provided via `.env` file, never hardcoded in the codebase.

## Quick Setup

1. **Copy the example configuration:**
   ```bash
   cp config/.env.example .env
   ```

2. **Authenticate with GitHub CLI:**
   ```bash
   gh auth login
   ```

3. **Run commands:**
   ```bash
   npm run docs audit core main
   ```

**IMPORTANT:** Never commit the `.env` file - it's in `.gitignore`.

---

## Configuration Options

### Product Access

#### `DOCS_ENTERPRISE_ACCESS`
Flag indicating you have access to audit Enterprise products.

**Default:** `false`

**When to set:** You have access to Enterprise repositories and want to run Enterprise audits.

**Example:**
```bash
DOCS_ENTERPRISE_ACCESS=true
```

**Requires:** 
- GitHub authentication (`gh auth login`)
- Access to Enterprise repositories on GitHub
- `DOCS_ENTERPRISE_REPO_URL` configured

---

### Repository URLs

The audit command clones repositories from GitHub. Defaults are set for public repositories. Configure these if using forks, mirrors, or private repositories.

#### `DOCS_CORE_REPO_URL`
URL for the Core product repository.

**Default:** `https://github.com/influxdata/influxdb.git` (public)

**When to set:** Using a fork or mirror.

**Example:**
```bash
DOCS_CORE_REPO_URL=https://github.com/your-org/your-repo.git
```

#### `DOCS_ENTERPRISE_REPO_URL`
URL for the Enterprise product repository.

**Default:** None (must be configured for Enterprise audits)

**When to set:** Running Enterprise audits.

**Requires:** `DOCS_ENTERPRISE_ACCESS=true`

**Example:**
```bash
DOCS_ENTERPRISE_ACCESS=true
DOCS_ENTERPRISE_REPO_URL=https://github.com/your-org/your-enterprise-repo.git
```

#### `DOCS_TELEGRAF_REPO_URL`
URL for Telegraf repository.

**Default:** `https://github.com/influxdata/telegraf.git` (public)

**When to set:** Using a fork or mirror.

**Example:**
```bash
DOCS_TELEGRAF_REPO_URL=https://github.com/your-org/telegraf.git
```

#### `DOCS_REPO_URL`
URL for the documentation repository.

**Default:** `https://github.com/influxdata/docs-v2.git` (public)

**When to set:** Testing against a fork or staging docs repository.

**Example:**
```bash
DOCS_REPO_URL=https://github.com/your-org/docs-v2.git
```

---

### Repository Paths (Local Development)

For local development workflows, you can specify filesystem paths. The CLI will search common locations automatically.

#### `DOCS_V2_PATH`
Local path to docs-v2 repository.

**Default:** Auto-detected in common locations

**When to set:** Repository is in non-standard location.

**Example:**
```bash
DOCS_V2_PATH=~/my-projects/docs-v2
```

#### `INFLUXDB_CORE_PATH`
Local path to Core product repository.

**Default:** Auto-detected

**When to set:** Non-standard location.

**Example:**
```bash
INFLUXDB_CORE_PATH=~/my-projects/influxdb
```

#### `TELEGRAF_PATH`
Local path to Telegraf repository.

**Default:** Auto-detected

**When to set:** Non-standard location.

**Example:**
```bash
TELEGRAF_PATH=~/my-projects/telegraf
```

---

### Worktree Configuration

#### `WORKTREE_BASE_PATH`
Base directory for worktree project folders.

**Default:** `./.worktrees`

**When to set:** You want worktree projects in a different location.

**Example:**
```bash
WORKTREE_BASE_PATH=~/projects/worktrees
```

---

## GitHub Authentication

This CLI uses the **GitHub CLI (`gh`)** for authentication.

### Setup
```bash
# Install gh CLI (if not installed)
# macOS: brew install gh

# Authenticate
gh auth login

# Verify
gh auth status
```

### Why GitHub CLI?

✅ **Secure:** No tokens in config files  
✅ **Easy:** One-time setup  
✅ **Standard:** Works with all repositories  
✅ **Automatic:** Token refresh handled automatically

---

## Security Best Practices

### ✅ DO

- Keep `.env` file local only (never commit)
- Use `config/.env.example` as your template
- Use GitHub CLI (`gh`) for authentication
- Only configure what you need
- Review configuration before committing code changes

### ❌ DON'T

- Commit `.env` to git (it's in `.gitignore`)
- Share repository URLs in public channels
- Hardcode paths or credentials in code
- Expose private repository names in documentation
- Store tokens in environment variables (use `gh` CLI)

---

## Example Configurations

### Minimal (Public repositories only)
```bash
# No .env needed - uses public defaults
# Just authenticate with GitHub
```

### Enterprise Developer
```bash
# .env file
DOCS_ENTERPRISE_ACCESS=true
DOCS_ENTERPRISE_REPO_URL=<your-enterprise-repo-url>
```

### Custom Repository Locations
```bash
# .env file
DOCS_V2_PATH=~/custom/path/docs-v2
INFLUXDB_CORE_PATH=~/custom/path/influxdb
```

### Using Forks
```bash
# .env file
DOCS_CORE_REPO_URL=https://github.com/myorg/influxdb.git
DOCS_REPO_URL=https://github.com/myorg/docs-v2.git
```

---

## Troubleshooting

### "GitHub CLI not authenticated"

**Solution:**
```bash
gh auth login
```

### "Enterprise audit requires configuration"

**Solution:**
1. Verify you have GitHub access to Enterprise repositories
2. Add to `.env`:
   ```bash
   DOCS_ENTERPRISE_ACCESS=true
   DOCS_ENTERPRISE_REPO_URL=<your-enterprise-repo-url>
   ```

### Repository Not Found

**Solution:**
1. Check repository exists and you have access
2. Verify URL in `.env` is correct
3. Ensure `gh auth status` shows authentication

### Configuration Not Loading

**Solution:**
1. Verify `.env` is in repository root (not `config/` directory)
2. Check file syntax (KEY=value format, no spaces around `=`)
3. Restart any running CLI processes

---

## Getting Help

- **CLI help:** `npm run docs -- --help`
- **Command help:** `npm run docs audit --help`
- **Configuration issues:** Check this README
- **Security concerns:** Contact your team lead

---

## Related Documentation

- [Main README](../README.md) - CLI overview and commands
- [.env.example](./env.example) - Configuration template
- [GitHub CLI docs](https://cli.github.com/manual/) - GitHub authentication
