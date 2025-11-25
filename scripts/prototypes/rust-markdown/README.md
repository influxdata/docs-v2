# Rust HTML-to-Markdown Conversion Prototype

## Executive Summary

This prototype compares HTML-to-Markdown conversion performance between JavaScript (turndown.js) and Rust (html2md library). The goal is to determine if switching to Rust provides significant enough performance improvements to justify the integration complexity.

## Performance Results

### Rust Standalone Benchmarks

| Dataset             | Files | Time (s) | Throughput (files/sec) |
| ------------------- | ----- | -------- | ---------------------- |
| Small (get-started) | 7     | 0.03     | 258.9                  |
| Medium (core)       | 357   | 1.39     | 256.5                  |

**Key finding:** Rust maintains consistent **\~257 files/sec** throughput regardless of dataset size.

### JavaScript Benchmarks (turndown.js with p-limit)

| Dataset               | Files   | Time (s) | Throughput (files/sec) |
| --------------------- | ------- | -------- | ---------------------- |
| Small (get-started)   | 5\*     | 0.35     | 14.3                   |
| Medium (core)         | 322\*   | 9.96     | 32.3                   |
| Large (all influxdb3) | 1,581\* | 53.62    | 29.5                   |

*\* Excludes aliased/redirect pages (no article content)*

**Key findings:**

- JavaScript throughput ranges from **14-32 files/sec**
- Performance degrades slightly with larger datasets
- Memory-bounded parallelism (p-limit) keeps memory usage stable

### Performance Comparison

| Metric                     | JavaScript     | Rust            | Improvement      |
| -------------------------- | -------------- | --------------- | ---------------- |
| Average throughput         | \~25 files/sec | \~257 files/sec | **10× faster**   |
| Small dataset (7 files)    | 0.35s          | 0.03s           | **11.7× faster** |
| Medium dataset (357 files) | 9.96s          | 1.39s           | **7.2× faster**  |
| Consistency                | Variable       | Stable          | ✅ Rust           |

### Projected Full Site Impact (5,000+ files)

Current production baseline:

- **JavaScript**: \~105 seconds for full rebuild
- **Estimated rate**: \~48 files/sec (better than benchmark due to smaller avg file size)

With Rust conversion:

- **Estimated time**: 5,000 ÷ 257 = **\~19.5 seconds**
- **Time saved**: \~85 seconds (**81% faster**)

**Note:** This is an optimistic estimate. Real-world performance may vary due to:

- Disk I/O overhead
- Larger/more complex HTML files in full site
- Section bundle generation time (not benchmarked separately)

## Technical Implementation

### Rust Stack

```toml
[dependencies]
html2md = "0.2"          # HTML to Markdown conversion
scraper = "0.20"         # HTML parsing
serde_yaml = "0.9"       # YAML frontmatter
clap = "4.5"             # CLI interface
walkdir = "2.5"          # Directory traversal
```

### Core Functions Implemented

1. **`extract_article_content()`** - Parses `.article--content` selector (same as JS)
2. **`extract_title()`** - Gets title from `<h1>` or `<title>` tag
3. **`extract_description()`** - Reads meta description
4. **`generate_frontmatter()`** - Creates YAML frontmatter with token estimation
5. **`convert_html_to_markdown()`** - Main conversion pipeline

### CLI Interface

```bash
# Convert single file
./rust-markdown convert public/path/to/file.html -o output.md

# Benchmark directory
./rust-markdown benchmark public/influxdb3/core
```

## Quality Assessment

### Known Limitations

1. **Product detection not implemented** - `product:` field always `null`
   - JavaScript version uses `product-mappings.js` TypeScript module
   - Would need to port or call via FFI/IPC

2. **Custom rules incomplete** - Missing Hugo-specific transformations:
   - GitHub-style callouts (Note, Warning, etc.)
   - Code block placeholder handling
   - Custom shortcode remnant removal

3. **No UI element removal** - Still includes:
   - "Copy page" buttons
   - "Was this page helpful?" forms
   - Footer/header navigation

### Output Comparison Needed

The benchmark script measures **performance** but not **quality**. We need to:

- Compare Rust vs JavaScript output side-by-side
- Measure similarity/diff percentage
- Identify any content regressions
- Verify frontmatter correctness

## Integration Approaches

### Option 1: Rust CLI via Subprocess (Current Prototype)

```javascript
import { spawn } from 'child_process';

// For each HTML file
const process = spawn('./target/release/rust-markdown', [
  'convert', htmlPath, '-o', mdPath
]);
```

**Pros:**

- Simple integration
- No build complexity for Node.js project

**Cons:**

