# Plan: Update InfluxDB 3 CLI Reference Documentation for v3.2.0

## Phase 1: Analyze Current State and Changes

### 1. Audit existing CLI documentation structure
**Existing files in `/content/shared/influxdb3-cli/`:**
- `/content/shared/influxdb3-cli/create/_index.md`
- `/content/shared/influxdb3-cli/create/database.md` ⚠️ **NEEDS UPDATE** (add `--retention-period`)
- `/content/shared/influxdb3-cli/create/distinct_cache.md`
- `/content/shared/influxdb3-cli/create/file_index.md`
- `/content/shared/influxdb3-cli/create/last_cache.md`
- `/content/shared/influxdb3-cli/create/table.md` ⚠️ **NEEDS UPDATE** (add Enterprise `--retention-period`)
- `/content/shared/influxdb3-cli/create/token/_index.md`
- `/content/shared/influxdb3-cli/create/token/admin.md`
- `/content/shared/influxdb3-cli/create/trigger.md`
- `/content/shared/influxdb3-cli/delete/_index.md`
- `/content/shared/influxdb3-cli/delete/database.md` ⚠️ **REVIEW** (hard delete features)
- `/content/shared/influxdb3-cli/delete/distinct_cache.md`
- `/content/shared/influxdb3-cli/delete/file_index.md`
- `/content/shared/influxdb3-cli/delete/last_cache.md`
- `/content/shared/influxdb3-cli/delete/table.md` ⚠️ **REVIEW** (hard delete features)
- `/content/shared/influxdb3-cli/delete/trigger.md`
- `/content/shared/influxdb3-cli/disable/_index.md`
- `/content/shared/influxdb3-cli/disable/trigger.md`
- `/content/shared/influxdb3-cli/enable/_index.md`
- `/content/shared/influxdb3-cli/enable/trigger.md`
- `/content/shared/influxdb3-cli/query.md`
- `/content/shared/influxdb3-cli/show/_index.md` ⚠️ **NEEDS UPDATE** (add license command)
- `/content/shared/influxdb3-cli/show/databases.md`
- `/content/shared/influxdb3-cli/show/system/_index.md`
- `/content/shared/influxdb3-cli/show/system/summary.md`
- `/content/shared/influxdb3-cli/show/system/table-list.md`
- `/content/shared/influxdb3-cli/show/system/table.md`
- `/content/shared/influxdb3-cli/show/tokens.md`
- `/content/shared/influxdb3-cli/test/_index.md`
- `/content/shared/influxdb3-cli/test/schedule_plugin.md`
- `/content/shared/influxdb3-cli/test/wal_plugin.md`
- `/content/shared/influxdb3-cli/write.md`

### 2. Extract v3.2.0 changes from release notes
**From `/content/shared/v3-core-enterprise-release-notes/_index.md`:**

**Core v3.2.0 Features:**
- Database retention period support: `create database --retention-period`, `update database --retention-period`
- Hard delete for databases and tables
- AWS credentials auto-reload
- WAL improvements

**Enterprise v3.2.0 Features:**
- License management: `influxdb3 show license`
- Table retention period support: `create table --retention-period`, `update table --retention-period`
- All Core features plus Enterprise-specific enhancements

### 3. Generate current CLI help output
- Run `influxdb3 --help` for both Core and Enterprise versions
- Extract new commands, options, and help text
- Compare with existing documentation

## Phase 2: Update Documentation Files

### Files to Create (NEW):
- `/content/shared/influxdb3-cli/update/_index.md` 🆕
- `/content/shared/influxdb3-cli/update/database.md` 🆕 (retention period management)
- `/content/shared/influxdb3-cli/update/table.md` 🆕 (Enterprise-only, retention period management)
- `/content/shared/influxdb3-cli/show/license.md` 🆕 (Enterprise-only)

