# Spell Checking Guide

The repository doesn't check spelling in commit hooks or CI.
Run Codespell manually to find unambiguous misspellings.
For other prose checks, see "Prose Linting" in [DOCS-TESTING.md](DOCS-TESTING.md).

## Run Codespell

```bash
# Check the content directory
codespell content/ --builtin clear

# Check one product
codespell content/influxdb3/core/

# Review each fix before applying it
codespell content/ --builtin clear -i 3

# Apply fixes without review (use with caution)
codespell content/ --builtin clear -w
```

## Configuration

`.codespellrc` configures Codespell.

### Dictionary

The `clear` dictionary flags only unambiguous misspellings, such as
"recieve" and "occured".
The `rare` and `code` dictionaries flag valid technical terms too often.

### Skipped directories

```ini
skip = public,node_modules,dist,.git,api-docs
```

- `public`: generated HTML
- `node_modules`: dependencies
- `dist`: compiled TypeScript
- `.git`: repository metadata
- `api-docs`: generated OpenAPI specifications

### Ignored words

`.codespellignore` lists words to ignore, such as `aks` (Azure Kubernetes
Service) and `invokable` (InfluxData term for scriptable tasks and queries).

To ignore another word, add it to `.codespellignore` with a comment.
Prefer fixing the text over adding to the list.
