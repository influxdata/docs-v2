# InfluxDB 3 Plugin Documentation Automation

This directory contains scripts and configuration for automating plugin documentation sync between `influxdata/influxdb3_plugins` (source) and `influxdata/docs-v2` (documentation site).

## Files in This Directory

- **`port_to_docs.js`** - Transforms plugin READMEs from influxdb3_plugins to docs-v2 format
- **`docs_mapping.yaml`** - Maps source plugin READMEs to destination documentation files
- **`README.md`** - This file: complete workflow documentation

## Quick Start

### Automated Sync (Recommended)

When you update plugin READMEs in influxdb3_plugins:

1. **Commit your changes** - The reminder workflow will automatically detect changes
2. **Click the sync link** - A comment will appear with a pre-filled link to create a sync request
3. **Review the PR** - The workflow creates a pull request with transformed content and screenshots

### Manual Sync (Alternative)

To manually trigger synchronization:

1. **Create sync request**: [Open sync request form](https://github.com/influxdata/docs-v2/issues/new?template=sync-plugin-docs.yml)
2. **Fill in plugin names** and source commit
3. **Submit issue** - This automatically triggers the sync workflow

### Local Development

For local testing and development:

1. **Validate source content** (run from influxdb3_plugins directory):
   ```bash
   cd /path/to/influxdb3_plugins
   python validate_readme.py
   ```

2. **Transform content** (run from docs-v2 root directory):
   ```bash
   cd /path/to/docs-v2
   npm run sync-plugins
   ```

3. **Review changes**:
   ```bash
   git diff content/shared/influxdb3-plugins/
   ```

## NPM Scripts

From the docs-v2 root directory, you can use these convenient npm scripts:

- `npm run sync-plugins` - Transform all plugin documentation
- `npm run sync-plugins:dry-run` - Preview changes without writing files
- `npm run validate-plugin-config` - Validate the mapping configuration

## Overview

This workflow maintains consistent plugin documentation between repositories while ensuring bidirectional consistency and enabling future automation.

## Key Principles

1. **Single Source of Truth**: Plugin READMEs in `influxdb3_plugins` are the canonical source
2. **Consistency**: All plugin READMEs follow a standardized template
3. **Automation**: Documentation updates flow automatically from source to docs
4. **Validation**: Both repositories validate documentation quality
5. **No Divergence**: Content differences are managed through transformation rules

## Repository Responsibilities

### influxdb3_plugins (Source)
- Contains canonical plugin documentation in README files
- Follows strict template structure
- Includes all technical details and examples
- Validates README compliance

### docs-v2 (Documentation Site)
- Transforms and enhances source documentation
- Adds product-specific formatting and shortcodes
- Includes additional support sections
- Never directly edits plugin content

## Phase 1: Standardize Source Documentation

### 1.1 README Template Structure

All plugin READMEs in `influxdb3_plugins` must follow this structure:

```markdown
# [Plugin Name]

⚡ [trigger-type1, trigger-type2] 🏷️ [tag1, tag2, tag3] 🔧 InfluxDB 3 Core, InfluxDB 3 Enterprise

## Description

[2-4 sentences describing what the plugin does, its main capabilities, supported trigger types, and any special features]

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `param_name` | string | required | Description of parameter |

### [Category] parameters

[Additional parameter tables organized by category]

### TOML configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `config_file_path` | string | none | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting InfluxDB 3.

#### Example TOML configurations

- [config_file.toml](config_file.toml) - Description

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](/README.md).

## [Special Requirements Section - if applicable]

[For example: Data requirements, Schema requirements, Software requirements]

## Installation steps

1. Start InfluxDB 3 with the Processing Engine enabled:
   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```

2. Install required Python packages (if any):
   ```bash
   influxdb3 install package package_name
   ```

## Trigger setup

### [Trigger Type 1]

[Description and example]

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/[plugin]/[plugin].py \
  --trigger-spec "[spec]" \
  --trigger-arguments '[arguments]' \
  trigger_name
```

### [Trigger Type 2]

[Additional trigger examples as needed]

## Example usage

### Example 1: [Use case name]

[Description of the example]

```bash
# Create the trigger
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/[plugin]/[plugin].py \
  --trigger-spec "[spec]" \
  --trigger-arguments '[arguments]' \
  trigger_name

# Write test data
influxdb3 write \
  --database mydb \
  "measurement,tag=value field=1"

# Query results
influxdb3 query \
  --database mydb \
  "SELECT * FROM result_measurement"
```

### Expected output

```
[Expected output format]
```

**Details:**
- Before: [input state]
- After: [output state]

### Example 2: [Use case name]

[Additional examples following the same pattern]

## Code overview

### Files

- `plugin_name.py`: Main plugin code
- `config.toml`: Example configuration file

### Main functions

#### `function_name(params)`
[Description of what the function does]

Key operations:
1. [Operation 1]
2. [Operation 2]
3. [Operation 3]

### Key logic

[Description of the plugin's core logic and processing flow]

## Troubleshooting

### Common issues

#### Issue: [Problem description]
**Solution**: [How to fix it]

#### Issue: [Problem description]
**Solution**: [How to fix it]

### Debugging tips

1. **[Tip 1]**: [Description]
2. **[Tip 2]**: [Description]

### Performance considerations

- [Performance note 1]
- [Performance note 2]

## Questions/Comments

For questions or comments about this plugin, please open an issue in the [influxdb3_plugins repository](https://github.com/influxdata/influxdb3_plugins/issues).
```

### 1.2 Validation Requirements

Each README must:
- Include all required sections in the correct order
- Use consistent parameter table formatting
- Provide at least 2 complete usage examples
- Include expected output for examples
- Document all configuration parameters
- Link to TOML configuration files (if applicable)

## Phase 2: Transformation to docs-v2

### 2.1 Transformation Rules

When porting content from `influxdb3_plugins` to `docs-v2`:

#### Content Transformations

1. **Remove emoji metadata line** (already in plugin metadata)

2. **Convert relative links to GitHub URLs**:
   - `[file.toml](file.toml)` → `[file.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/[plugin]/file.toml)`
   - `/README.md` → `https://github.com/influxdata/influxdb3_plugins/blob/master/README.md`

3. **Add product shortcodes**:
   - Replace "InfluxDB 3" with `{{% product-name %}}`
   - Add `{{% token-link %}}` for token references
   - Use `{{% show-in "enterprise" %}}` for conditional content

4. **Enhance opening paragraph** (optional):
   - Can be expanded for better SEO and context
   - Must maintain factual accuracy

5. **Add docs-specific sections**:

```markdown
## Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
```

### 2.2 File Structure in docs-v2

Plugin documentation location:
- **Official plugins**: `/content/shared/influxdb3-plugins/plugins-library/official/[plugin-name].md`
- **Example plugins**: `/content/shared/influxdb3-plugins/plugins-library/examples/[plugin-name].md`
- **Community plugins**: `/content/shared/influxdb3-plugins/plugins-library/community/[plugin-name].md`

## Phase 3: Automation Implementation

### 3.1 Validation Script (validate_readme.py)

```python
#!/usr/bin/env python3
"""
Validates plugin README files against the standard template.
"""

import sys
import re
from pathlib import Path

REQUIRED_SECTIONS = [
    "# ",  # Title
    "## Description",
    "## Configuration",
    "### Required parameters",
    "## Installation steps",
    "## Trigger setup",
    "## Example usage",
    "## Code overview",
    "## Troubleshooting",
    "## Questions/Comments"
]

def validate_readme(readme_path):
    """Validate a README file against the template."""
    with open(readme_path, 'r') as f:
        content = f.read()
    
    errors = []
    
    # Check for required sections
    for section in REQUIRED_SECTIONS:
        if section not in content:
            errors.append(f"Missing required section: {section}")
    
    # Check for emoji metadata
    if not re.search(r'^⚡.*🏷️.*🔧', content, re.MULTILINE):
        errors.append("Missing emoji metadata line")
    
    # Check for parameter tables
    if '| Parameter |' not in content:
        errors.append("No parameter tables found")
    
    # Check for code examples
    if '```bash' not in content:
        errors.append("No bash code examples found")
    
    # Check for expected output
    if '### Expected output' not in content and '**Expected output' not in content:
        errors.append("No expected output section found")
    
    return errors

if __name__ == "__main__":
    # Validate all plugin READMEs
    plugin_dirs = Path('influxdata').glob('*/README.md')
    
    all_valid = True
    for readme_path in plugin_dirs:
        errors = validate_readme(readme_path)
        if errors:
            all_valid = False
            print(f"\n❌ {readme_path}:")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"✅ {readme_path}")
    
    sys.exit(0 if all_valid else 1)
