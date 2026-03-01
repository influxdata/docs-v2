# Spell Checking Configuration Guide

This document explains the spell-checking rules and tools used in the InfluxData documentation repository.

## Overview

The docs-v2 repository uses **two complementary spell-checking tools**:

1. **Vale** - Integrated documentation spell checker (runs in pre-commit hooks)
2. **Codespell** - Lightweight code comment spell checker (recommended for CI/CD)

## Tool Comparison

| Feature | Vale | Codespell |
|---------|------|-----------|
| **Purpose** | Document spell checking | Code comment spell checking |
| **Integration** | Pre-commit hooks (Docker) | CI/CD pipeline |
| **False Positives** | Low (comprehensive filters) | Low (clear dictionary only) |
| **Customization** | YAML rules | INI config + dictionary lists |
| **Performance** | Moderate | Fast |
| **True Positive Detection** | Document-level | Code-level |

## Vale Configuration

### File: `.ci/vale/styles/InfluxDataDocs/Spelling.yml`

#### Why Code Blocks Are Included

Unlike other documentation style checkers, this configuration **intentionally includes code blocks** (`~code` is NOT excluded). This is critical because:

1. **Comments in examples** - Users copy code blocks with comments:
   ```bash
   # Download and verify the GPG key
   curl https://repos.influxdata.com/influxdata-archive.key
   ```
   Typos in such comments become part of user documentation/scripts.

2. **Documentation strings** - Code examples may include documentation:
   ```python
   def create_database(name):
       """This funtion creates a new database."""  # ← typo caught
       pass
   ```

3. **Inline comments** - Shell script comments are checked:
   ```sh
   #!/bin/bash
   # Retrive configuration from server
   influxctl config get
   ```

### Filter Patterns Explained

#### 1. camelCase and snake_case Identifiers
```regex
(?:_*[a-z]+(?:[A-Z][a-z0-9]*)+(?:[A-Z][a-zA-Z0-9]*)*|[a-z_][a-z0-9]*_[a-z0-9_]*)
```
**Why**: Prevents false positives on variable/method names while NOT matching normal prose

**Breakdown**:
- **camelCase**: `_*[a-z]+(?:[A-Z][a-z0-9]*)+(?:[A-Z][a-zA-Z0-9]*)*`
  - Requires at least one uppercase letter (distinguishes `myVariable` from `provide`)
  - Allows leading underscores for private variables (`_privateVar`, `__dunder__`)
- **snake_case**: `[a-z_][a-z0-9]*_[a-z0-9_]*`
  - Requires at least one underscore
  - Distinguishes `my_variable` from normal words

**Examples Ignored**: `myVariable`, `targetField`, `getCwd`, `_privateVar`, `my_variable`, `terminationGracePeriodSeconds`

**Examples NOT Ignored** (caught by spell-checker): `provide`, `database`, `variable` (normal prose)

#### 2. UPPER_CASE Constants
```regex
[A-Z_][A-Z0-9_]+
```
**Why**: Prevents false positives on environment variables and constants
**Examples Ignored**: `API_KEY`, `AWS_REGION`, `INFLUXDB_TOKEN`
**Note**: Matches AWS, API (even single uppercase acronyms) - acceptable in docs

#### 3. Version Numbers
```regex
\d+\.\d+(?:\.\d+)*
```
**Why**: Version numbers aren't words
**Examples Ignored**: `1.0`, `2.3.1`, `0.101.0`, `1.2.3.4`, `v1.2.3`
**Note**: Handles any number of version parts (2-part, 3-part, 4-part, etc.)

#### 4. Hexadecimal Values
```regex
0[xX][0-9a-fA-F]+
```
**Why**: Hex values appear in code and aren't dictionary words
**Examples Ignored**: `0xFF`, `0xDEADBEEF`, `0x1A`

#### 5. URLs and Paths
```regex
/[a-zA-Z0-9/_\-\.\{\}]+          # Paths: /api/v2/write
https?://[^\s\)\]>"]+ # Full URLs: https://docs.example.com
```
**Why**: URLs contain hyphens, slashes, and special chars
**Examples Ignored**: `/api/v2/write`, `/kapacitor/v1/`, `https://docs.influxdata.com`

#### 6. Shortcode Attributes
```regex
(?:endpoint|method|url|href|src|path)="[^"]+"
```
**Why**: Hugo shortcode attribute values often contain hyphens and special chars
**Examples Ignored**: `endpoint="https://..."`, `method="POST"`
**Future Enhancement**: Add more attributes as needed (name, value, data, etc.)