- 100-300ms spawn overhead per file negates speed gains
- Would need batch processing or worker pool
- IPC overhead for passing data

**Verdict:** ❌ Not practical for thousands of small files

### Option 2: Rust Library with Node.js Bindings (via napi-rs)

```javascript
import { convertHtml } from 'rust-markdown'; // Native binding

const markdown = convertHtml(html, options);
```

**Pros:**

- Near-native Rust performance
- Zero spawn overhead
- Clean API

**Cons:**

- Requires napi-rs setup
- Build complexity (Rust toolchain in CI)
- Platform-specific binaries

**Verdict:** ✅ Best option if switching

### Option 3: Keep JavaScript, Optimize Differently

**Alternative improvements:**

- Increase p-limit concurrency (20 → 50 workers)
- Pre-filter aliased pages before conversion
- Optimize JSDOM operations
- Consider incremental builds (only changed files)

**Verdict:** ⚠️ May be sufficient, less risk

## Recommendations

### Recommendation 1: Implement Incremental Builds First

**Priority:** High
**Effort:** Medium (1-2 days)
**Impact:** 35-77% faster builds for typical workflows

Product-level incremental builds (only rebuild changed products) would provide:

- Single product edit: 105s → 38s (64% faster)
- Shared content edit: 105s → 68s (35% faster)

**This is lower-hanging fruit than Rust migration.**

### Recommendation 2: Keep JavaScript for Now

**Reasoning:**

1. Current 105s full rebuild time is acceptable for production

2. Incremental builds address the main pain point (developer iteration)

3. Rust migration requires significant effort:
   - Custom rule porting (1-2 weeks)
   - Quality validation (1 week)
   - Integration testing (1 week)
   - **Total: 3-4 weeks**

4. ROI insufficient: 85s time saved vs 3-4 weeks engineering time

### Recommendation 3: Revisit Rust When...

Consider Rust migration if any of these occur:

- File count exceeds 10,000 pages (current: \~5,600)
- Build times exceed 5 minutes with incremental
- Real-time conversion needed (e.g., Lambda\@Edge revival)
- Team has Rust expertise for maintenance

### Recommendation 4: Prototype Quality Comparison

**Next step:** Create quality comparison tool to:

1. Convert same 100 files with both implementations
2. Compute diff similarity scores
3. Identify specific quality regressions
4. Validate frontmatter correctness

**Effort:** 2-3 hours
**Value:** Data-driven decision on output quality

## Implementation Roadmap

### Phase 1: Incremental Builds (Priority)

- ✅ Implement product-level change detection
- ✅ Rebuild only affected products
- ✅ Integrate with deploy-staging.sh
- **ETA:** 1-2 days

### Phase 2: Quality Validation (Optional)

- Create quality comparison script
- Test on 100+ sample files
- Document any differences
- **ETA:** 2-3 hours

### Phase 3: Rust Integration (Future)

**Only if Phase 1+2 show insufficient improvement**

- Port custom rules to Rust
- Implement napi-rs bindings
- Quality validation
- Integration testing
- **ETA:** 3-4 weeks

## Prototype Files

```
scripts/prototypes/rust-markdown/
├── Cargo.toml                      # Rust dependencies
├── src/main.rs                     # Core Rust implementation
├── target/release/rust-markdown    # Compiled binary
├── benchmark-comparison.js         # JS vs Rust benchmarking
└── README.md                       # This file
```

## Running the Prototype

### Build Rust Binary

```bash
cd scripts/prototypes/rust-markdown
cargo build --release
```

### Run Benchmarks

```bash
# Rust standalone
./target/release/rust-markdown benchmark public/influxdb3/core

# JavaScript comparison (from repo root)
cd /path/to/docs-v2
node scripts/prototypes/rust-markdown/benchmark-comparison.js
```

### Test Single File

```bash
./target/release/rust-markdown convert \
  public/influxdb3/core/get-started/index.html \
  -o /tmp/test-output.md

# View output
cat /tmp/test-output.md
```

## Conclusion

**Rust provides 10× performance improvement** but requires significant engineering effort for proper integration. Given that:

1. Incremental builds solve the main pain point (developer iteration)
2. Current 105s production build is acceptable
3. Integration complexity is high

**We recommend prioritizing incremental builds over Rust migration at this time.**

Revisit Rust when file counts exceed 10,000 or build times exceed 5 minutes despite incremental optimization.

***

**Prototype created:** 2025-11-25
**Rust version:** 1.89.0
**Libraries:** html2md 0.2, scraper 0.20
**Performance:** \~257 files/sec vs \~25 files/sec (JavaScript)