```

### 3.2 Transformation Script (port_to_docs.py)

```python
#!/usr/bin/env python3
"""
Transforms plugin READMEs from influxdb3_plugins to docs-v2 format.
"""

import re
import yaml
from pathlib import Path

def transform_content(content, plugin_name):
    """Transform README content for docs-v2."""
    
    # Remove emoji metadata line
    content = re.sub(r'^⚡.*🔧.*$', '', content, flags=re.MULTILINE)
    
    # Convert relative links to GitHub URLs
    base_url = f"https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/{plugin_name}/"
    content = re.sub(r'\[([^\]]+)\]\(([^)]+\.toml)\)', 
                     f'[\\1]({base_url}\\2)', content)
    
    # Replace InfluxDB 3 references
    content = content.replace('InfluxDB 3 Core/Enterprise', '{{% product-name %}}')
    content = content.replace('InfluxDB 3', '{{% product-name %}}')
    
    # Remove Questions/Comments section (will be replaced)
    content = re.sub(r'## Questions/Comments.*', '', content, flags=re.DOTALL)
    
    # Add docs-specific sections
    docs_sections = """
## Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
"""
    
    return content + docs_sections

def process_plugin(source_path, target_path, plugin_name):
    """Process a single plugin README."""
    with open(source_path, 'r') as f:
        content = f.read()
    
    transformed = transform_content(content, plugin_name)
    
    # Ensure target directory exists
    target_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(target_path, 'w') as f:
        f.write(transformed)
    
    print(f"✅ Processed {plugin_name}")

