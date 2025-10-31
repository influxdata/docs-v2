---
applyTo: "api-docs/**/*.md, api-docs/**/*.yml, api-docs/**/*.yaml"
---

# InfluxDB API Documentation

**Complete guide**: [api-docs/README.md](../../api-docs/README.md)

API documentation uses OpenAPI specifications and Redoc, not Hugo shortcodes.

## Workflow

1. Edit YAML files in `/api-docs/`
2. Generate HTML documentation locally:
   ```sh
   cd api-docs
   sh generate-api-docs.sh
   ```
3. Test generated documentation
4. Commit YAML changes (HTML is gitignored)

## Files

- `ref.yml`: Main API specification
- `content/*.yml`: Custom content overlays
- `.redocly.yaml`: Linter and bundler configuration

## Tools

- Redoc: Generates HTML from OpenAPI specs
- @redocly/cli: Lints and bundles specs

For complete documentation workflow, see [api-docs/README.md](../../api-docs/README.md).
