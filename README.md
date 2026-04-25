<p align="center">
  <img src="/static/img/influx-logo-cubo-dark.png" width="200">
</p>

# InfluxData Product Documentation

This repository contains the InfluxData product documentation for InfluxDB and related tooling published at [docs.influxdata.com](https://docs.influxdata.com).

## Contributing

We welcome and encourage community contributions.
For information about contributing to the InfluxData documentation, see [Contribution guidelines](DOCS-CONTRIBUTING.md).

## Testing

For information about testing the documentation, including code block testing, link validation, and style linting, see [Testing guide](DOCS-TESTING.md).

## Documentation Tools

This repository includes a `docs` CLI tool for common documentation workflows:

sh
# Create new documentation from a draft
npx docs create drafts/new-feature.md --products influxdb3_core

# Create and open files in editor (non-blocking)
npx docs create drafts/new-feature.md --products influxdb3_core --open

# Create and open, wait for editor (blocking)
npx docs create drafts/new-feature.md --products influxdb3_core --open --wait

# Edit existing documentation (supports full URLs or paths)
npx docs edit https://docs.influxdata.com/influxdb3/core/admin/
npx docs edit /influxdb3/core/admin/

# Edit and wait for editor to close (blocking)
npx docs edit /influxdb3/core/admin/ --wait

# List files without opening
npx docs edit /influxdb3/core/admin/ --list

# Use a specific editor
npx docs edit /influxdb3/core/admin/ --editor nano

# Add placeholder syntax to code blocks
npx docs placeholders content/influxdb3/core/admin/upgrade.md

# Get help
npx docs --help


The `docs` command is automatically configured when you run `yarn install`.

### Editor Configuration

The `docs edit` and `docs create --open` commands open documentation files in your preferred editor. By default, they launch the editor in the background and exit immediately (agent-friendly). Use the `--wait` flag for interactive editing sessions.

**Setting Your Editor:**

The CLI selects an editor in this priority order:

1. `--editor` flag
2. `DOCS_EDITOR` environment variable
3. `VISUAL` environment variable
4. `EDITOR` environment variable
5. System default (vim, nano, etc.)

**Examples:**

sh
# Set editor for all commands
export EDITOR=vim

# Set editor specifically for docs CLI
export DOCS_EDITOR=nano

# Use VS Code with built-in wait flag
export DOCS_EDITOR="code --wait"


**For Automated Workflows:**

The default non-blocking behavior prevents AI agents and automation scripts from hanging:

sh
# In a script or CI pipeline
docs edit /some/url           # Returns immediately
echo "Editor launched"        # This runs right away

# If you need to wait (interactive editing)
docs edit /some/url --wait    # Blocks until editor closes
echo "Editor closed"          # This waits for editor to close


## Documentation

Comprehensive reference documentation for contributors:

- **[Contributing Guide](DOCS-CONTRIBUTING.md)** - 

content/influxdb/cloud/reference/release-notes/influx-cli.md and content/influxdb/v2/reference/release-notes/influx-cli.md have been updated to remove the repeated 'and'.