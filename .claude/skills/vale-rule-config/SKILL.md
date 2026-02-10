---
name: vale-rule-config
description: Configure Vale style linting rules, write custom patterns, and manage CI/quality checks for InfluxData documentation
author: InfluxData
version: "1.0"
---

# Vale Rule Configuration

## Purpose

This skill guides CI/Quality Engineers in writing, testing, and maintaining Vale style linting rules for the InfluxData documentation. It covers Vale's regex engine, rule syntax, configuration files, and best practices for creating effective style rules.

**Use this skill when:**

- Writing new Vale rules (existence, substitution, etc.)
- Debugging Vale rule patterns that aren't working
- Understanding Vale's regex capabilities
- Configuring Vale for product-specific style guides
- Managing vocabulary and branding terms

**For content editors who just need to run Vale and fix issues**, see the **content-editing** skill instead.

## Quick Decision Tree

```
Writing a new Vale rule?
├─ Simple pattern? Use tokens (See Part 1: Basic Rules)
└─ Complex pattern? Use raw or check regex engine (See Part 2: Regex Engine)

Rule not matching as expected?
├─ Check Vale's regex flavor (See Part 2: Regex Engine)
└─ Test pattern in isolation (See Part 5: Testing)

Need product-specific terms?
└─ Add to vocabulary files (See Part 3: Vocabulary)

Need to configure Vale for a product?
└─ Create .vale.ini (See Part 4: Configuration)
```

## Part 1: Basic Vale Rule Types

Vale supports several rule types. Here are the most common:

### Existence Rules

Checks if certain patterns exist in the text.

```yaml
# .ci/vale/styles/InfluxDataDocs/BadWords.yml
extends: existence
message: "Don't use '%s'"
level: error
tokens:
  - obviously
  - basically
  - simply
```

**With `nonword: true` for punctuation:**

```yaml
# .ci/vale/styles/Google/Colons.yml
extends: existence
message: "'%s' should be in lowercase."
link: 'https://developers.google.com/style/colons'
nonword: true
level: warning
scope: sentence
tokens:
  - ':\s[A-Z]'
```

### Substitution Rules

Suggests replacements for problematic patterns.

```yaml
# .ci/vale/styles/InfluxDataDocs/Terms.yml
extends: substitution
message: "Use '%s' instead of '%s'"
level: warning
swap:
  database: DB
  endpoint: API
```

### Conditional Rules

More complex rules with exceptions.

```yaml
extends: conditional
first: '\b(if|when)\b'
second: '\bthen\b'
message: "If/when statements should include 'then'"
level: warning
```

## Part 2: Vale's Regex Engine

### Critical: Vale Uses regexp2, Not RE2

**This is the most important thing to understand when writing Vale rules.**

