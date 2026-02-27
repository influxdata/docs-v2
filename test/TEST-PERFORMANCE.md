# Code Block Test Performance Optimization

This document describes performance optimization features for code block testing in the InfluxData documentation.

## Overview

Code block testing can be time-consuming, especially for large documentation sets. This guide covers strategies to improve test performance:

1. **Parallel Test Execution by Language** - Run tests for different languages concurrently
2. **Test Result Caching** - Avoid retesting unchanged content
3. **Smart Test Selection** - Test only what's changed

## Language Distribution Analysis

The documentation contains code blocks in multiple languages:

| Language | Count | Testable with pytest-codeblocks |
|----------|-------|--------------------------------|
| sh       | 582   | ✅ Yes |
| bash     | 90    | ✅ Yes |
| python   | 10    | ✅ Yes |
| sql      | 46    | ✅ Yes (with appropriate setup) |
| shell    | 38    | ✅ Yes |
| toml     | 742   | ❌ No (configuration files) |
| json     | 130   | ❌ No (data files) |

Total testable code blocks: **766** (sh + bash + python + sql + shell)

## Parallel Test Execution

### By Language

Test specific languages independently to parallelize test execution:

```bash
# Test only Python code blocks
yarn test:codeblocks:python

# Test only Bash/Shell code blocks
yarn test:codeblocks:bash

# Test only SQL code blocks
yarn test:codeblocks:sql
```

### How It Works

The `test-by-language.sh` script:

1. Scans content files for code blocks in the specified language
2. Filters files to only those containing target language blocks
3. Runs pytest only on the filtered subset
4. Supports language aliases (e.g., 'bash' matches 'bash', 'sh', 'shell')

**Language Aliases:**

- `python` → matches `python`, `py`
- `bash` → matches `bash`, `sh`, `shell`
- `sql` → matches `sql`, `influxql`
- `javascript` → matches `js`, `javascript`

### Custom Usage

Run the script directly for custom language filtering:

```bash
# Inside a test container
./test/scripts/test-by-language.sh python content/influxdb/cloud/**/*.md
./test/scripts/test-by-language.sh bash content/telegraf/v1/**/*.md
```

### Benefits

- **Faster feedback**: Get results for one language without waiting for all tests
- **Easier debugging**: Isolate issues to specific language ecosystems
- **Resource optimization**: Run language tests on appropriate hardware/containers
- **Parallel CI**: Run different languages in separate CI jobs

## Test Result Caching

### Overview

The caching system stores test results based on content hash. If content hasn't changed since the last successful test, the test is skipped.

### Quick Start

```bash
# Run tests with caching (in test container)
./test/scripts/cached-test.sh content/influxdb/cloud/get-started/

# View cache statistics
yarn test:cache:stats

# List all cached results
yarn test:cache:list

# Remove expired cache entries (>7 days)
yarn test:cache:clean

# Clear all cache entries
yarn test:cache:clear
```

### How It Works

1. **Content Hashing**: Creates SHA256 hash of file or directory content
2. **Cache Lookup**: Checks if hash exists in cache with valid timestamp
3. **Cache Hit**: Skips tests if content unchanged and cache < 7 days old
4. **Cache Miss**: Runs tests and caches result on success
5. **Auto Expiry**: Cache entries expire after 7 days

### Cache Structure

```
.test-cache/
├── <content-hash>.passed      # Marker file for successful test
└── <content-hash>.meta        # Metadata about the test
```

**Metadata includes:**

- Target file/directory
- Content hash
- Test timestamp
- Test duration
- Pytest version

### Cache Management

#### View Statistics

```bash
$ yarn test:cache:stats

Test Cache Statistics
====================

Cache directory: .test-cache
Total entries: 42
Valid entries: 38
Expired entries: 4
Total size: 128K
```

#### List Cached Results

```bash
$ yarn test:cache:list

Cached Test Results
===================

Hash: abc123...
Status: ✅
Age: 2 days
Metadata:
  target: content/influxdb/cloud/get-started/
  hash: abc123...
  tested_at: 2024-01-13T10:30:00Z
  duration_seconds: 45
  pytest_version: pytest 7.4.0
```

#### Clean Expired Entries

```bash
$ yarn test:cache:clean

Cleaning expired cache entries...
Removed expired entry: xyz789...
Removed expired entry: def456...

Removed 2 expired entries
```

