# InfluxData Documentation Repository (docs-v2)

> **For GitHub Copilot and other AI coding agents**
>
> This is the primary instruction file for GitHub Copilot working with the InfluxData documentation site.
> For detailed information on specific topics, refer to the specialized instruction files in `.github/instructions/`.
>
> **Other instruction resources**:
>
> - [AGENTS.md](../AGENTS.md) - For general AI assistants (Claude, ChatGPT, etc.) with detailed workflow examples
> - [CLAUDE.md](../CLAUDE.md) - For Claude with MCP
> - [.github/agents/](agents/) - Custom specialist agents for specific tasks
> - [.github/instructions/](instructions/) - File pattern-specific instructions (auto-loaded)

## Quick Reference

| Task             | Command                                               | Time    | Details                    |
| ---------------- | ----------------------------------------------------- | ------- | -------------------------- |
| Install          | `CYPRESS_INSTALL_BINARY=0 yarn install`               | \~4s    | Skip Cypress for CI        |
| Build            | `npx hugo --quiet`                                    | \~75s   | NEVER CANCEL               |
| Dev Server       | `npx hugo server`                                     | \~92s   | Port 1313                  |
| Create Docs      | `docs create <draft> --products <keys>`               | varies  | AI-assisted scaffolding    |
| Create & Open    | `docs create <draft> --products <keys> --open`        | instant | Non-blocking (background)  |
| Create & Wait    | `docs create <draft> --products <keys> --open --wait` | varies  | Blocking (interactive)     |
| Edit Docs        | `docs edit <url>`                                     | instant | Non-blocking (background)  |
| Edit Docs (wait) | `docs edit <url> --wait`                              | varies  | Blocking (interactive)     |
| List Files       | `docs edit <url> --list`                              | instant | Show files without opening |
| Test All         | `yarn test:codeblocks:all`                            | 15-45m  | NEVER CANCEL               |
| Lint             | `yarn lint`                                           | \~1m    | Pre-commit checks          |

## CLI Tools

### docs create - Create Documentation Files

Scaffolds new documentation pages with AI-assisted analysis. **Optionally opens created files in editor.**

**Examples:**

```bash
# Create from draft (no editor)
docs create drafts/new-feature.md --products influxdb3_core

# Create and open files (non-blocking, exits immediately)
docs create drafts/new-feature.md --products influxdb3_core --open

# Create and open, wait for editor (blocking, interactive)
docs create drafts/new-feature.md --products influxdb3_core --open --wait

# Use specific editor
docs create drafts/new-feature.md --products influxdb3_core --open --editor nano

# Create at specific URL location
docs create --url /influxdb3/core/admin/new/ --from-draft drafts/feature.md
```

**Options:**

- `--open` - Open created files in editor after creation (non-blocking by default)
- `--wait` - Wait for editor to close (use with `--open`)
- `--editor <cmd>` - Specify editor command (use with `--open`)
- `--products <keys>` - Comma-separated product keys (required)
- `--dry-run` - Show what would be created without creating files
- `--yes` - Skip confirmation prompt

### docs edit - Edit Documentation Files

Opens documentation files in your editor. **Non-blocking by default** (agent-friendly).

**Examples:**

```bash
# Quick edit (exits immediately, editor in background)
docs edit https://docs.influxdata.com/influxdb3/core/admin/databases/
docs edit /influxdb3/core/admin/databases/

# Interactive edit (waits for editor to close)
docs edit /influxdb3/core/admin/databases/ --wait

# List files without opening
docs edit /influxdb3/core/admin/databases/ --list

# Use specific editor
docs edit /influxdb3/core/admin/databases/ --editor nano
```

**Options:**

- `--list` - List files without opening editor
- `--wait` - Wait for editor to close (blocking mode)
- `--editor <cmd>` - Specify editor command

### Editor Configuration

Both `docs create --open` and `docs edit` use the same editor resolution:

**Priority order:**

1. `--editor` flag
2. `DOCS_EDITOR` environment variable
3. `VISUAL` environment variable
4. `EDITOR` environment variable
5. System default (vim, nano, etc.)

**Examples:**