Vale uses the [regexp2](https://pkg.go.dev/github.com/dlclark/regexp2) library, **not** Go's standard `regexp` package (which uses RE2). This is a common source of confusion because Vale is written in Go.

### Supported Regex Features

Vale supports **PCRE-style lookarounds** despite being written in Go:

- ✅ **Positive lookahead**: `(?=re)`
- ✅ **Negative lookahead**: `(?!re)`
- ✅ **Positive lookbehind**: `(?<=re)`
- ✅ **Negative lookbehind**: `(?<!re)`
- ✅ **Lazy quantifiers**: `*?`, `+?`, `??`
- ✅ **Named groups**: `(?P<name>...)`
- ✅ **Atomic groups**: `(?>...)`

According to Vale's maintainer:

> "Vale uses a superset of the Go flavor, supporting PCRE-style lookarounds."

### Example: Negative Lookbehind

This pattern matches a colon followed by uppercase letter, but NOT when the colon is part of a URL scheme (like `https:`):

```yaml
extends: existence
message: "'%s' should be in lowercase."
nonword: true
scope: sentence
tokens:
  # ✅ This works! Negative lookbehind is supported
  - '(?<!:[^ ]+?):\s[A-Z]'
```

**How it works:**

- `(?<!:[^ ]+?)` - Negative lookbehind: NOT preceded by `:` followed by non-space characters
- `:\s[A-Z]` - Colon, whitespace, uppercase letter

### Example: Positive Lookbehind

Match "Internet" only when preceded by whitespace, excluding specific phrases:

```yaml
extends: existence
message: "'%s' should only be capitalized when starting a sentence."
scope: sentence
tokens:
  - '(?<=\s)Internet(?! Service Provider| Protocol)'
```

### tokens vs raw

**tokens:**
- Automatically wrapped in word boundaries
- Converted to non-capturing groups
- Good for simple patterns

**raw:**
- Full control over the pattern
- No automatic processing
- Use for complex regex

```yaml
# Using raw for full control
extends: existence
message: "Use 'database' instead"
raw:
  - '\bDB\b(?!\s+instance)'  # DB but not "DB instance"
```

## Part 3: Vocabulary Management

Vocabulary files manage accepted and rejected terms across the documentation.

### File Locations

```
.ci/vale/styles/config/vocabularies/
├── InfluxDataDocs/
│   ├── accept.txt       # Accepted terms (won't be flagged)
│   └── reject.txt       # Rejected terms (will be flagged)
└── Cloud-Dedicated/
    ├── accept.txt
    └── reject.txt
```

### accept.txt Format

One term per line. Case-sensitive by default:

```text
InfluxDB
InfluxQL
Telegraf
ClickHouse
PostgreSQL
```

**Support for regex patterns:**

```text
# Accept both capitalizations
[Dd]atabase
[Aa]PI

# Accept with word boundaries
\bDB\b
```

### reject.txt Format

Rejected terms that should never be used:

```text
Influx
influxdb (lowercase)
big data
simply
obviously
```

### Product-Specific Vocabulary

Create product-specific vocabularies by:

1. Creating a new style directory in `.ci/vale/styles/`
2. Adding vocabulary files
3. Configuring in product's `.vale.ini`

**Example:**

```yaml
# content/influxdb/cloud-dedicated/.vale.ini
StylesPath = .ci/vale/styles
Vocab = Cloud-Dedicated

[*.md]
BasedOnStyles = Google, InfluxDataDocs, Cloud-Dedicated
```

## Part 4: Vale Configuration Files

### Repository-Level Config

`.vale.ini` in repository root:

```ini
StylesPath = .ci/vale/styles
MinAlertLevel = suggestion
Vocab = InfluxDataDocs

[*.md]
BasedOnStyles = Google, InfluxDataDocs
```

### Product-Specific Config

Example: `content/influxdb/cloud-dedicated/.vale.ini`

```ini
StylesPath = .ci/vale/styles
MinAlertLevel = error
Vocab = Cloud-Dedicated

[*.md]
BasedOnStyles = Google, InfluxDataDocs, Cloud-Dedicated

# Disable specific rules for this product
Google.Headings = NO
InfluxDataDocs.TechnicalTerms = NO
```

### Rule Configuration

Individual rules are YAML files in style directories:

```
.ci/vale/styles/
├── Google/
│   ├── Colons.yml
│   ├── Headings.yml
│   └── ...
├── InfluxDataDocs/
│   ├── Branding.yml
│   ├── TechnicalTerms.yml
│   └── ...
└── config/
    └── vocabularies/
```

## Part 5: Testing Vale Rules

### Test a Rule in Isolation

```bash
# Test specific rule on one file
docker compose run -T vale \
  --config=.vale.ini \
  --minAlertLevel=suggestion \
  content/influxdb3/core/get-started/_index.md

# Test only error-level issues
docker compose run -T vale \
  --config=content/influxdb/cloud-dedicated/.vale.ini \
  --minAlertLevel=error \
  content/influxdb/cloud-dedicated/**/*.md
```

### Test Rule Pattern Before Adding to Vale

You can test regex patterns with Python or online tools first:

```python
import re

# Test negative lookbehind pattern
pattern = r'(?<!:[^ ]+?):\s[A-Z]'
text = "Install the package: Then run it."

matches = re.findall(pattern, text)
print(matches)  # Should match ": T"

# Should NOT match URL schemes
text2 = "Visit https://example.com"
matches2 = re.findall(pattern, text2)
print(matches2)  # Should be empty
```

### Common Issues

**Pattern not matching:**
1. Check if you need `nonword: true` for punctuation
2. Verify scope is appropriate (`sentence`, `heading`, etc.)
3. Test with `raw` instead of `tokens` for complex patterns

**Too many false positives:**
1. Add exceptions using negative lookahead/lookbehind
2. Adjust scope to be more specific
3. Consider using substitution rule with exceptions

**Pattern works in Python but not Vale:**
- Unlikely if you're using PCRE features (Vale supports them)
- Check for differences in whitespace handling
- Try `raw` field for exact pattern control

## Part 6: Advanced Patterns

### Excluding Specific Contexts

```yaml
# Match "database" but not "database instance" or "database cluster"
extends: existence
message: "Use 'DB' for brevity"
tokens:
  - '\bdatabase\b(?! instance| cluster)'
```

### Case-Insensitive Matching

```yaml
extends: existence
message: "Use 'InfluxDB' with proper capitalization"
tokens:
  - '(?i)influx ?db'  # Matches influxdb, influx db, INFLUXDB, etc.
```

### Multiple Conditions

```yaml
extends: conditional
first: '\b(will|shall)\b'
second: '(?:not|n''t)\b'
message: "Use 'won't' or 'will not' consistently"
```

### Capture Groups for Messages

```yaml
extends: substitution
message: "Use '%s' instead of '%s'"
swap:
  '(\w+)base': '$1-base'  # Changes 'database' to 'data-base'
```

## Part 7: Best Practices

### DO:

- **Start simple**: Use `tokens` before moving to `raw`
- **Test incrementally**: Add patterns one at a time
- **Use vocabulary files**: For spelling and branding terms
- **Document patterns**: Add comments explaining complex regex
- **Be specific**: Use lookarounds to reduce false positives
- **Check scope**: Use appropriate scope (sentence, heading, etc.)

### DON'T:

- **Assume RE2 limitations**: Vale supports lookarounds
- **Over-complicate**: Sometimes simpler patterns work better
- **Ignore performance**: Complex patterns can slow down linting
- **Skip testing**: Always test rules on real content first
- **Forget edge cases**: Test with URLs, code blocks, etc.

## Part 8: Reference

### Alert Levels

- `error`: Critical issues (broken links, branding violations)
- `warning`: Style guide rules
- `suggestion`: Optional improvements

### Common Scopes

- `text`: All text content
- `sentence`: Individual sentences
- `paragraph`: Full paragraphs
- `heading`: Heading text only
- `list`: List items only
- `code`: Code blocks (rarely used)

### Rule Types

- `existence`: Check if patterns exist
- `substitution`: Suggest replacements
- `conditional`: If X then Y must also exist
- `consistency`: Enforce consistent usage
- `occurrence`: Limit pattern occurrences
- `repetition`: Check for repeated words
- `sequence`: Check word ordering

## Part 9: Example: Creating a New Rule

Let's create a rule to enforce "InfluxDB 3" instead of "InfluxDB v3":

### Step 1: Create the rule file

```bash
# Create new rule
cat > .ci/vale/styles/InfluxDataDocs/InfluxDB3Version.yml <<'EOF'
extends: substitution
message: "Use '%s' instead of '%s'"
level: warning
link: 'https://docs.influxdata.com/style-guide/#version-names'
swap:
  'InfluxDB v3': 'InfluxDB 3'
  'InfluxDB V3': 'InfluxDB 3'
EOF
```

### Step 2: Test on sample content

```bash
# Test on one file first
docker compose run -T vale content/influxdb3/core/get-started/_index.md
```

### Step 3: Refine if needed

If too many false positives, add exceptions:

```yaml
extends: existence
message: "Use 'InfluxDB 3' instead of 'InfluxDB v3'"
level: warning
tokens:
  # Match "InfluxDB v3" but not in URLs or code
  - 'InfluxDB v3(?![`/])'
