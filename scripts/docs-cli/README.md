# Documentation CLI Tools

This directory contains command-line tools for working with the InfluxData documentation repository.

## Structure

```
scripts/docs-cli/
├── README.md                    # This file
├── docs-cli.js                  # Main CLI entry point
├── docs-edit.js                 # Edit existing documentation
├── docs-create.js               # Create new documentation
├── lib/                         # CLI-specific modules
│   ├── editor-resolver.js       # Smart editor selection
│   ├── process-manager.js       # Process spawning (detached/attached)
│   └── url-parser.js            # URL parsing utilities
└── __tests__/                   # Unit tests
    ├── editor-resolver.test.js  # Editor resolution tests
    ├── process-manager.test.js  # Process management tests
    └── run-tests.sh             # Test runner script
```

## Installation

The `docs` command is automatically configured when you run:

```bash
yarn install
```

This creates a symlink in `node_modules/.bin/docs` pointing to `docs-cli.js`.

## Commands

### `docs edit` - Edit Existing Documentation

Opens documentation files in your preferred editor. **Non-blocking by default** (agent-friendly).

#### Usage

```bash
# Quick edit (exits immediately, editor in background)
docs edit <url-or-path>
docs edit https://docs.influxdata.com/influxdb3/core/admin/
docs edit /influxdb3/core/admin/

# Interactive edit (waits for editor to close)
docs edit <url-or-path> --wait

# List files without opening
docs edit <url-or-path> --list

# Use specific editor
docs edit <url-or-path> --editor nano
```

#### Options

- `--list` - List files without opening editor
- `--wait` - Wait for editor to close (blocking mode)
- `--editor <command>` - Use specific editor (e.g., `vim`, `nano`, `code --wait`)

#### Editor Configuration

The CLI selects an editor in this priority order:

1. `--editor` flag
2. `DOCS_EDITOR` environment variable
3. `VISUAL` environment variable
4. `EDITOR` environment variable
5. System default (vim, nano, etc.)

**Examples:**

```bash
# Set editor for all commands
export EDITOR=vim

# Set editor specifically for docs CLI
export DOCS_EDITOR=nano

# Use VS Code with built-in wait flag
export DOCS_EDITOR="code --wait"
```

### `docs create` - Create New Documentation

Scaffolds new documentation pages with proper frontmatter and structure.

#### Usage

```bash
# Create from draft file
docs create <draft-path> --products <product-key>

# Create at specific URL location
docs create --url <url> --from-draft <draft-path>
```

See `docs create --help` for full options.

### `docs placeholders` - Add Placeholder Syntax

Adds placeholder syntax to code blocks for interactive examples.

```bash
docs placeholders <file-path>
```

## Testing

### Run All Tests

```bash
bash scripts/docs-cli/__tests__/run-tests.sh
```

### Run Individual Tests

```bash
node scripts/docs-cli/__tests__/editor-resolver.test.js
node scripts/docs-cli/__tests__/process-manager.test.js
```

### Manual Verification

```bash
# Test non-blocking mode (should exit immediately)
time docs edit /influxdb3/core/admin/ --editor echo

# Test blocking mode (should wait)
time docs edit /influxdb3/core/admin/ --wait --editor echo

# Test list mode
docs edit /influxdb3/core/admin/ --list
```

## Implementation Details

### Non-Blocking by Default

The `docs edit` command spawns the editor as a detached process and exits immediately. This prevents AI agents and automation scripts from hanging indefinitely.

**Key modules:**

- **`lib/editor-resolver.js`** - Resolves the editor command from multiple sources
- **`lib/process-manager.js`** - Spawns processes in detached (non-blocking) or attached (blocking) mode

### URL Parsing

The CLI supports both full URLs and path-only formats:

```bash
# Both of these work:
docs edit https://docs.influxdata.com/influxdb3/core/admin/
docs edit /influxdb3/core/admin/
```

The `lib/url-parser.js` module handles URL parsing and maps documentation URLs to source files in the repository.

### Shared Content Detection

When a page uses shared content (via the `source` frontmatter field), the CLI identifies both:

1. The frontmatter file (defines page metadata)
2. The shared source file (contains actual content)

Both files are opened for editing.

## Issue #21 Fix

This directory structure was created as part of fixing [issue #21](https://github.com/influxdata/docs-tooling/issues/21), where the `docs edit` command caused agents to hang waiting for the editor.

**Changes:**

- Made non-blocking the default behavior
- Added `--wait` flag for interactive editing
- Added `--editor` flag for explicit editor selection
- Improved editor resolution with multiple fallbacks
- Organized CLI code into dedicated directory

**Documentation:**

- [ISSUE-21-FIX-README.md](../../ISSUE-21-FIX-README.md) - Implementation overview
- [IMPLEMENTATION-SUMMARY.md](../../IMPLEMENTATION-SUMMARY.md) - Detailed implementation
- [TEST-RESULTS.md](../../TEST-RESULTS.md) - Test verification

## Contributing

When modifying these tools:

1. Update tests in `__tests__/`
2. Run the test suite: `bash scripts/docs-cli/__tests__/run-tests.sh`
3. Update this README if adding new commands or features
4. Test both blocking and non-blocking modes
5. Verify editor resolution works correctly

## Help

For command-specific help:

```bash
docs --help
docs edit --help
docs create --help
```

For general documentation contribution guidelines, see [DOCS-CONTRIBUTING.md](../../DOCS-CONTRIBUTING.md).