### Cache Bypass

Force retesting even with valid cache:

```bash
# Set environment variable
TEST_CACHE_BYPASS=1 ./test/scripts/cached-test.sh content/influxdb/cloud/
```

### Cache Location

By default, cache is stored in `.test-cache/`. Override with:

```bash
export TEST_CACHE_DIR=/path/to/custom/cache
```

### Best Practices

**✅ DO:**

- Run `yarn test:cache:clean` weekly to remove expired entries
- Use caching for local development and iterative testing
- Check cache stats after major content updates
- Bypass cache when testing credential or environment changes

**❌ DON'T:**

- Commit `.test-cache/` to version control (already gitignored)
- Rely on cache in CI (fresh tests ensure accuracy)
- Share cache between different test environments
- Cache test failures (only successful tests are cached)

## Performance Comparison

### Without Optimization

```bash
# Test all products sequentially
$ time yarn test:codeblocks:all

real    45m30.123s
user    12m5.456s
sys     3m20.789s
```

### With Parallel Execution

```bash
# Run products in parallel
$ time yarn test:codeblocks:parallel

real    18m45.234s  # 59% faster!
user    35m10.123s
sys     8m45.678s
```

### With Caching (Second Run)

```bash
# Retest unchanged content
$ time yarn test:codeblocks:cloud

First run:  15m30s
Second run: 0m5s    # 97% faster!
```

## CI Integration

### GitHub Actions Workflow

The test workflow (`.github/workflows/test.yml`) automatically:

1. Detects changed content files
2. Identifies which products need testing
3. Runs tests in parallel using matrix strategy
4. Generates detailed test reports

**Smart Selection:**

- Only tests products with changed content
- Runs all tests if shared content changes
- Skips entirely if no content changes

## Troubleshooting

### Cache Not Working

**Symptom:** Tests always run even with unchanged content

**Solutions:**

1. Check cache directory exists and is writable:
   ```bash
   ls -la .test-cache/
   ```

2. Verify cache entries:
   ```bash
   yarn test:cache:list
   ```

3. Check cache age:
   ```bash
   yarn test:cache:stats
   ```

### Language Filter No Results

**Symptom:** "No files found with X code blocks"

**Solutions:**

1. Verify language identifier in code blocks:
   ```bash
   grep -r '^```python' content/
   ```

2. Check language aliases in `test-by-language.sh`

3. Ensure content path is correct

### Performance Still Slow

**Solutions:**

1. Enable parallel execution:
   ```bash
   yarn test:codeblocks:parallel
   ```

2. Use language-specific tests:
   ```bash
   yarn test:codeblocks:python
   yarn test:codeblocks:bash
   ```

3. Enable caching for repeated runs

4. Test only changed files in development

## Advanced Usage

### Custom Language Testing

Create custom language test combinations:

```bash
# Test multiple languages sequentially
for lang in python bash sql; do
  echo "Testing $lang..."
  ./test/scripts/test-by-language.sh $lang content/**/*.md
done

# Test with custom product paths
./test/scripts/test-by-language.sh python \
  content/influxdb/cloud/**/*.md \
  content/influxdb/v2/**/*.md
```

### Cache Analysis

Find most expensive tests:

```bash
# Sort cached tests by duration
for meta in .test-cache/*.meta; do
  echo "$(grep duration_seconds: $meta | cut -d: -f2) $(grep target: $meta | cut -d: -f2-)"
done | sort -rn | head -10
```

## Future Improvements

Potential optimizations for consideration:

- [ ] Pytest parallel execution with `pytest-xdist`
- [ ] Per-file caching instead of directory-level
- [ ] Distributed caching for team environments
- [ ] Test result database for trend analysis
- [ ] Automatic test splitting based on historical duration
- [ ] Smart test ordering (fast tests first)

## Related Documentation

- [DOCS-TESTING.md](../DOCS-TESTING.md) - Main testing guide
- [test/pytest/pytest.ini](pytest/pytest.ini) - Pytest configuration
- [.github/workflows/test.yml](../.github/workflows/test.yml) - CI test workflow
- [package.json](../package.json) - Test scripts

## Support

For issues or questions:

1. Check existing [GitHub issues](https://github.com/influxdata/docs-v2/issues)
2. Create new issue with `testing` label
3. Include test output and cache statistics
