# Unified CLI Migration to docs-v2: Design Document

**Date**: 2026-01-27  
**Status**: Approved for Implementation  
**Context**: Move unified documentation CLI from docs-tooling (private) back to docs-v2 (public)

## Executive Summary

The unified documentation CLI currently lives in the private `docs-tooling` repository but operates primarily on docs-v2 content. Since we've successfully removed all private repository references through a generic configuration system, there's no security barrier to moving the CLI back to docs-v2 where it logically belongs.

**Key Benefits**:
- ✅ CLI lives with the content it operates on
- ✅ docs-v2 contributors get it automatically (no extra clone needed)
- ✅ Simpler mental model (one repo for docs content + tools)
- ✅ Security issue fixed during migration
- ✅ No dependency management complexity

## Security Audit Results

**Issue Found**: `cli/lib/api-auditor.js` in docs-tooling contains hardcoded private repository reference:

```javascript
// Line 40
const enterpriseRepoPath = join(outputDir, 'influxdb-pro-clone');

// Line 52
await ensureRepository(
  'https://github.com/influxdata/influxdb_pro.git',  // ❌ HARDCODED
  enterpriseRepoPath,
  version,
  'Enterprise'
);
```

**Occurrences**: 2 (both in same file)  
**Fix Required**: Use `process.env.INFLUXDB_PRO_REPO_URL` from configuration system  
**Status**: Will be fixed during migration (Phase 2)

## Current State Analysis

### docs-v2 CLI Structure
```
docs-v2/
├── scripts/
│   ├── docs-cli/
│   │   ├── docs-cli.js          (basic router)
│   │   ├── docs-create.js       (1415 lines)
│   │   ├── docs-edit.js         (278 lines)
│   │   └── lib/
│   │       ├── content-scaffolding.js
│   │       ├── editor-resolver.js
│   │       ├── file-operations.js
│   │       ├── process-manager.js
│   │       └── url-parser.js
│   └── add-placeholders.js
└── package.json (bin: "docs" → scripts/docs-cli/docs-cli.js)
```

### docs-tooling CLI Structure
```
docs-tooling/
├── cli/
│   ├── commands/
│   │   ├── audit.js             (new - API/Telegraf auditing)
│   │   ├── create.js            (1433 lines - enhanced version)
│   │   ├── edit.js              (246 lines - enhanced version)
│   │   └── release-notes.js     (new - release note generation)
│   ├── lib/
│   │   ├── config-loader.js     (new - .env support)
│   │   ├── content-utils.js     (new - shared content detection)
│   │   ├── api-auditor.js       (new - has security issue)
│   │   ├── api-audit-reporter.js
│   │   ├── api-parser.js
│   │   ├── api-request-parser.js
│   │   ├── api-doc-scanner.js
│   │   ├── telegraf-auditor.js
│   │   └── telegraf-audit-reporter.js
│   │   └── (shared libs from docs-v2)
│   ├── config/
│   │   ├── .env.example
│   │   └── README.md
│   └── docs-cli.js              (enhanced router with dynamic loading)
```

**Key Differences**:
- docs-tooling has configuration system (.env support)
- docs-tooling has two new commands (audit, release-notes)
- docs-tooling has enhanced library files
- Line counts are similar (create.js: 1415 vs 1433 lines)
- Main enhancement: export wrapper that finds docs-v2 automatically

## Target Architecture