if __name__ == "__main__":
    # Load mapping configuration
    with open('docs_mapping.yaml', 'r') as f:
        config = yaml.safe_load(f)
    
    for plugin_name, mapping in config['plugins'].items():
        source = Path(mapping['source'])
        target = Path(mapping['target'])
        
        if source.exists():
            process_plugin(source, target, plugin_name)
        else:
            print(f"❌ Source not found: {source}")
```

### 3.3 Mapping Configuration (docs_mapping.yaml)

```yaml
plugins:
  basic_transformation:
    source: influxdata/basic_transformation/README.md
    target: ../docs-v2/content/shared/influxdb3-plugins/plugins-library/official/basic-transformation.md
    category: official
  
  downsampler:
    source: influxdata/downsampler/README.md
    target: ../docs-v2/content/shared/influxdb3-plugins/plugins-library/official/downsampler.md
    category: official
  
  forecast_error_evaluator:
    source: influxdata/forecast_error_evaluator/README.md
    target: ../docs-v2/content/shared/influxdb3-plugins/plugins-library/official/forecast-error-evaluator.md
    category: official
  
  influxdb_to_iceberg:
    source: influxdata/influxdb_to_iceberg/README.md
    target: ../docs-v2/content/shared/influxdb3-plugins/plugins-library/official/influxdb-to-iceberg.md
    category: official
  
  mad_check:
    source: influxdata/mad_check/README.md
    target: ../docs-v2/content/shared/influxdb3-plugins/plugins-library/official/mad-check.md
    category: official
  
  notifier:
    source: influxdata/notifier/README.md
    target: ../docs-v2/content/shared/influxdb3-plugins/plugins-library/official/notifier.md
    category: official
  
  prophet_forecasting:
    source: influxdata/prophet_forecasting/README.md
    target: ../docs-v2/content/shared/influxdb3-plugins/plugins-library/official/prophet-forecasting.md
    category: official
  
  state_change:
    source: influxdata/state_change/README.md
    target: ../docs-v2/content/shared/influxdb3-plugins/plugins-library/official/state-change.md
    category: official
  
  stateless_adtk_detector:
    source: influxdata/stateless_adtk_detector/README.md
    target: ../docs-v2/content/shared/influxdb3-plugins/plugins-library/official/stateless-adtk-detector.md
    category: official
  
  system_metrics:
    source: influxdata/system_metrics/README.md
    target: ../docs-v2/content/shared/influxdb3-plugins/plugins-library/official/system-metrics.md
    category: official
  
  threshold_deadman_checks:
    source: influxdata/threshold_deadman_checks/README.md
    target: ../docs-v2/content/shared/influxdb3-plugins/plugins-library/official/threshold-deadman-checks.md
    category: official
