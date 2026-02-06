---
name: vale-linting
description: Vale style linting workflow for InfluxData documentation. Covers running Vale, understanding rules, adding vocabulary, and creating custom rules.
author: InfluxData
version: "1.0"
---

# Vale Style Linting Workflow

## Purpose

This skill covers the complete Vale linting workflow for InfluxData documentation, including running Vale, understanding the rule configuration, adding vocabulary terms, and creating custom rules.

**Use this skill when:**

- Running Vale style checks on documentation
- Debugging Vale warnings or errors
- Adding terms to the vocabulary (accept/ignore lists)
- Creating or modifying custom Vale rules
- Understanding why certain patterns are flagged

## Quick Reference

```bash
# Run Vale on specific files
.ci/vale/vale.sh --config=.vale.ini content/influxdb3/core/**/*.md

# Run with minimum alert level
.ci/vale/vale.sh --config=.vale.ini --minAlertLevel=warning content/path/

# Sync Vale packages (after .vale.ini changes)
.ci/vale/vale.sh sync

# Show Vale configuration
.ci/vale/vale.sh ls-config
```

## Part 1: How Vale Runs

### Docker-Based Execution

Vale runs inside a Docker container via `.ci/vale/vale.sh`:

```bash
docker run \
  --mount type=bind,src=$(pwd),dst=/workdir \
  -w /workdir \
  jdkato/vale:latest \
  "$@"
```

**Critical limitation:** Only files inside the repository are accessible. Files in `/tmp` or other external paths will silently fail (Vale falls back to stdin).

### Configuration Files

| File                                                  | Purpose                                             |
| ----------------------------------------------------- | --------------------------------------------------- |
| `.vale.ini`                                           | Main configuration (styles, packages, rule toggles) |
| `.ci/vale/styles/InfluxDataDocs/`                     | Custom rules for InfluxData docs                    |
| `.ci/vale/styles/config/vocabularies/InfluxDataDocs/` | Vocabulary (accept/reject terms)                    |
| `content/*/.vale.ini`                                 | Product-specific overrides                          |

## Part 2: Understanding Vale Rules

### Rule Sources

Vale uses multiple rule sources, configured in `.vale.ini`:

```ini
BasedOnStyles = Vale, InfluxDataDocs, Google, write-good
```

1. **Vale** - Built-in rules (Spelling, Terms, Repetition)
2. **InfluxDataDocs** - Custom rules for this repo
3. **Google** - Google Developer Documentation Style Guide
4. **write-good** - Plain English suggestions

### Disabled Rules (and Why)

The following rules are disabled in `.vale.ini` for specific reasons:

```ini
# Vocabulary-based substitution creates false positives in URLs/paths
# Example: /api/v3/write flagged because "api" should be "APIs"
Vale.Terms = NO

# Google.Units flags InfluxDB duration literals (30d, 24h) as needing spaces
# We use custom InfluxDataDocs.Units that only checks byte units
Google.Units = NO

# Flags legitimate technical terms: aggregate, expiration, However, multiple
write-good.TooWordy = NO

# Using custom InfluxDataDocs.Spelling instead
Vale.Spelling = NO
```

### Active Custom Rules

| Rule                            | Purpose                                       |
| ------------------------------- | --------------------------------------------- |
| `InfluxDataDocs.Spelling`       | Spell checking with technical term exclusions |
| `InfluxDataDocs.Units`          | Byte units only (allows duration literals)    |
| `InfluxDataDocs.WordList`       | Terminology standards (admin → administrator) |
| `InfluxDataDocs.Capitalization` | Heading case rules                            |
| `InfluxDataDocs.Branding`       | Product name consistency                      |

## Part 3: Adding Vocabulary Terms

### Accept List (Technical Terms)

Add terms to `.ci/vale/styles/config/vocabularies/InfluxDataDocs/accept.txt`:

```text
# Case-insensitive by default
CPUs
systemd
preconfigured

# Regex patterns for variations
[Dd]ownsampl(e|ed|es|ing)
subprocess(es)?

# Exact case matching (regex)
(?i)InfluxQL
```

### Ignore List (Spelling Only)

Add terms to `.ci/vale/styles/InfluxDataDocs/Terms/ignore.txt`:

```text
# Simple words (case-insensitive)
cgroup
humantime
deadman

# The ignore.txt is referenced by Spelling.yml
```

**Key difference:**

- `accept.txt` - Terms that are correct AND create substitution rules via Vale.Terms
- `ignore.txt` - Terms to skip in spell checking only (no substitution rules)

### When to Use Each

| Scenario                                | File         |
| --------------------------------------- | ------------ |
| Technical term that's spelled correctly | `ignore.txt` |
| Preferred capitalization (API, CLI)     | `accept.txt` |
| Product name with specific casing       | `accept.txt` |
| Variable name appearing in prose        | `ignore.txt` |

## Part 4: Creating Custom Rules

### Rule File Location

Custom rules go in `.ci/vale/styles/InfluxDataDocs/`:

```
.ci/vale/styles/InfluxDataDocs/
├── Acronyms.yml
├── Branding.yml
├── Capitalization.yml
├── Ellipses.yml
├── Spelling.yml
├── Units.yml          # Custom: allows duration literals
├── WordList.yml
└── Terms/
    ├── ignore.txt
    └── query-functions.txt
```

### Example: Custom Units Rule

This rule validates byte units while allowing InfluxDB duration literals:

```yaml
# .ci/vale/styles/InfluxDataDocs/Units.yml
extends: existence
message: "Put a nonbreaking space between the number and the unit in '%s'."
link: "https://developers.google.com/style/units-of-measure"
nonword: true
level: warning
# Only check byte units. Duration units (ns, ms, s, min, h, d) are excluded
# because InfluxDB duration literals use no space (e.g., 30d, 24h, 1h).
tokens:
  - \b\d+(?:B|kB|MB|GB|TB|PB)
```

### Example: Spelling Rule with Scope Exclusions

```yaml
# .ci/vale/styles/InfluxDataDocs/Spelling.yml
extends: spelling
message: "Did you really mean '%s'?"
level: warning
# Exclude from spell checking:
scope:
  - ~code        # Fenced code blocks
  - ~raw         # Inline code
  - ~table.header
  - ~table.cell
ignore:
  - InfluxDataDocs/Terms/ignore.txt
  - InfluxDataDocs/Terms/query-functions.txt
filters:
  # Ignore URL paths
  - '/[a-zA-Z0-9/_\-\.\{\}]+'
  # Ignore full URLs
  - 'https?://[^\s\)\]>"]+'
```

## Part 5: Debugging Vale Issues

### Common Problems

**"0 errors in stdin"**

- File is outside the repository (Docker can't access it)
- Solution: Use files inside the repo for testing

**Rule not triggering**

- Check if rule is disabled in `.vale.ini`
- Verify rule file has valid YAML syntax
- Run `vale sync` after adding new packages

**False positives in URLs/code**

- Add patterns to `TokenIgnores` in `.vale.ini`
- Add scope exclusions (`~code`, `~raw`) to the rule
- Add terms to `ignore.txt`

### Debugging Commands

```bash
# Show all configuration
.ci/vale/vale.sh ls-config

# Validate YAML syntax
node -e "require('js-yaml').load(require('fs').readFileSync('path/to/rule.yml'))"

# Test specific file
.ci/vale/vale.sh --config=.vale.ini --minAlertLevel=suggestion path/to/file.md
```

## Part 6: TokenIgnores vs Rule Filters

### TokenIgnores (in .vale.ini)

Applied globally to all rules. Matches **whole tokens**:

```ini
TokenIgnores = /[a-zA-Z0-9/_\-\.]+, \
  https?://[^\s\)\]>"]+, \
  `[^`]+`
```

**Limitation:** Cannot match substrings within words. If "api" appears in `/api/v3/write`, the URL pattern must match the entire URL to exclude it.

### Rule Filters (in rule YAML)

Applied to specific rules. Can match **patterns within text**:

```yaml
filters:
  - '[Ss]erverless'  # Allow both cases
  - '/[a-zA-Z0-9/_\-\.\{\}]+'  # URL paths
```

### When to Use Each

| Use Case                           | Approach                             |
| ---------------------------------- | ------------------------------------ |
| Exclude entire URLs from all rules | `TokenIgnores`                       |
| Exclude inline code from all rules | `TokenIgnores` with backtick pattern |
| Exclude patterns from one rule     | Rule-specific `filters`              |
| Skip checking inside code blocks   | Rule `scope: [~code]`                |

## Part 7: Workflow Examples

### Adding a New Technical Term

```bash
# 1. Identify the term and its usage
grep -r "systemd" content/

# 2. Add to ignore list (spelling only)
echo "systemd" >> .ci/vale/styles/InfluxDataDocs/Terms/ignore.txt

# 3. Or add to accept.txt (if it should influence Vale.Terms)
echo "systemd" >> .ci/vale/styles/config/vocabularies/InfluxDataDocs/accept.txt

# 4. Test the change
.ci/vale/vale.sh --config=.vale.ini content/path/with/term.md
```

### Creating a Product-Specific Override

```bash
# 1. Create product-specific .vale.ini
cat > content/influxdb3/cloud-dedicated/.vale.ini << 'EOF'
StylesPath = ../../../.ci/vale/styles
MinAlertLevel = error
Vocab = InfluxDataDocs

[*.md]
BasedOnStyles = Vale, InfluxDataDocs, Google, write-good
# Product-specific overrides
InfluxDataDocs.Branding = YES
EOF

# 2. Run Vale with product config
.ci/vale/vale.sh --config=content/influxdb3/cloud-dedicated/.vale.ini \
  content/influxdb3/cloud-dedicated/**/*.md
```

### Debugging Why a Pattern is Flagged

```bash
# 1. Check which rule is triggering
.ci/vale/vale.sh --config=.vale.ini path/to/file.md
# Output shows: InfluxDataDocs.WordList, Vale.Terms, etc.

# 2. Read the rule file
cat .ci/vale/styles/InfluxDataDocs/WordList.yml

# 3. Check if term is in vocabulary
grep -i "term" .ci/vale/styles/config/vocabularies/InfluxDataDocs/*.txt

# 4. Check TokenIgnores patterns
grep TokenIgnores .vale.ini
```

## Checklist: Before Committing Vale Changes

- [ ] Ran `vale sync` if packages changed
- [ ] Tested changes on sample files
- [ ] Verified no unexpected rules are disabled
- [ ] Added comments explaining why rules are disabled
- [ ] Kept vocabulary files alphabetized
- [ ] Used ignore.txt for spelling-only terms
- [ ] Used accept.txt for terms that should influence substitution

## Related Files

| File               | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `.vale.ini`        | Main configuration                            |
| `.ci/vale/vale.sh` | Docker wrapper script                         |
| `.ci/vale/styles/` | All Vale style rules                          |
| `lefthook.yml`     | Pre-commit hooks that run Vale                |
| `DOCS-TESTING.md`  | Testing documentation (includes Vale section) |