```bash
export EDITOR=vim        # For all CLI tools
export DOCS_EDITOR=nano  # Specifically for docs CLI
export DOCS_EDITOR="code --wait"  # VS Code with wait flag
```

**Important for AI Agents:**

- Both commands are **non-blocking by default** (exit immediately)
- This prevents agents and automation from hanging
- Use `--wait` flag only when you need blocking behavior
- For `docs create`, omit `--open` to skip editor entirely

## Working Effectively

### Collaboration approach

Be a critical thinking partner, provide honest feedback, and identify potential issues.

### Setup Steps

1. Install dependencies (see Quick Reference table above)
2. Build the static site
3. Start development server at <http://localhost:1313/>
4. Alternative: Use `docker compose up local-dev` if local setup fails

### Testing

For comprehensive testing procedures, see **[DOCS-TESTING.md](../DOCS-TESTING.md)**.

**Quick reference** (NEVER CANCEL long-running tests):

- **Code blocks**: `yarn test:codeblocks:all` (15-45 minutes)
- **Links**: `yarn test:links` (1-5 minutes, requires link-checker binary)
- **Style**: `docker compose run -T vale content/**/*.md` (30-60 seconds)
- **Pre-commit**: `yarn lint` (or skip with `--no-verify`)

#### InfluxDB 3 Test Setup

For setting up InfluxDB 3 Core and Enterprise instances for testing code blocks:

**Quick setup commands:**
```bash
# Initialize Core (per-worktree, port 8282)
./test/scripts/init-influxdb3.sh core

# Initialize Enterprise (shared, port 8181)
./test/scripts/init-influxdb3.sh enterprise

# Initialize both
./test/scripts/init-influxdb3.sh all
```

**Key features:**
- Core: Per-worktree data isolation at `test/.influxdb3/core/`
- Enterprise: Shared data at `~/influxdata-docs/.influxdb3/enterprise/` (persists license)
- Worktree-specific databases for test isolation on shared Enterprise instance
- Auto-configured `.env.test` files for pytest-codeblocks

For detailed workflows and troubleshooting, see the **[influxdb3-test-setup skill](.claude/skills/influxdb3-test-setup/SKILL.md)** or invoke the `influxdb3-test-setup` skill.

### Validation

Test these after changes:

```bash
# 1. Server renders pages (check 200 status)
curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/influxdb3/core/

# 2. Build outputs exist (~529MB)
npx hugo --quiet && du -sh public/

# 3. Shortcodes work
yarn test:links content/example.md
```

## Repository Structure

### Content Organization

- **InfluxDB 3**: `/content/influxdb3/` (core, enterprise, cloud-dedicated, cloud-serverless, clustered, explorer)
- **InfluxDB v2**: `/content/influxdb/` (v2, cloud)
- **InfluxDB v1**: `/content/influxdb/v1`
- **InfluxDB Enterprise (v1)**: `/content/enterprise_influxdb/v1/`
- **Telegraf**: `/content/telegraf/v1/`
- **Kapacitor**: `/content/kapacitor/`
- **Chronograf**: `/content/chronograf/`
- **Flux**: `/content/flux/`
- **Examples**: `/content/example.md` (comprehensive shortcode reference)
- **Shared content**: `/content/shared/`

### Key Files

- **Config**: `/config/_default/`, `package.json`, `compose.yaml`, `lefthook.yml`
- **Testing**: `cypress.config.js`, `pytest.ini`, `.vale.ini`
- **Assets**: `/assets/` (JS, CSS), `/layouts/` (templates), `/data/` (YAML/JSON)
- **Build output**: `/public/` (\~529MB, gitignored)

## Technology Stack

- **Hugo** - Static site generator
- **Node.js/Yarn** - Package management
- **Testing**: Pytest, Cypress, link-checker, Vale
- **Tools**: Docker, ESLint, Prettier, Lefthook

## Common Issues

### Network Restrictions

Commands that may fail in restricted environments:

- Docker builds (external repos)
- `docker compose up local-dev` (Alpine packages)
- Cypress installation (use `CYPRESS_INSTALL_BINARY=0`)

### Pre-commit Validation

