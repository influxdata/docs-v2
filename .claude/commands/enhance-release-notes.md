# enhance-release-notes

Analyze GitHub PRs referenced in release notes and enhance descriptions following Google Developer Documentation style.

## Overview

This command improves release note descriptions by:
1. Fetching PR data from GitHub API
2. Analyzing code changes and PR content
3. Generating clear, action-oriented descriptions
4. Following Google Developer Documentation principles
5. Creating a descriptive commit message

## Usage

```
enhance-release-notes <release-notes-file> [--dry-run]
```

## Process

### 1. Extract PR References

- Scan the release notes file for GitHub PR links
- Extract PR numbers and repository information
- Example pattern: `([#26574](https://github.com/influxdata/influxdb/pull/26574))`

### 2. Fetch PR Data

For each PR, collect:
- PR title and description
- Files modified (to determine component scope)
- Labels and metadata
- Code change statistics

### 3. Analyze and Categorize

**Component Detection** (based on file paths):
- `src/database/`, `catalog/`, `schema/` → Database operations
- `cmd/`, `cli/` → CLI commands  
- `api/`, `http/` → HTTP API
- `src/query/`, `sql/` → Query engine
- `src/auth/`, `token/` → Authentication
- `storage/`, `parquet/`, `wal/` → Storage engine
- `license/` → License management

**Change Type Detection**:
- `feat:` or "add", "new" → Feature
- `fix:` or "resolve", "correct" → Bug fix
- `perf:` or "optim", "faster" → Performance improvement

### 4. Generate Google Developer Documentation Style Descriptions

**Principles**:
- Clear, concise, action-oriented language
- Focus on what developers can do
- Avoid marketing speak ("enhanced", "improved", "better")
- Use specific, concrete benefits
- Start with action verbs when possible

**Templates**:

**Database Operations**:
- `hard.*delet.*date` → "Set custom hard deletion dates for deleted databases and tables"
- `retention.*period` → "Configure automatic data expiration for databases"
- `schema.*updat` → "Modify database schema after creation"

**CLI Commands**:
- `help.*text` → "Access help documentation for commands"
- `show.*license` → "View license details including expiration and limits"
- `object.*store.*required` → "Specify object store configuration when starting the server"

**HTTP API**:
- `v1.*query.*endpoint.*ns` → "Use nanosecond precision by default in V1 API CSV responses"
- `trigger.*request_path` → "Configure processing engine triggers with request paths"

**Query Engine**:
- `csv.*precision` → "Get consistent timestamp precision in CSV output"
- `query.*performance` → "Execute queries without performance degradation"

**Authentication**:
- `token.*creation` → "Generate tokens with additional configuration options"
- `admin.*token.*expiration` → "Set expiration dates for admin tokens"

**Storage Engine**:
- `aws.*credential.*reload` → "Automatically refresh AWS credentials from files"
- `wal.*replay.*concurrency` → "Control memory usage during database startup"
- `corrupt.*wal.*recovery` → "Recover from corrupted write-ahead log files"

**Fallback Patterns**:
- Features: "Use [functionality] to [specific action]"
- Bug fixes: "Avoid [specific problem] when [specific action]"
- Performance: "Execute [operation] without [specific issue]"

### 5. Enhancement Format

Transform:
```markdown
- **Database management**: Allow hard_deleted date of deleted schema to be updated ([#26574](https://github.com/influxdata/influxdb/pull/26574))
```

Into:
```markdown
- **Database operations**: Set custom hard deletion dates for deleted databases and tables ([#26574](https://github.com/influxdata/influxdb/pull/26574))
```

### 6. Output Processing

**Dry Run Mode**:
- Show before/after comparison
- List all proposed changes
- Don't modify the file

**Apply Mode**:
- Replace descriptions in the original file
- Preserve all formatting and PR links
- Log successful enhancements

### 7. Create Descriptive Commit Message

After enhancing the release notes, generate a commit message:

**Format**:
```
docs: enhance release notes with specific user benefits

- Transform generic descriptions into action-oriented language
- Add specific benefits following Google Developer Documentation style
- Focus on what developers can do with each change
- Enhanced [X] descriptions across [Y] components

Enhanced components: [list of components modified]
```

**Example**:
```
docs: enhance v3.2.1 release notes with specific user benefits

- Transform generic descriptions into action-oriented language
- Add specific benefits following Google Developer Documentation style  
- Focus on what developers can do with each change
- Enhanced 8 descriptions across database, CLI, and API components

Enhanced components: Database operations, CLI commands, HTTP API
```

## Error Handling

- **Missing GitHub token**: Warn about rate limits, continue with public API
- **Private repos**: Skip PRs that can't be accessed
- **Invalid PR URLs**: Log error and skip enhancement
- **API rate limits**: Implement exponential backoff
- **Network issues**: Retry with fallback to original description

## Configuration

**Environment Variables**:
- `GITHUB_TOKEN`: Personal access token for GitHub API access

**GitHub Enterprise Support**:
- Detect GitHub Enterprise URLs in PR links
- Use appropriate API base URL

## Implementation Notes

1. **Rate Limiting**: Respect GitHub API rate limits (5000/hour authenticated, 60/hour unauthenticated)
2. **Caching**: Consider caching PR data to avoid repeated API calls during development
3. **Validation**: Verify PR URLs match expected format before API calls
4. **Preservation**: Maintain all existing formatting, spacing, and non-PR content
5. **Atomic Updates**: Only modify the file if all enhancements succeed (or provide partial success options)

## Example Usage

```bash
# Dry run to see proposed changes
enhance-release-notes release-notes-v3.2.1.md --dry-run

# Apply enhancements
enhance-release-notes release-notes-v3.2.1.md

# With verbose output
enhance-release-notes release-notes-v3.2.1.md --verbose
```

## Success Criteria

1. All PR descriptions follow Google Developer Documentation style
2. Descriptions focus on specific developer actions and benefits
3. No marketing language or vague improvements
4. Component categories are accurate based on code changes
5. Original formatting and PR links are preserved
6. Commit message clearly describes the enhancement approach