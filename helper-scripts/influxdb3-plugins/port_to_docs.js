#!/usr/bin/env node
/**
 * Transforms plugin READMEs from influxdb3_plugins to docs-v2 format.
 * Maintains consistency while applying documentation-specific enhancements.
 */

import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * Load the mapping configuration file.
 */
async function loadMappingConfig(configPath = 'docs_mapping.yaml') {
  try {
    const content = await fs.readFile(configPath, 'utf8');
    return yaml.load(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Error: Configuration file '${configPath}' not found`);
    } else {
      console.error(`❌ Error parsing YAML configuration: ${error.message}`);
    }
    process.exit(1);
  }
}

/**
 * Remove the emoji metadata line from content.
 */
function removeEmojiMetadata(content) {
  // Remove the emoji line (it's already in the plugin's JSON metadata)
  const pattern = /^⚡.*?🔧.*?$\n*/gm;
  return content.replace(pattern, '');
}

/**
 * Convert relative links to GitHub URLs.
 */
function convertRelativeLinks(content, pluginName) {
  const baseUrl = `https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/${pluginName}/`;
  const rootUrl = 'https://github.com/influxdata/influxdb3_plugins/blob/master/';

  // Convert relative README links (../../README.md, ../README.md, etc.)
  content = content.replace(
    /\[([^\]]+)\]\((\.\.\/)+README\.md\)/g,
    `[$1](${rootUrl}README.md)`
  );

  // Convert TOML file links
  content = content.replace(
    /\[([^\]]+\.toml)\]\(\.?\/?([^)]+\.toml)\)/g,
    (match, linkText, linkPath) => {
      const cleanPath = linkPath.replace(/^\.\//, '');
      return `[${linkText}](${baseUrl}${cleanPath})`;
    }
  );

  // Convert Python file links
  content = content.replace(
    /\[([^\]]+\.py)\]\(\.?\/?([^)]+\.py)\)/g,
    (match, linkText, linkPath) => {
      const cleanPath = linkPath.replace(/^\.\//, '');
      return `[${linkText}](${baseUrl}${cleanPath})`;
    }
  );

  // Convert main README reference
  content = content.replace(
    '[influxdb3_plugins/README.md](/README.md)',
    `[influxdb3_plugins/README.md](${rootUrl}README.md)`
  );

  return content;
}

/**
 * Replace product references with Hugo shortcodes.
 */
function addProductShortcodes(content) {
  // Replace various forms of InfluxDB 3 references
  const replacements = [
    [/InfluxDB 3 Core\/Enterprise/g, '{{% product-name %}}'],
    [/InfluxDB 3 Core and InfluxDB 3 Enterprise/g, '{{% product-name %}}'],
    [/InfluxDB 3 Core, InfluxDB 3 Enterprise/g, '{{% product-name %}}'],
    // Be careful not to replace in URLs or code blocks
    [/(?<!\/)InfluxDB 3(?![/_])/g, '{{% product-name %}}'],
  ];

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  return content;
}

/**
 * Optionally enhance the opening description for better SEO.
 */
function enhanceOpeningParagraph(content) {
  // This is optional - the source description is usually sufficient
  // Only enhance if needed for specific plugins
  return content;
}

/**
 * Add standard logging section if not present.
 */
function addLoggingSection(content) {
  const loggingSection = `
## Logging

Logs are stored in the \`_internal\` database (or the database where the trigger is created) in the \`system.processing_engine_logs\` table. To view logs:

\`\`\`bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
\`\`\`

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error`;

  // Check if logging section already exists
  if (!content.includes('## Logging')) {
    // Insert before Questions/Comments section if it exists
    if (content.includes('## Questions/Comments')) {
      content = content.replace(
        '## Questions/Comments',
        loggingSection + '\n\n## Questions/Comments'
      );
    } else {
      // Otherwise add before the end
      content = content.trimEnd() + '\n' + loggingSection;
    }
  }

  return content;
}

/**
 * Replace Questions/Comments section with docs-v2 support sections.
 */
function replaceSupportSection(content) {
  const supportSections = `## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.`;

  // Remove existing Questions/Comments section
  const pattern = /## Questions\/Comments.*?(?=\n##|\n\n##|$)/gs;
  content = content.replace(pattern, '');

  // Add new support sections
  content = content.trimEnd() + '\n\n' + supportSections;

  return content;
}

/**
 * Ensure code blocks are properly formatted.
 */
function fixCodeBlockFormatting(content) {
  // Add bash syntax highlighting where missing
  content = content.replace(/```\n(influxdb3 |#)/g, '```bash\n$1');

  // Ensure proper spacing around code blocks
  content = content.replace(/```\n\n/g, '```\n');

  return content;
}

/**
 * Add schema requirements section for plugins that need it.
 */
function addSchemaRequirements(content, pluginName) {
  // List of plugins that require schema information
  const schemaPlugins = ['basic_transformation', 'downsampler'];

  if (!schemaPlugins.includes(pluginName)) {
    return content;
  }

  let schemaSection;
  if (pluginName === 'basic_transformation') {
    schemaSection = `## Schema requirements

The plugin assumes that the table schema is already defined in the database, as it relies on this schema to retrieve field and tag names required for processing.

> [!WARNING]
> #### Requires existing schema
>
> By design, the plugin returns an error if the schema doesn't exist or doesn't contain the expected columns.
`;
  } else if (pluginName === 'downsampler') {
    schemaSection = `## Schema management

Each downsampled record includes three additional metadata columns:

- \`record_count\` — the number of original points compressed into this single downsampled row
- \`time_from\` — the minimum timestamp among the original points in the interval  
- \`time_to\` — the maximum timestamp among the original points in the interval
`;
  } else {
    return content;
  }

  // Insert after Configuration section
  if (content.includes('## Installation steps')) {
    content = content.replace(
      '## Installation steps',
      schemaSection + '\n## Installation steps'
    );
  }

  return content;
}

/**
 * Apply all transformations to convert README for docs-v2.
 */
function transformContent(content, pluginName, config) {
  // Apply transformations in order
  content = removeEmojiMetadata(content);
  content = convertRelativeLinks(content, pluginName);
  content = addProductShortcodes(content);
  content = enhanceOpeningParagraph(content);
  content = fixCodeBlockFormatting(content);

  // Add schema requirements if applicable
  if (
    config.additional_sections &&
    config.additional_sections.includes('schema_requirements')
  ) {
    content = addSchemaRequirements(content, pluginName);
  }

  // Add logging section
  content = addLoggingSection(content);

  // Replace support section
  content = replaceSupportSection(content);

  return content;
}

/**
 * Process a single plugin README.
 * Returns true if successful, false otherwise.
 */
async function processPlugin(pluginName, mapping, dryRun = false) {
  const sourcePath = mapping.source;
  const targetPath = mapping.target;

  try {
    // Check if source exists
    await fs.access(sourcePath);
  } catch (error) {
    console.error(`❌ Source not found: ${sourcePath}`);
    return false;
  }

  try {
    // Read source content
    const content = await fs.readFile(sourcePath, 'utf8');

    // Transform content
    const transformed = transformContent(content, pluginName, mapping);

    if (dryRun) {
      console.log(`✅ Would process ${pluginName}`);
      console.log(`   Source: ${sourcePath}`);
      console.log(`   Target: ${targetPath}`);
      return true;
    }

    // Ensure target directory exists
    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    // Write transformed content
    await fs.writeFile(targetPath, transformed, 'utf8');

    console.log(`✅ Processed ${pluginName}`);
    console.log(`   Source: ${sourcePath}`);
    console.log(`   Target: ${targetPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${pluginName}: ${error.message}`);
    return false;
  }
}

/**
 * Check if docs-v2 repository is accessible.
 */
async function validateDocsV2Path() {
  try {
    await fs.access('../..');
    return true;
  } catch (error) {
    console.warn('⚠️  Warning: docs-v2 repository structure not detected');
    console.warn(
      '   Make sure you are running this from docs-v2/helper-scripts/influxdb3-plugins'
    );
    return false;
  }
}

/**
 * Parse command line arguments.
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    config: 'docs_mapping.yaml',
    plugin: null,
    dryRun: false,
    validate: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--config':
        options.config = args[++i];
        break;
      case '--plugin':
        options.plugin = args[++i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--validate':
        options.validate = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        options.help = true;
        break;
    }
  }

  return options;
}

/**
 * Show help message.
 */
function showHelp() {
  console.log(`
Transform plugin READMEs from influxdb3_plugins to docs-v2 format

Usage: node port_to_docs.js [options]

Options:
  --config <file>     Path to mapping configuration file (default: docs_mapping.yaml)
  --plugin <name>     Process only specified plugin
  --dry-run          Show what would be done without making changes
  --validate         Validate configuration only
  --help, -h         Show this help message

Examples:
  node port_to_docs.js                           # Process all plugins
  node port_to_docs.js --plugin basic_transformation  # Process specific plugin
  node port_to_docs.js --dry-run                 # Preview changes
  node port_to_docs.js --validate                # Check configuration
`);
}

/**
 * Main transformation function.
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // Load configuration
  const config = await loadMappingConfig(options.config);

  if (!config || !config.plugins) {
    console.error('❌ Invalid configuration file');
    process.exit(1);
  }

  // Validate configuration
  if (options.validate) {
    console.log('Validating configuration...');
    let valid = true;

    for (const [pluginName, mapping] of Object.entries(config.plugins)) {
      if (!mapping.source || !mapping.target) {
        console.error(
          `❌ Invalid mapping for ${pluginName}: missing source or target`
        );
        valid = false;
        continue;
      }

      try {
        await fs.access(mapping.source);
      } catch (error) {
        console.warn(
          `⚠️  Source not found for ${pluginName}: ${mapping.source}`
        );
      }
    }

    if (valid) {
      console.log('✅ Configuration is valid');
    }
    process.exit(valid ? 0 : 1);
  }

  // Check if we're in the right location
  if (!options.dryRun && !(await validateDocsV2Path())) {
    console.log(
      '\nTo use this script, ensure you are in the correct directory:'
    );
    console.log('  cd docs-v2/helper-scripts/influxdb3-plugins');
    process.exit(1);
  }

  // Process plugins
  let pluginsToProcess = Object.entries(config.plugins);

  if (options.plugin) {
    if (!config.plugins[options.plugin]) {
      console.error(`❌ Plugin '${options.plugin}' not found in configuration`);
      process.exit(1);
    }
    pluginsToProcess = [[options.plugin, config.plugins[options.plugin]]];
  }

  console.log(
    `${options.dryRun ? 'DRY RUN: ' : ''}Processing ${pluginsToProcess.length} plugin(s)...\n`
  );

  let successCount = 0;
  let errorCount = 0;

  for (const [pluginName, mapping] of pluginsToProcess) {
    if (await processPlugin(pluginName, mapping, options.dryRun)) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TRANSFORMATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Successfully processed: ${successCount}`);
  console.log(`Errors: ${errorCount}`);

  if (errorCount === 0) {
    console.log('\n✅ All plugins processed successfully!');
    if (!options.dryRun) {
      console.log('\nNext steps:');
      console.log('1. Review the generated documentation in docs-v2');
      console.log('2. Test that all links work correctly');
      console.log('3. Verify product shortcodes render properly');
      console.log('4. Commit changes in both repositories');
    }
  } else {
    console.log(`\n❌ ${errorCount} plugin(s) failed to process`);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run main function
if (import.meta.url.endsWith(process.argv[1])) {
  main().catch((error) => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

export { transformContent, processPlugin, loadMappingConfig };