```bash
# Quick validation before commits
yarn prettier --write "**/*.{css,js,ts,jsx,tsx}"
yarn eslint assets/js/**/*.js
npx hugo --quiet
```

## Documentation Coverage

- **InfluxDB 3**: Core, Enterprise, Cloud (Dedicated/Serverless), Clustered, Explorer, plugins
- **InfluxDB v2/v1**: OSS, Cloud, Enterprise
- **Tools**: Telegraf, Kapacitor, Chronograf, Flux
- **API Reference**: All InfluxDB editions

## Content Guidelines

- **Product versions**: `/data/products.yml`
- **Query languages**: SQL, InfluxQL, Flux (per product version)
- **Site**: <https://docs.influxdata.com>

### Writing Style

Follow these conventions when creating or editing documentation:

- **Style guide**: Google Developer Documentation Style Guide
- **Voice**: Active voice, present tense, second person for instructions
- **Line breaks**: Use semantic line feeds (one sentence per line) for better diffs
- **Formatting**:
  - Headings: Use h2-h6 only (h1 auto-generated from frontmatter `title`)
  - Code blocks: Format within 80 characters where possible
  - CLI examples: Use long options (`--option` not `-o`)
- **Tone**: Technical but friendly, no emojis unless explicitly requested
- **Files**: Use lowercase-with-hyphens.md naming convention
- **Images**: Use pattern `project/version-context-description.png`

### Common Shortcodes

**Callouts** (use GitHub-style alerts):

```markdown
> [!Note]
> [!Warning]
> [!Caution]
> [!Important]
> [!Tip]
```

**Required elements**:

```markdown
{{< req >}}
{{< req type="key" >}}
```

**Code placeholders**:

````markdown
```sh { placeholders="DATABASE_NAME|API_TOKEN" }
curl -X POST https://cloud2.influxdata.com/api/v2/write?bucket=DATABASE_NAME
```
````

For complete shortcode reference, see [DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md).

### Commit Messages

Use conventional commit format:

```
type(scope): brief description

Examples:
- fix(enterprise): correct Docker environment variable
- feat(influxdb3): add new plugin documentation
- docs(core): update configuration examples
```

**Types**: `fix`, `feat`, `style`, `refactor`, `test`, `chore`, `docs`\
**Scopes**: `enterprise`, `influxdb3`, `core`, `cloud`, `telegraf`, product/component names

Skip pre-commit hooks (if needed): `git commit --no-verify`

### Writing Documentation

For detailed guidelines, see:

- **Workflow**: [DOCS-CONTRIBUTING.md](../DOCS-CONTRIBUTING.md) - Contribution guidelines and workflow
- **Shortcodes**: [DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md) - Complete shortcode reference
  - **Examples**: [content/example.md](../content/example.md) - Working examples for testing
- **Frontmatter**: [DOCS-FRONTMATTER.md](../DOCS-FRONTMATTER.md) - Complete page metadata reference
- **Testing**: [DOCS-TESTING.md](../DOCS-TESTING.md) - Testing procedures
- **API Docs**: [api-docs/README.md](../api-docs/README.md) - API documentation workflow

### Required Frontmatter

Every content file needs:

```yaml
---
title:       # Page h1 heading (required)
description: # SEO meta description (required)
menu:
  product_menu_key:  # Hugo menu for this product (required)
    name:    # Navigation link text (optional)
    parent:  # Parent menu item for nesting (optional)
weight:      # Sort order: 1-99 (top), 101-199 (level 2), 201-299 (level 3) (required)
---
```

**Shared content** (avoid duplication):

```yaml
---
title: Page Title
description: Brief description
menu:
  influxdb3_core:
    name: Nav Label
weight: 101
source: /shared/influxdb3-admin/topic-name.md  # Points to shared content
---
```

Shared content files in `/content/shared/`:

- Don't include frontmatter (defined in referring files)
- Can use `{{% show-in %}}` and `{{% hide-in %}}` for product-specific content
- Can use the `version` keyword for version-specific paths

### Content Quality Expectations

