# Add Placeholders Script

Automatically adds placeholder syntax to code blocks and placeholder descriptions in markdown files.

## What it does

This script finds UPPERCASE placeholders in code blocks and:

1. **Adds `{ placeholders="PATTERN1|PATTERN2" }` attribute** to code block fences
2. **Wraps placeholder descriptions** with `{{% code-placeholder-key %}}` shortcodes

## Usage

### Direct usage

```bash
# Process a single file
node scripts/add-placeholders.js <file.md>

# Dry run to preview changes
node scripts/add-placeholders.js <file.md> --dry

# Example
node scripts/add-placeholders.js content/influxdb3/enterprise/admin/upgrade.md
```

### Using npm script

```bash
# Process a file
yarn docs:add-placeholders <file.md>

# Dry run
yarn docs:add-placeholders <file.md> --dry
```

## Example transformations

### Before

````markdown
```bash
influxdb3 query \
  --database SYSTEM_DATABASE \
  --token ADMIN_TOKEN \
  "SELECT * FROM system.version"
```

Replace the following:

- **`SYSTEM_DATABASE`**: The name of your system database
- **`ADMIN_TOKEN`**: An admin token with read permissions
````

### After

````markdown
```bash { placeholders="ADMIN_TOKEN|SYSTEM_DATABASE" }
influxdb3 query \
  --database SYSTEM_DATABASE \
  --token ADMIN_TOKEN \
  "SELECT * FROM system.version"
```

Replace the following:

- {{% code-placeholder-key %}}`SYSTEM_DATABASE`{{% /code-placeholder-key %}}: The name of your system database
- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: An admin token with read permissions
````

## How it works

### Placeholder detection

The script automatically detects UPPERCASE placeholders in code blocks using these rules:

- **Pattern**: Matches words with 2+ characters, all uppercase, can include underscores
- **Excludes common words**: HTTP verbs (GET, POST), protocols (HTTP, HTTPS), SQL keywords (SELECT, FROM), etc.

### Code block processing

1. Finds all code blocks (including indented ones)
2. Extracts UPPERCASE placeholders
3. Adds `{ placeholders="..." }` attribute to the fence line
4. Preserves indentation and language identifiers

### Description wrapping

1. Detects "Replace the following:" sections
2. Wraps placeholder descriptions matching `- **`PLACEHOLDER`**: description`
3. Preserves indentation and formatting
4. Skips already-wrapped descriptions

## Options

- `--dry` or `-d`: Preview changes without modifying files

## Notes

- The script is idempotent - running it multiple times on the same file won't duplicate syntax
- Preserves existing `placeholders` attributes in code blocks
- Works with both indented and non-indented code blocks
- Handles multiple "Replace the following:" sections in a single file

## Related documentation

- [DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md) - Complete shortcode reference
- [DOCS-CONTRIBUTING.md](../DOCS-CONTRIBUTING.md) - Placeholder conventions and style guidelines
