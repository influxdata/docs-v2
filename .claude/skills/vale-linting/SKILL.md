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

### Execution via `.ci/vale/vale.sh`

The wrapper script `.ci/vale/vale.sh` runs Vale using:

1. **Local binary** (preferred) — if `vale` is installed and version >= 3.x
2. **Docker fallback** — `jdkato/vale:v${VALE_VERSION}` (pinned version)

```bash
# The wrapper handles binary vs Docker automatically
.ci/vale/vale.sh --config=.vale.ini content/path/

# In CI, the pr-vale-check.yml workflow installs the Vale binary
# directly (reads version from vale.sh), so Docker is not needed.
```

**Critical limitation:** Only files inside the repository are accessible when using Docker fallback. Files in `/tmp` or other external paths will silently fail.

**macOS note:** The CI script `.github/scripts/vale-check.sh` uses `declare -A` (associative arrays) which requires bash 4+. macOS ships bash 3.2. Use `/opt/homebrew/bin/bash` or run tests in CI instead.

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

Rules are disabled in two categories across `.vale.ini` and all product configs:

**Mechanical rules disabled** (replaced by custom equivalents or incompatible with InfluxDB syntax):

| Rule | Reason |
|------|--------|
| `Google.Acronyms` | Custom `InfluxDataDocs.Acronyms` handles this |
| `Google.DateFormat` | Custom `InfluxDataDocs.DateFormat` handles this |
| `Google.Ellipses` | Custom `InfluxDataDocs.Ellipses` handles this |
| `Google.Headings` | Too strict for technical doc headings |
| `Google.WordList` | Custom `InfluxDataDocs.WordList` handles this |
| `Google.Units` | Flags InfluxDB duration literals (30d, 24h); custom `InfluxDataDocs.Units` checks byte units only |
| `Vale.Spelling` | Custom `InfluxDataDocs.Spelling` handles this |
| `Vale.Terms` | False positives from URLs, file paths, and code |

**Style rules disabled** (high false-positive rate in technical docs):

| Rule | Reason |
|------|--------|
| `Google.Contractions` | Not relevant to InfluxData style |
| `Google.FirstPerson` | Tutorials use "I" intentionally |
| `Google.Passive` | Technical docs use passive voice legitimately |
| `Google.We` | "We recommend" is standard in docs |
| `Google.Will` | Future tense is standard in docs |
| `write-good.Cliches` | High false positive rate |
| `write-good.Passive` | Duplicate of Google.Passive concern |
| `write-good.So` | Starting with "So" is fine |
| `write-good.ThereIs` | Often the clearest phrasing |
| `write-good.TooWordy` | Flags legitimate terms: aggregate, expiration, multiple |
| `write-good.Weasel` | Context-dependent, better handled during content review |

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

**Key difference in this repo:**

- `accept.txt` - Terms that are part of the shared spelling vocabulary (via `Vocab = InfluxDataDocs`). In this repository, it does **not** currently create substitution rules because `Vale.Terms` is disabled in `.vale.ini`. If `Vale.Terms` is enabled in the future, these terms may also drive substitution behavior.
- `ignore.txt` - Additional terms to skip in spell checking only (an ignore list layered on top of the shared vocabulary; no substitution rules).

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

## Part 6: Vale Cannot Inspect URLs

`TokenIgnores` in `.vale.ini` strips all URLs before any rules run:

```ini
TokenIgnores = https?://[^\s\)\]>"]+
```

**This means no Vale rule can match URL content.** An earlier attempt to create a `SupportLink.yml` rule to validate `support.influxdata.com` URL patterns failed for this reason — the URLs were stripped before the rule could see them. Support URL validation uses a separate shell script (`.ci/scripts/check-support-links.sh`) instead.

Keep this in mind when designing rules: if the pattern to match is inside a URL, use a shell script or pre-commit hook, not a Vale rule.

## Part 7: TokenIgnores vs Rule Filters

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

> [!Important]
> Product-specific `.vale.ini` files must include the same disabled rules as the
> root `.vale.ini`. Rules disabled in the root config are **not** inherited by
> product-specific configs. Omitting them re-enables the rules for those products.
> For example, omitting `Google.Units = NO` causes duration literals like `7d`,
> `24h` to be flagged as errors in product-specific linting runs.

```bash
# 1. Create product-specific .vale.ini
cat > content/influxdb3/cloud-dedicated/.vale.ini << 'EOF'
StylesPath = ../../../.ci/vale/styles
MinAlertLevel = warning
Vocab = InfluxDataDocs

Packages = Google, write-good, Hugo

[*.md]
BasedOnStyles = Vale, InfluxDataDocs, Cloud-Dedicated, Google, write-good

# --- Disabled mechanical rules ---
Google.Acronyms = NO
Google.DateFormat = NO
Google.Ellipses = NO
Google.Headings = NO
Google.WordList = NO
Google.Units = NO
Vale.Spelling = NO
Vale.Terms = NO

# --- Disabled style rules (high false-positive rate in technical docs) ---
Google.Contractions = NO
Google.FirstPerson = NO
Google.Passive = NO
Google.We = NO
Google.Will = NO
write-good.Cliches = NO
write-good.Passive = NO
write-good.So = NO
write-good.ThereIs = NO
write-good.TooWordy = NO
write-good.Weasel = NO

TokenIgnores = /[a-zA-Z0-9/_\-\.]+, \
  https?://[^\s\)\]>"]+, \
  `[^`]+`
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

| File | Purpose |
|------|---------|
| `.vale.ini` | Main configuration |
| `.vale-instructions.ini` | Config for non-content files (READMEs, AGENTS.md, etc.) |
| `.ci/vale/vale.sh` | Vale wrapper (local binary or Docker fallback) |
| `.ci/vale/styles/` | All Vale style rules |
| `.ci/scripts/check-support-links.sh` | Support URL validation (can't use Vale — see Part 6) |
| `.github/scripts/vale-check.sh` | CI script: groups files by product config, runs Vale |
| `.github/scripts/resolve-shared-content.sh` | CI script: resolves `content/shared/*` to product pages |
| `.github/workflows/pr-vale-check.yml` | CI workflow: runs Vale on PR changes |
| `lefthook.yml` | Pre-commit hooks that run Vale |
| `DOCS-TESTING.md` | Testing documentation (includes Vale CI section) |