### Proposed docs-v2 Structure (After Migration)
```
docs-v2/
├── scripts/
│   ├── docs-cli/
│   │   ├── commands/                    # NEW - organized command directory
│   │   │   ├── create.js                ← Updated from docs-tooling
│   │   │   ├── edit.js                  ← Updated from docs-tooling  
│   │   │   ├── audit.js                 ← NEW from docs-tooling (SECURITY FIX)
│   │   │   ├── release-notes.js         ← NEW from docs-tooling
│   │   │   └── add-placeholders.js      ← Moved from scripts/
│   │   ├── lib/
│   │   │   ├── config-loader.js         ← NEW (configuration system)
│   │   │   ├── content-scaffolding.js   (existing)
│   │   │   ├── content-utils.js         ← NEW from docs-tooling
│   │   │   ├── editor-resolver.js       (existing)
│   │   │   ├── file-operations.js       (existing)
│   │   │   ├── process-manager.js       (existing)
│   │   │   ├── url-parser.js            (existing)
│   │   │   ├── api-auditor.js           ← NEW (with SECURITY FIX)
│   │   │   ├── api-audit-reporter.js    ← NEW
│   │   │   ├── api-parser.js            ← NEW
│   │   │   ├── api-request-parser.js    ← NEW
│   │   │   ├── api-doc-scanner.js       ← NEW
│   │   │   ├── telegraf-auditor.js      ← NEW
│   │   │   └── telegraf-audit-reporter.js ← NEW
│   │   └── docs-cli.js                  ← Updated router (dynamic loading)
│   └── (other scripts...)
├── config/                              # NEW
│   ├── .env.example                     ← Template (NO real values)
│   └── README.md                        ← Configuration docs
├── package.json                         (bin unchanged)
├── .gitignore                           ← ADD: config/.env, .env
└── .env                                 (user's local config - gitignored)
```

## Migration Strategy

### Approach: Replace and Enhance

Instead of merging two versions, we will:
1. **Keep** existing docs-v2 CLI structure (`scripts/docs-cli/`)
2. **Add** new commands (`audit.js`, `release-notes.js`)
3. **Add** configuration system (`config/` directory, `config-loader.js`)
4. **Update** existing commands to use config system
5. **Fix** security issue in `api-auditor.js` during the move
6. **Archive** docs-tooling CLI with redirect notice

## Implementation Plan

### Phase 1: Add Configuration System
**Goal**: Add config infrastructure to docs-v2

**Files to add**:
- `config/.env.example` - Template with NO real values
- `config/README.md` - Comprehensive config documentation  
- `scripts/docs-cli/lib/config-loader.js` - Zero-dependency .env parser

**Updates**:
- `.gitignore` - Add `config/.env` and `.env`

**Validation**:
```bash
# Verify .env is gitignored
git check-ignore config/.env .env

# Test config-loader can find docs-v2
node -e "import('./scripts/docs-cli/lib/config-loader.js').then(m => console.log(m.findDocsV2Root()))"

# Test config without .env (should use defaults)
node -e "import('./scripts/docs-cli/lib/config-loader.js').then(m => console.log(m.hasEnterpriseAccess()))"
```

**Success Criteria**: ✅ Config loads, finds repo, respects .env, stays gitignored

---

### Phase 2: Migrate Shared Libraries (INCLUDING SECURITY FIX)
**Goal**: Add new library files needed by all commands, fix security issue

**Files to add**:
- `scripts/docs-cli/lib/content-utils.js` - Shared content detection
- `scripts/docs-cli/lib/api-auditor.js` - **WITH SECURITY FIX**
- `scripts/docs-cli/lib/api-audit-reporter.js`
- `scripts/docs-cli/lib/api-parser.js`
- `scripts/docs-cli/lib/api-request-parser.js`
- `scripts/docs-cli/lib/api-doc-scanner.js`
- `scripts/docs-cli/lib/telegraf-auditor.js`
- `scripts/docs-cli/lib/telegraf-audit-reporter.js`

**Security Fix for api-auditor.js**:

Current (vulnerable):
```javascript
const enterpriseRepoPath = join(outputDir, 'influxdb-pro-clone');
await ensureRepository(
  'https://github.com/influxdata/influxdb_pro.git',  // ❌ HARDCODED
  enterpriseRepoPath,
  version,
  'Enterprise'
);
```

Fixed:
```javascript
const enterpriseRepoPath = join(outputDir, 'enterprise-clone');  // Generic name
const enterpriseRepoUrl = process.env.INFLUXDB_PRO_REPO_URL;

if (!enterpriseRepoUrl) {
  throw new Error(
    'Enterprise repository URL not configured.\n' +
    'Set DOCS_ENTERPRISE_REPO_URL in your .env file.\n' +
    'See config/README.md for details.'
  );
}

await ensureRepository(
  enterpriseRepoUrl,  // ✅ FROM CONFIG
  enterpriseRepoPath,
  version,
  'Enterprise'
);
```