### Files to Update (EXISTING):
- `/content/shared/influxdb3-cli/create/database.md` ⚠️ (add `--retention-period` option)
- `/content/shared/influxdb3-cli/create/table.md` ⚠️ (add Enterprise `--retention-period` option)
- `/content/shared/influxdb3-cli/show/_index.md` ⚠️ (include license command)
- `/content/shared/influxdb3-cli/delete/database.md` ⚠️ (review hard delete options)
- `/content/shared/influxdb3-cli/delete/table.md` ⚠️ (review hard delete options)

### Content Changes by Category:

**1. Retention Period Documentation:**
- Update `/content/shared/influxdb3-cli/create/database.md` with `--retention-period` option
- Create `/content/shared/influxdb3-cli/update/` directory structure
- Create `/content/shared/influxdb3-cli/update/database.md` for retention management
- Update `/content/shared/influxdb3-cli/create/table.md` with Enterprise `--retention-period` option
- Create `/content/shared/influxdb3-cli/update/table.md` for Enterprise table retention management

**2. License Management Documentation:**
- Update `/content/shared/influxdb3-cli/show/_index.md` to include license command
- Create `/content/shared/influxdb3-cli/show/license.md` for Enterprise license display

**3. Hard Delete Documentation:**
- Review and update `/content/shared/influxdb3-cli/delete/database.md` with hard delete options
- Review and update `/content/shared/influxdb3-cli/delete/table.md` with hard delete options

## Phase 3: Automation and Process Improvements

### Immediate Improvements:
1. **Create CLI documentation sync script:**
   ```bash
   # Script: /Users/ja/Documents/github/docs-v2/scripts/sync-cli-docs.sh
   # - Extract help text from influxdb3 CLI
   # - Compare with existing docs
   # - Generate report of differences
   # - Auto-update basic command syntax
   ```

2. **Establish documentation standards:**
   - Standardize frontmatter across CLI docs
   - Create templates for command documentation
   - Define Enterprise vs Core content patterns using Hugo shortcodes

### Long-term Automation Strategy:
1. **CI/CD Integration:**
   - Add GitHub Actions workflow to detect CLI changes
   - Auto-generate CLI help extraction on new releases
   - Create pull requests for documentation updates

2. **Release Process Integration:**
   - Include CLI documentation review in release checklist
   - Link release notes to specific CLI documentation updates
   - Automated cross-referencing between release notes and CLI docs

3. **Content Management Improvements:**
   - Use Hugo shortcodes for Enterprise-specific content
   - Implement version-aware documentation
   - Create shared content templates for common CLI patterns

## Phase 4: Validation and Testing

### Content accuracy verification:
- Test all documented commands and options against actual CLIs
- Verify Enterprise vs Core feature availability
- Cross-reference with actual CLI behavior

### Documentation completeness check:
- Ensure all v3.2.0 features are documented
- Verify examples and use cases
- Check internal links and cross-references

## Suggested Recurring Process

### Pre-release (during development):
- Monitor CLI changes in pull requests
- Update documentation as features are added
- Maintain CLI help extraction automation

### At release (when tagging versions):
- Run automated CLI documentation sync
- Review and approve auto-generated updates
- Publish updated documentation

### Post-release (after release):
- Validate documentation accuracy
- Gather user feedback on CLI documentation
- Plan improvements for next cycle

## Related Documentation Paths

### InfluxDB 3 Product Documentation (affects CLI usage examples):
- `/content/influxdb3/core/write-data/influxdb3-cli.md`
- `/content/influxdb3/enterprise/write-data/influxdb3-cli.md`
- `/content/shared/influxdb3-write-guides/influxdb3-cli.md`

### Admin Documentation (affects retention and license features):
- `/content/influxdb3/core/admin/`
- `/content/influxdb3/enterprise/admin/`
- `/content/influxdb3/enterprise/admin/license.md`

This plan ensures comprehensive documentation updates for v3.2.0 while establishing sustainable processes for future releases.