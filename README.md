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

```sh
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
```

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

```sh
# Set editor for all commands
export EDITOR=vim

# Set editor specifically for docs CLI
export DOCS_EDITOR=nano

# Use VS Code with built-in wait flag
export DOCS_EDITOR="code --wait"
```

**For Automated Workflows:**

The default non-blocking behavior prevents AI agents and automation scripts from hanging:

```sh
# In a script or CI pipeline
docs edit /some/url           # Returns immediately
echo "Editor launched"        # This runs right away

# If you need to wait (interactive editing)
docs edit /some/url --wait    # Blocks until editor closes
echo "Editor closed"          # This waits for editor to close
```

## Documentation

Comprehensive reference documentation for contributors:

- **[Contributing Guide](DOCS-CONTRIBUTING.md)** - Workflow and contribution guidelines
- **[Shortcodes Reference](DOCS-SHORTCODES.md)** - Complete Hugo shortcode documentation
  - [Working examples](content/example.md) - Test shortcodes in the browser
- **[Frontmatter Reference](DOCS-FRONTMATTER.md)** - Complete page metadata documentation
- **[Testing Guide](DOCS-TESTING.md)** - Testing procedures and requirements
- **[API Documentation](api-docs/README.md)** - API reference generation

### AI Assistant Instructions

Instructions for AI assistants working with this repository:

- **[GitHub Copilot Instructions](.github/copilot-instructions.md)** - For GitHub Copilot coding agents
- **[AI Agents Guide](AGENTS.md)** - For general AI assistants (Claude, ChatGPT, etc.)
- **[Instructions Navigation](.github/INSTRUCTIONS.md)** - Complete guide to all instruction files
- **[Claude Instructions](CLAUDE.md)** - For Claude Desktop and Claude Code users

### Quick Links

- [Style guidelines](DOCS-CONTRIBUTING.md#style-guidelines)
- [Commit guidelines](DOCS-CONTRIBUTING.md#commit-guidelines)
- [Code block testing](DOCS-TESTING.md#code-block-testing)

## Reporting a Vulnerability

InfluxData takes security and our users' trust very seriously.
If you believe you have found a security issue in any of our open source projects,
please responsibly disclose it by contacting <security@influxdata.com>.
More details about security vulnerability reporting,
including our GPG key, can be found at <https://www.influxdata.com/how-to-report-security-vulnerabilities/>.

## Running the docs locally

1. [**Clone this repository**](https://help.github.com/articles/cloning-a-repository/) to your local machine.

2. **Install NodeJS, Yarn, Hugo, & Asset Pipeline Tools**

   The InfluxData documentation uses [Hugo](https://gohugo.io/), a static site generator built in Go. The site uses Hugo's asset pipeline, which requires the extended version of Hugo along with NodeJS tools like PostCSS, to build and process stylesheets and JavaScript.

   To install the required dependencies and build the assets, do the following:

   1. [Install NodeJS](https://nodejs.org/en/download/)
   2. [Install Yarn](https://classic.yarnpkg.com/en/docs/install/)
   3. In your terminal, from the `docs-v2` directory, install the dependencies:

      ```sh
      cd docs-v2
      yarn install
      ```

      ***Note:** The most recent version of Hugo tested with this documentation is **0.149.0**.*

      After installation, the `docs` command will be available via `npx`:

      ```sh
      npx docs --help
      ```

3. To generate the API docs, see [api-docs/README.md](api-docs/README.md).

4. **Start the Hugo server**

   Hugo provides a local development server that generates the HTML pages, builds the static assets, and serves them at `localhost:1313`.

   In your terminal, start the Hugo server:

   ```sh
   npx hugo server
   ```

5. View the docs at [localhost:1313](http://localhost:1313).

### Alternative: Use docker compose

1. Clone this repository to your local machine. See how to [clone a repository](https://help.github.com/articles/cloning-a-repository/).

2. Follow the instructions to [install Docker Desktop](https://docs.docker.com/desktop/) and [Docker Compose](https://docs.docker.com/compose/) to your local machine.

3. Use Docker Compose to start the Hugo server in development mode--for example, enter the following command in your terminal:

   ```sh
   docker compose up local-dev
   ```

4. View the docs at [localhost:1313](http://localhost:1313).