**Validation**:
```bash
# Verify no hardcoded private repo references
grep -r "influxdb_pro\|influxdb-pro" scripts/docs-cli/lib/
# Expected: NO MATCHES

# Verify api-auditor uses env vars
grep "process.env.INFLUXDB_PRO_REPO_URL" scripts/docs-cli/lib/api-auditor.js
# Expected: MATCH FOUND

# Security audit - entire codebase
grep -r "github.com.*influxdb.*pro\|github.com.*influxdata.*enterprise" scripts/docs-cli/
# Expected: NO MATCHES (except in comments/docs)
```

**Success Criteria**: ✅ All libraries import, **NO security issues**, no hardcoded URLs

---

### Phase 3: Add New Commands
**Goal**: Create `/commands` directory and add new commands

**Files to add**:
- `scripts/docs-cli/commands/audit.js` - API/Telegraf auditing
- `scripts/docs-cli/commands/release-notes.js` - Release note generation

**Files to move**:
- `scripts/add-placeholders.js` → `scripts/docs-cli/commands/add-placeholders.js`

**Updates**:
- `package.json` - Update `scripts.docs:add-placeholders` to new path

**Validation**:
```bash
npx docs audit --help
npx docs release-notes --help

# Audit requires configuration for enterprise
npx docs audit enterprise
# Expected: Error message guiding to config (not a crash)

# Add-placeholders moved correctly  
npx docs add-placeholders --help
```

**Success Criteria**: ✅ Commands executable, proper error messages, help works

---

### Phase 4: Update Existing Commands
**Goal**: Move existing commands to `/commands` and update for config system