```

## Phase 4: GitHub Actions Automation

### 4.1 Automated Workflow Architecture

The plugin documentation sync process uses a two-repository workflow:

1. **influxdb3_plugins**: Detects README changes and creates reminder comments
2. **docs-v2**: Handles the complete sync workflow via issue-triggered automation

### 4.2 Reminder System (influxdb3_plugins)

**File**: `.github/workflows/remind-sync-docs.yml`

- **Triggers**: On pushes to `influxdata/**/README.md` files
- **Action**: Creates commit comment with pre-filled link to docs-v2 sync form
- **No secrets required**: Pure URL-based integration

**Flow**:
```
Plugin README change → Commit → Automatic comment with sync link
```

### 4.3 Sync Automation (docs-v2)

**Files**:
- `.github/workflows/sync-plugins.yml` - Main sync workflow
- `.github/ISSUE_TEMPLATE/sync-plugin-docs.yml` - Issue template for requests

**Triggers**:
- Issue creation with `sync-plugin-docs` label (from template)
- Manual workflow dispatch

**Process**:
1. **Parse request** - Extract plugin names and source commit from issue
2. **Validate source** - Run `validate_readme.py` on specified plugins
3. **Transform content** - Apply docs-v2 formatting and enhancements
4. **Generate screenshots** - Capture Hugo-rendered plugin pages
5. **Create PR** - Submit changes with comprehensive summary
6. **Update issue** - Close with success/failure status

### 4.4 Key Features

- **No cross-repo secrets** - Uses URL parameters and public APIs
- **Visual validation** - Screenshots included in PRs
- **Comprehensive error handling** - Clear feedback on failures
- **Selective sync** - Individual plugins or "all"
- **Progress tracking** - Issue updates throughout process

## Phase 5: Manual Workflow (Until Automation is Ready)

### Step 1: Update Source README
1. Edit README in `influxdb3_plugins/influxdata/[plugin]/`
2. Run validation: `python validate_readme.py`
3. Fix any validation errors

### Step 2: Transform Content
1. Change to docs-v2 directory: `cd ../docs-v2`
2. Run transformation: `npm run sync-plugins`
3. Review generated content: `git diff content/shared/influxdb3-plugins/`

### Step 3: Manual Adjustments (if needed)
1. Add any docs-specific enhancements
2. Verify shortcodes and formatting
3. Test links and examples

### Step 4: Commit and PR
1. Commit changes in influxdb3_plugins
2. Commit transformed content in docs-v2
3. Reference source commit in docs-v2 commit message

## Maintenance Guidelines

### For New Plugins
1. Create README following template in `influxdb3_plugins`
2. Add entry to `docs_mapping.yaml`
3. Run validation and transformation scripts
4. Review and merge generated documentation

### For Updates
1. Update source README in `influxdb3_plugins`
2. Automation (or manual script) creates PR to docs-v2
3. Review for accuracy and merge

### Exception Handling
- Use `[no-sync]` in commit message to skip automation
- Document special cases in `exceptions.yaml`
- Manual override allowed for urgent fixes

## Quality Assurance Checklist

Before merging any plugin documentation:

- [ ] Source README passes validation (`validate_readme.py`)
- [ ] All required sections present and properly formatted
- [ ] At least 2 complete usage examples with expected output
- [ ] All configuration parameters documented
- [ ] Links to GitHub source files work
- [ ] TOML configuration documented (if applicable)
- [ ] Transformation script runs without errors
- [ ] Generated docs-v2 content is accurate
- [ ] Product shortcodes properly applied
- [ ] Support sections included

## Benefits of This Workflow

1. **Consistency**: Single source of truth eliminates divergence
2. **Automation**: Reduces manual work and human error
3. **Validation**: Ensures quality standards are met
4. **Scalability**: Easy to add new plugins
5. **Maintainability**: Clear ownership and update process
6. **Traceability**: Git history shows relationship between repos

## Future Enhancements

1. **Automated testing** of code examples
2. **Version tracking** for plugin compatibility
3. **Changelog generation** from commit history
4. **Multi-language** example generation
5. **API documentation** generation from metadata
6. **Search optimization** through automated tagging

## Conclusion

This workflow establishes a sustainable process for maintaining high-quality, consistent plugin documentation across both repositories while enabling progressive automation. The standardized template and transformation rules ensure that documentation remains synchronized while allowing for repository-specific requirements.