#### 7. Code Punctuation
```regex
[@#$%^&*()_+=\[\]{};:,.<>?/\\|-]+
```
**Why**: Symbols and special characters aren't words
**Examples Ignored**: `()`, `{}`, `[]`, `->`, `=>`, `|`, etc.

### Ignored Words

The configuration references two word lists:

- **`InfluxDataDocs/Terms/ignore.txt`** - Product and technical terms (non-English)
- **`InfluxDataDocs/Terms/query-functions.txt`** - InfluxQL/Flux function names

To add a word that should be ignored, edit the appropriate file.

## Codespell Configuration

### File: `.codespellrc`

#### Dictionary Choice: "clear"

**Why "clear" (not "rare" or "code")**:

- `clear` - Unambiguous spelling errors only
  - Examples: "recieve" → "receive", "occured" → "occurred"
  - False positive rate: ~1%

- `rare` - Includes uncommon but valid English words
  - Would flag legitimate technical terms
  - False positive rate: ~15-20%

- `code` - Includes code-specific words
  - Too aggressive for documentation
  - False positive rate: ~25-30%

#### Skip Directories

```ini
skip = public,node_modules,dist,.git,.vale,api-docs
```

- `public` - Generated HTML (not source)
- `node_modules` - npm dependencies (not our code)
- `dist` - Compiled TypeScript output (not source)
- `.git` - Repository metadata
- `.vale` - Vale configuration and cache
- `api-docs` - Generated OpenAPI specifications (many false positives)

#### Ignored Words

```ini
ignore-words-list = aks,invokable
```

- **`aks`** - Azure Kubernetes Service (acronym)
- **`invokable`** - InfluxData product branding term (scriptable tasks/queries)

**To add more**:
1. Edit `.codespellrc`
2. Add word to `ignore-words-list` (comma-separated)
3. Add inline comment explaining why

## Running Spell Checkers

### Vale (Pre-commit)

Vale automatically runs on files you commit via Lefthook.

**Manual check**:
```bash
# Check all content
docker compose run -T vale content/**/*.md

# Check specific file
docker compose run -T vale content/influxdb/cloud/reference/cli.md
```

### Codespell (Manual/CI)

```bash
# Check entire content directory
codespell content/ --builtin clear

# Check specific directory
codespell content/influxdb3/core/

# Interactive mode (prompts for fixes)
codespell content/ --builtin clear -i 3

# Auto-fix (USE WITH CAUTION)
codespell content/ --builtin clear -w
```

## Rule Validation

The spell-checking rules are designed to:

✅ Catch real spelling errors (true positives)
✅ Ignore code patterns, identifiers, and paths (false negative prevention)
✅ Respect product branding terms (invokable, Flux, InfluxQL)
✅ Work seamlessly in existing workflows

### Manual Validation

Create a test file with various patterns:

```bash
# Test camelCase handling
echo "variable myVariable is defined" | codespell

# Test version numbers
echo "InfluxDB version 2.3.1 is released" | codespell

# Test real typos (should be caught)
echo "recieve the data" | codespell
```

## Troubleshooting

### Vale: False Positives

**Problem**: Vale flags a word that should be valid

**Solutions**:
1. Check if it's a code identifier (camelCase, UPPER_CASE, hex, version)
2. Add to `InfluxDataDocs/Terms/ignore.txt` if it's a technical term
3. Add filter pattern to `.ci/vale/styles/InfluxDataDocs/Spelling.yml` if it's a pattern

### Codespell: False Positives

**Problem**: Codespell flags a legitimate term

**Solutions**:
1. Add to `ignore-words-list` in `.codespellrc`
2. Add skip directory if entire directory should be excluded
3. Use `-i 3` (interactive mode) to review before accepting

### Both Tools: Missing Real Errors

**Problem**: A real typo isn't caught

**Solutions**:
1. Verify it's actually a typo (not a branding term or intentional)
2. Check if it's in excluded scope (tables, URLs, code identifiers)
3. Report as GitHub issue for tool improvement

## Contributing

When adding content:

1. **Use semantic line feeds** (one sentence per line)
2. **Run Vale pre-commit** checks before committing
3. **Test code block comments** for typos
4. **Avoid adding to ignore lists** when possible
5. **Document why** you excluded a term (if necessary)

## Related Files

- `.ci/vale/styles/InfluxDataDocs/` - Vale rule configuration
- `.codespellrc` - Codespell configuration
- `.codespellignore` - Codespell ignore word list
- `DOCS-CONTRIBUTING.md` - General contribution guidelines
- `DOCS-TESTING.md` - Testing and validation guide

## Future Improvements

1. Create comprehensive test suite for spell-checking rules
2. Document how to add product-specific branding terms
3. Consider adding codespell to CI/CD pipeline
4. Monitor and update ignore lists quarterly
