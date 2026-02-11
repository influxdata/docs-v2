# docs CLI Configuration

The docs CLI uses a layered configuration system that merges defaults with local overrides.

## Quick Start

Copy `example.yml` to one of:

- `~/.influxdata-docs/docs-cli.yml` - User-level config (applies to all projects)
- `.docs-cli.local.yml` - Project-level config (gitignored)

Then edit to add your local repository paths.

## Configuration Files

Files are loaded in this order (later files override earlier ones):

1. **`lib/defaults.js`** - Shipped defaults (public repos only)
2. **`~/.influxdata-docs/docs-cli.yml`** - User-level config
3. **`.docs-cli.local.yml`** - Project-level config (gitignored)
4. **`DOCS_CLI_CONFIG` env var** - Points to a custom config file
5. **`--config` flag** - Command-line override

## Setting Up Local Repository Paths

The defaults contain public GitHub URLs but no local paths. To use commands that need local repo access (like `release-notes`), create a local config:

```yaml
# ~/.influxdata-docs/docs-cli.yml
repositories:
  influxdb3_core:
    path: ~/github/influxdata/influxdb

  influxdb3_enterprise:
    # Private repo - add your local path
    path: ~/github/influxdata/<private-repo>

  telegraf:
    path: ~/github/influxdata/telegraf
```

## Configuration Reference

### repositories

Repository keys match product keys in `data/products.yml`:

```yaml
repositories:
  influxdb3_core:
    path: ~/local/path/to/repo
  influxdb3_enterprise:
    path: ~/local/path/to/private-repo
```

### releaseNotes

Configure the `docs release-notes` command:

```yaml
releaseNotes:
  outputFormat: integrated  # 'integrated' or 'separated'
  includePrLinks: true      # Note: private repos won't have PR links
  primaryRepo: influxdb3_core
```

### editor

Configure editor behavior for `docs edit`:

```yaml
editor:
  default: code    # Default editor command
  wait: false      # Wait for editor to close
```

### scaffolding

Configure `docs create` defaults:

```yaml
scaffolding:
  ai: claude           # AI tool: claude, copilot, etc.
  followExternal: false
```

## Using Configs with Commands

### release-notes

```bash
# Use repos from config by name
docs release-notes v3.1.0 v3.2.0 --repo influxdb3_core

# Override with specific paths
docs release-notes v3.1.0 v3.2.0 ~/repos/influxdb
```

### edit

```bash
# Uses editor.default from config
docs edit /influxdb3/core/install/

# Override with flag
docs edit /influxdb3/core/install/ --editor vim
```

## Security Notes

- **Never commit private repo URLs/paths** to checked-in files
- Use local configs (`~/.docs-cli.yml` or `.docs-cli.local.yml`) for private repos
- The `.docs-cli.local.yml` pattern is gitignored by default