**Files to move/update**:
- `scripts/docs-cli/docs-create.js` → `scripts/docs-cli/commands/create.js`
  - Remove export wrapper (not needed, we're in docs-v2)
  - Update imports to use `config-loader.js` for optional config
  - Update import paths (from `./lib/` to `../lib/`)
  
- `scripts/docs-cli/docs-edit.js` → `scripts/docs-cli/commands/edit.js`
  - Same updates as create.js

**Files removed** (after migration):
- `scripts/docs-cli/docs-create.js`
- `scripts/docs-cli/docs-edit.js`

**Validation**:
```bash
# Commands work
npx docs create --help
npx docs edit --help

# Old files removed
ls scripts/docs-cli/docs-create.js scripts/docs-cli/docs-edit.js
# Expected: No such file or directory

# Commands work from any directory
cd /tmp && npx docs create --help
```

**Success Criteria**: ✅ Commands work, old files gone, path-agnostic operation

---

### Phase 5: Update Router
**Goal**: Replace `docs-cli.js` with dynamic command loader

**File to replace**:
- `scripts/docs-cli/docs-cli.js` (use version from docs-tooling)

**Changes**:
- Imports commands dynamically from `./commands/${commandName}.js`
- Handles --help, --version, unknown commands
- Passes args to command modules

**Optional package.json updates**:
- Keep `docs:create`, `docs:edit` scripts or mark as deprecated
- Note: All commands now work via `npx docs <command>`

**Validation**:
```bash
# Router shows all commands
npx docs --help
# Expected: Lists create, edit, audit, release-notes, add-placeholders

# All commands route correctly
npx docs create --help
npx docs edit --help
npx docs audit --help
npx docs release-notes --help
npx docs add-placeholders --help

# Unknown command handling
npx docs unknown-command
# Expected: Error message listing available commands

# Version flag
npx docs --version
```

**Success Criteria**: ✅ All commands accessible via router, error handling works

---

### Final Integration Tests

**Complete workflow tests**:
```bash
# 1. Create workflow (no .env needed)
echo "# Test" > /tmp/test-draft.md
npx docs create /tmp/test-draft.md --products influxdb3-core
# Expected: Files created successfully

# 2. Edit workflow (no .env needed)
npx docs edit /influxdb3/core/
# Expected: Lists files or opens editor

# 3. Audit workflow (requires .env)
cat > .env << EOF
DOCS_ENTERPRISE_ACCESS=false
EOF
npx docs audit core --version v3.0
# Expected: Runs audit (may warn about missing repos)

# 4. Full security audit
find scripts/docs-cli -type f -name "*.js" -exec grep -l "influxdb.pro\|influxdb-pro" {} \;
# Expected: NO FILES (security issue eliminated)
```

**Success Criteria**: ✅ End-to-end workflows function, security validated

## Rollback Strategy

Each phase is a separate commit, allowing granular rollback:

```bash
# Rollback specific phase
git log --oneline -5
git revert <phase-commit-hash>

# Rollback entire migration
git log --oneline --grep="Phase"
git revert <phase-5>...<phase-1>
```

**Phase dependencies**:
- Phase 1 (config) → Standalone, safe to keep
- Phase 2 (libs) → Depends on Phase 1
- Phase 3 (new commands) → Depends on Phase 1, 2
- Phase 4 (updated commands) → Depends on Phase 1, 2  
- Phase 5 (router) → Depends on all previous phases

**Decision points**:
- After Phase 1: Can stop here, config system in place but unused
- After Phase 2: Can stop here, libs available but no commands use them
- After Phase 3: Can stop here, new commands work, old commands unchanged
- **After Phase 4: Point of no return** - old command files deleted
- After Phase 5: Complete migration

## Post-Migration Actions

### 1. Update Documentation
- Update docs-v2 README with new CLI commands
- Add migration notice if docs-tooling CLI was used externally
- Document .env configuration in contributing guide

### 2. Archive docs-tooling CLI
```bash
# In docs-tooling repo
git mv cli cli-archived
echo "CLI moved to docs-v2. See: https://github.com/influxdata/docs-v2" > cli/README.md
git commit -m "Archive CLI - moved to docs-v2"
```

### 3. Update Skills
- ✅ `content-editing` skill - already references docs-v2
- ✅ `docs-cli-workflow` skill - already references docs-v2
- No changes needed

### 4. Final Security Verification
```bash
git log -p | grep -i "influxdb.pro\|influxdb-pro\|enterprise.*github.com"
# Expected: Only removals (no additions)
```

## Success Metrics

Migration is successful when:
- ✅ All 5 phases complete without errors
- ✅ All tests pass (unit + integration)
- ✅ Security audit shows zero private repo references
- ✅ `npx docs --help` shows all commands
- ✅ All workflows tested (create, edit, audit, release-notes)
- ✅ `.env.example` documented, `.env` gitignored
- ✅ docs-tooling CLI archived with redirect notice

## Timeline Estimate

- Phase 1: 30 minutes (copy config files, test)
- Phase 2: 45 minutes (copy libs, apply security fix, test thoroughly)
- Phase 3: 30 minutes (copy new commands, move add-placeholders)
- Phase 4: 45 minutes (update existing commands, update imports)
- Phase 5: 30 minutes (update router, test integration)
- **Total: ~3 hours** (plus testing time)

**Can be done incrementally**:
- Day 1: Phases 1-2 (infrastructure + security fix)
- Day 2: Phases 3-4 (commands)
- Day 3: Phase 5 (integration + final testing)

## Future Considerations

### Portable Distribution (Post-Migration)
After migration, if needed for external use:
- Publish as `@influxdata/docs-cli` on npm
- Add `--output` flag for standalone mode (work without full repo clone)
- Integrate with MCP server for AI agent use
- See "Portable CLI Design" discussion for details

This migration focuses on moving the CLI to docs-v2 first. Portable distribution can be added later without affecting the migration.

---

**Approved for implementation**: 2026-01-27  
**Implementation branch**: `chore-migrate-unified-cli-to-docs-v2`  
**Related**: See conversation thread for full design discussion