- **Accuracy**: Verify all code examples work with current product versions
- **Completeness**: Include all required parameters and prerequisites
- **Clarity**: Write for the target audience (developers, operators, etc.)
- **Consistency**: Use established patterns and terminology
- **Testing**: All code examples must be testable with pytest-codeblocks annotations
- **Links**: Verify all internal and external links work
- **Cross-references**: Link to related documentation appropriately

### Code Examples

Use pytest annotations for testable examples:

```python
print("Hello, world!")
```

<!--pytest-codeblocks:expected-output-->

```
Hello, world!
```

## Troubleshooting

| Issue                    | Solution                                               |
| ------------------------ | ------------------------------------------------------ |
| Pytest collected 0 items | Use `python` not `py` for language identifier          |
| Hugo build errors        | Check `/config/_default/`                              |
| Docker build fails       | Expected in restricted networks - use local Hugo       |
| Cypress install fails    | Use `CYPRESS_INSTALL_BINARY=0 yarn install`            |
| Link validation slow     | Test specific files: `yarn test:links content/file.md` |
| Vale errors              | Check `.ci/vale/styles/config/vocabularies`            |

## Specialized Instructions

### File Pattern-Specific Instructions

These instructions are automatically loaded by GitHub Copilot based on the files you're working with:

| Pattern                  | File                                                              | Description                                      |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------------ |
| `content/**/*.md`        | [content.instructions.md](instructions/content.instructions.md)   | Content file guidelines, frontmatter, shortcodes |
| `layouts/**/*.html`      | [layouts.instructions.md](instructions/layouts.instructions.md)   | Shortcode implementation patterns and testing    |
| `api-docs/**/*.yml`      | [api-docs.instructions.md](instructions/api-docs.instructions.md) | OpenAPI spec workflow                            |
| `assets/js/**/*.{js,ts}` | [assets.instructions.md](instructions/assets.instructions.md)     | TypeScript/JavaScript and CSS development        |

### Custom Specialist Agents

Use these agents for specialized tasks:

| Agent                     | File                                                        | Use When                                                          |
| ------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| **TypeScript & Hugo Dev** | [typescript-hugo-agent.md](agents/typescript-hugo-agent.md) | TypeScript migration, Hugo asset pipeline, component architecture |

### Skills

Specialized skills that can be invoked using the `skill` tool for specific workflows:

| Skill | File | Description |
|-------|------|-------------|
| **cypress-e2e-testing** | [.claude/skills/cypress-e2e-testing/SKILL.md](../.claude/skills/cypress-e2e-testing/SKILL.md) | Run, validate, and analyze Cypress E2E tests for the InfluxData documentation site |
| **docs-cli-workflow** | [.claude/skills/docs-cli-workflow/SKILL.md](../.claude/skills/docs-cli-workflow/SKILL.md) | Guides when to use docs create/edit CLI tools versus direct file editing |
| **hugo-template-dev** | [.claude/skills/hugo-template-dev/SKILL.md](../.claude/skills/hugo-template-dev/SKILL.md) | Hugo template development with proper build and runtime testing |
| **influxdb3-test-setup** | [.claude/skills/influxdb3-test-setup/SKILL.md](../.claude/skills/influxdb3-test-setup/SKILL.md) | Set up InfluxDB 3 Core and Enterprise instances for running documentation code block tests |

### General Documentation

| Topic            | File                                            | Description                               |
| ---------------- | ----------------------------------------------- | ----------------------------------------- |
| **Testing**      | [DOCS-TESTING.md](../DOCS-TESTING.md)           | Comprehensive testing procedures          |
| **Contributing** | [DOCS-CONTRIBUTING.md](../DOCS-CONTRIBUTING.md) | Full contribution workflow and guidelines |
| **Frontmatter**  | [DOCS-FRONTMATTER.md](../DOCS-FRONTMATTER.md)   | Complete page metadata reference          |
| **Shortcodes**   | [DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md)     | Complete shortcode reference              |

## Important Notes

- This is a large site (5,359+ pages) with complex build processes
- **NEVER CANCEL** long-running operations (Hugo builds, tests)
- Set appropriate timeouts: Hugo build (180s+), tests (30+ minutes)