```

### Step 4: Run on full product

```bash
# Test on entire product
docker compose run -T vale content/influxdb3/**/*.md
```

## Related Skills

- **content-editing** - For content editors who need to run Vale and fix issues
- **cypress-e2e-testing** - For testing documentation after style fixes

## Resources

### Official Documentation

- [Vale documentation](https://vale.sh/docs/)
- [Vale styles guide](https://vale.sh/docs/topics/styles/)
- [regexp2 package](https://pkg.go.dev/github.com/dlclark/regexp2)

### Community Resources

- [Vale issue #233 - RFC on lookarounds](https://github.com/errata-ai/vale/issues/233)
- [Vale discussion #817 - Working lookbehind example](https://github.com/errata-ai/vale/discussions/817)
- [Google Developer Documentation Style Guide](https://developers.google.com/style)

### Internal Documentation

- [DOCS-CONTRIBUTING.md](../../DOCS-CONTRIBUTING.md) - Vale configuration section
- [DOCS-TESTING.md](../../DOCS-TESTING.md) - Vale testing procedures

## Checklist: Before Adding a New Vale Rule

- [ ] Pattern tested in isolation (Python/regex tool)
- [ ] Rule tested on sample content
- [ ] False positives identified and handled
- [ ] Appropriate alert level chosen (error/warning/suggestion)
- [ ] Documentation link added (if applicable)
- [ ] Rule tested on full product content
- [ ] Rule added to appropriate style directory
- [ ] Configuration updated if needed (.vale.ini)
- [ ] PR includes examples of rule in action
- [ ] Team reviewed for style guide alignment
