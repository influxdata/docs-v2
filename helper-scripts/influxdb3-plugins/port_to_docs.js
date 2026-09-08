#!/usr/bin/env node
/**
 * Transforms plugin READMEs from influxdb3_plugins to docs-v2 format.
 * Maintains consistency while applying documentation-specific enhancements.
 */

import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {
  fetchRegistryIndex,
  parseRegistryIndex,
  partitionDiscoveredPlugins,
} from './discovery.js';
import { mapEntry, renderPluginDataYaml } from './plugin-data.js';
import { stubPath, scaffoldStub } from './stub-template.js';
import {
  collapseByPlugin,
  detectRemovedPlugins,
  formatSummary,
  hasFatal,
  needsAttention,
  writeStepOutputs,
  writeStepSummary,
} from './reporting.js';

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
 * Remove the emoji metadata lines from content.
 * Handles both single-line and multi-line formats:
 * - Single: ⚡ scheduled 🔧 InfluxDB 3
 * - Multi:  ⚡ scheduled\n🏷️ tags 🔧 InfluxDB 3
 */
function removeEmojiMetadata(content) {
  // Remove multi-line emoji metadata (⚡ on first line, 🔧 on second line)
  content = content.replace(/^⚡[^\n]*\n🏷️[^\n]*🔧[^\n]*\n*/gm, '');
  // Remove single-line emoji metadata (⚡ and 🔧 on same line)
  content = content.replace(/^⚡.*?🔧.*?$\n*/gm, '');
  return content;
}

/**
 * Remove level 1 heading from content.
 */
function removeTitleHeading(content) {
  // Title is in frontmatter, remove H1 from content
  return content.replace(/^#\s+.+$\n*/m, '');
}

/**
 * Remove standalone Description heading.
 */
function removeDescriptionHeading(content) {
  // Remove "## Description" heading when it appears alone on a line
  content = content.replace(/^##\s+Description\s*$/m, '');
  return content;
}

/**
 * Expand common abbreviations for readability.
 */
function expandAbbreviations(content) {
  // Replace e.g., with "for example,"
  content = content.replace(/\be\.g\.,\s*/g, 'for example, ');
  // Replace i.e., with "that is,"
  content = content.replace(/\bi\.e\.,\s*/g, 'that is, ');
  return content;
}

/**
 * Convert README TOML links to internal section links.
 */
function convertTomlReadmeLinks(content) {
  // If document has TOML configuration section, link to it instead of external README
  if (content.includes('## Using TOML Configuration Files')) {
    content = content.replace(
      /\[([^\]]*TOML[^\]]*)\]\(https:\/\/github\.com\/influxdata\/influxdb3_plugins\/blob\/master\/README\.md\)/gi,
      '[$1](#using-toml-configuration-files)'
    );
  }
  return content;
}

/**
 * Convert relative links to GitHub URLs.
 */
function convertRelativeLinks(content, pluginName) {
  const baseUrl = `https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/${pluginName}/`;
  const rootUrl =
    'https://github.com/influxdata/influxdb3_plugins/blob/master/';

  // Convert cross-plugin README links to the sibling plugin's docs-v2 page.
  // e.g. [influxdata/notifier plugin](../notifier/README.md) ->
  //      [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/)
  // Upstream plugin folders use underscore_case; docs-v2 slugs use hyphens.
  content = content.replace(
    /\[([^\]]+)\]\(\.\.\/([a-z0-9_]+)\/README\.md\)/g,
    (match, linkText, pluginDir) =>
      `[${linkText}](/influxdb3/version/plugins/library/official/${pluginDir.replace(/_/g, '-')}/)`
  );

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
    // Be careful not to replace in URLs, code blocks, or product names like "InfluxDB 3 Explorer"
    [/(?<!\/)InfluxDB 3(?! Explorer)(?![/_])/g, '{{% product-name %}}'],
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
 * Extract style attributes from HTML comments and apply to headings.
 * Converts: `#### Heading <!-- {.class} -->` to `#### Heading {.class}`
 *
 * Supported class formats:
 * - {.green}, {.orange} - Color styling
 * - {.recommended}, {.not-recommended} - Semantic styling
 * - Any other {.classname} format
 *
 * This allows source READMEs to render cleanly on GitHub (which ignores
 * HTML comments) while still supporting Hugo style classes in docs-v2.
 */
function extractStyleAttributes(content) {
  // Match headings with HTML comment style attributes
  // Pattern: (#+) (heading text) <!-- ({.classname}) -->
  const pattern = /^(#{1,6})\s+(.+?)\s*<!--\s*(\{[^}]+\})\s*-->\s*$/gm;
  return content.replace(pattern, '$1 $2 $3');
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

const GENERATED_REGION_BEGIN = '<!-- BEGIN GENERATED PLUGIN CONTENT -->';
const GENERATED_REGION_END = '<!-- END GENERATED PLUGIN CONTENT -->';

/**
 * Merge freshly generated README content into a shared page, preserving any
 * hand-owned text outside the generated region.
 *
 * - No existing markers: the whole file is generated content; wrap it in
 *   markers so future runs can locate the region.
 * - Both markers present, in order: replace only the text between them.
 * - Markers missing, duplicated, or out of order: report an error instead of
 *   writing, so a malformed page isn't silently corrupted.
 */
function mergeGeneratedRegion(existingContent, generatedContent) {
  const body = generatedContent.trim();

  if (!existingContent) {
    return {
      content: `${GENERATED_REGION_BEGIN}\n${body}\n${GENERATED_REGION_END}\n`,
    };
  }

  const beginIndex = existingContent.indexOf(GENERATED_REGION_BEGIN);
  const endIndex = existingContent.indexOf(GENERATED_REGION_END);

  if (beginIndex === -1 && endIndex === -1) {
    return {
      content: `${GENERATED_REGION_BEGIN}\n${body}\n${GENERATED_REGION_END}\n`,
    };
  }

  if (beginIndex === -1 || endIndex === -1 || endIndex < beginIndex) {
    return {
      error: `Unterminated generated-region marker: expected both "${GENERATED_REGION_BEGIN}" and "${GENERATED_REGION_END}", in that order.`,
    };
  }

  const prefix = existingContent.slice(
    0,
    beginIndex + GENERATED_REGION_BEGIN.length
  );
  const suffix = existingContent.slice(endIndex);
  return { content: `${prefix}\n${body}\n${suffix}` };
}

/**
 * Apply all transformations to convert README for docs-v2.
 */
function transformContent(content, pluginName) {
  // Apply transformations in order
  content = removeEmojiMetadata(content);
  content = removeTitleHeading(content);
  content = removeDescriptionHeading(content);
  content = convertRelativeLinks(content, pluginName);
  content = expandAbbreviations(content);
  content = convertTomlReadmeLinks(content);
  content = addProductShortcodes(content);
  content = enhanceOpeningParagraph(content);
  content = extractStyleAttributes(content);
  content = fixCodeBlockFormatting(content);

  // Add logging section
  content = addLoggingSection(content);

  // Replace support section
  content = replaceSupportSection(content);

  return content;
}

/**
 * Create a Core and Enterprise stub for every discovered plugin that has
 * neither yet. Never rewrites a stub that already exists.
 */
async function scaffoldMissingStubs(discoveredPlugins, dryRun = false) {
  const results = { scaffolded: [], skipped: [], byPlugin: [] };

  for (const plugin of discoveredPlugins) {
    const created = [];

    for (const product of ['core', 'enterprise']) {
      const targetPath = stubPath(plugin, product);
      let exists = true;
      try {
        await fs.access(targetPath);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        exists = false;
      }

      const scaffold = scaffoldStub(plugin, product, { exists });
      if (scaffold.skipped) {
        results.skipped.push(scaffold.path);
        continue;
      }

      if (dryRun) {
        console.log(`✅ Would scaffold ${scaffold.path}`);
      } else {
        await fs.mkdir(path.dirname(scaffold.path), { recursive: true });
        await fs.writeFile(scaffold.path, scaffold.content, 'utf8');
        console.log(`✅ Scaffolded ${scaffold.path}`);
      }
      results.scaffolded.push(scaffold.path);
      created.push(`${product} stub`);
    }

    if (created.length > 0) {
      results.byPlugin.push({
        plugin: plugin.name,
        status: 'scaffolded',
        detail: created.join(', '),
      });
    }
  }

  return results;
}

/**
 * Resolve the `--plugin` argument against the mapping config.
 *
 * Accepts a single name, a comma-separated list, or `all` (also the default).
 * A list is processed in one run rather than one run per plugin, because each
 * run appends `summary` and `needs_attention` to `$GITHUB_OUTPUT` -- a loop
 * would leave only the last plugin's outcome visible to the workflow.
 */
function selectPlugins(configPlugins, pluginArg) {
  const entries = Object.entries(configPlugins);

  if (!pluginArg || pluginArg === 'all') {
    return { selected: entries, unknown: [] };
  }

  const requested = pluginArg
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  return {
    selected: requested
      .filter((name) => configPlugins[name])
      .map((name) => [name, configPlugins[name]]),
    unknown: requested.filter((name) => !configPlugins[name]),
  };
}

const SHARED_OFFICIAL_DIR =
  '../../content/shared/influxdb3-plugins/plugins-library/official';

/**
 * Shared pages left behind by a plugin that is no longer in the registry.
 * Read-only: the sync reports removals and never deletes a published page.
 */
async function findRemovedPlugins(discoveredPlugins) {
  let filenames;
  try {
    filenames = await fs.readdir(SHARED_OFFICIAL_DIR);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return [];
  }
  return detectRemovedPlugins(discoveredPlugins, filenames);
}

/**
 * Process a single plugin README.
 *
 * Returns a `{ plugin, status, detail }` result rather than a pass/fail
 * boolean, so the run can report a missing README as a skip and a mangled
 * region as a failure instead of collapsing both into "error".
 */
async function processPlugin(pluginName, mapping, dryRun = false) {
  const sourcePath = mapping.source;
  const targetPath = mapping.target;
  const result = (status, detail) => ({ plugin: pluginName, status, detail });

  try {
    // Check if source exists
    await fs.access(sourcePath);
  } catch {
    // A plugin published without a README the transform can read is a gap to
    // fill upstream, not a broken sync. Report it and keep going.
    return result('skipped', `source README not found: ${sourcePath}`);
  }

  try {
    // Read source content
    const content = await fs.readFile(sourcePath, 'utf8');

    // Transform content
    const transformed = transformContent(content, pluginName);

    // Preserve any hand-owned text outside the generated region
    let existingTarget = null;
    try {
      existingTarget = await fs.readFile(targetPath, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    const merged = mergeGeneratedRegion(existingTarget, transformed);
    if (merged.error) {
      return result('error', merged.error);
    }

    if (merged.content === existingTarget) {
      return result('unchanged', targetPath);
    }

    if (dryRun) {
      return result('updated', `would write ${targetPath}`);
    }

    // Ensure target directory exists
    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    // Write merged content
    await fs.writeFile(targetPath, merged.content, 'utf8');

    return result('updated', targetPath);
  } catch (error) {
    return result('error', error.message);
  }
}

/**
 * Check if docs-v2 repository is accessible.
 */
async function validateDocsV2Path() {
  try {
    await fs.access('../..');
    return true;
  } catch {
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
      } catch {
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

  // Discover official plugins from the registry index. The transform loop
  // below still walks docs_mapping.yaml's plugins map for README content
  // until Task 5 lands stub scaffolding for plugins that aren't mapped yet,
  // but data/influxdb3_plugins.yml is fully registry-driven and regenerated
  // every run regardless of --plugin.
  // Each artifact the run touches appends a `{ plugin, status, detail }`
  // entry. `main` collapses them to one row per plugin before reporting.
  const artifactResults = [];

  if (!options.plugin) {
    console.log('Discovering official plugins from the registry index...');

    // A registry fetch failure is a bad afternoon on the network, not drift.
    // It must not fail a nightly run, so it is reported as a skip.
    let discovered = null;
    try {
      const indexJson = await fetchRegistryIndex();
      const parsed = parseRegistryIndex(indexJson, {
        overrides: config.overrides ?? {},
        exclude: config.exclude ?? [],
      });
      discovered = parsed.plugins;

      const { mapped, unmapped } = partitionDiscoveredPlugins(
        discovered,
        Object.keys(config.plugins)
      );
      console.log(
        `Discovered ${discovered.length} official plugin(s) in the registry.`
      );
      if (parsed.excluded.length > 0) {
        console.log(
          `Excluded by docs_mapping.yaml: ${parsed.excluded.join(', ')}`
        );
      }
      console.log(`  Mapped (transformed below): ${mapped.length}`);
      console.log(`  Not yet mapped: ${unmapped.length}`);
      if (unmapped.length > 0) {
        console.log(`    ${unmapped.map((plugin) => plugin.name).join(', ')}`);
      }
    } catch (error) {
      console.warn(`⚠️  Could not read the registry index: ${error.message}`);
      artifactResults.push({
        plugin: 'registry index',
        status: 'skipped',
        detail: `could not read the registry index: ${error.message}`,
      });
    }

    if (discovered) {
      // Writing is a different failure. An unwritable data file or stub means
      // the sync reported success while publishing nothing, which is the
      // failure this pipeline is being rebuilt to stop having.
      try {
        const dataYaml = renderPluginDataYaml(discovered.map(mapEntry));
        const dataFilePath = '../../data/influxdb3_plugins.yml';
        if (options.dryRun) {
          console.log(`DRY RUN: would write ${dataFilePath}`);
        } else {
          await fs.writeFile(dataFilePath, dataYaml, 'utf8');
          console.log(`Wrote ${dataFilePath}`);
        }

        const scaffoldResults = await scaffoldMissingStubs(
          discovered,
          options.dryRun
        );
        console.log(
          `Product stubs: ${scaffoldResults.scaffolded.length} scaffolded, ` +
            `${scaffoldResults.skipped.length} already present.`
        );
        artifactResults.push(...scaffoldResults.byPlugin);
      } catch (error) {
        console.error(`❌ Could not write generated files: ${error.message}`);
        artifactResults.push({
          plugin: 'generated files',
          status: 'error',
          detail: error.message,
        });
      }

      artifactResults.push(
        ...(await findRemovedPlugins(discovered)).map((slug) => ({
          plugin: slug,
          status: 'removed',
          detail: 'shared page has no plugin in the registry index',
        }))
      );
    }
    console.log('');
  }

  // Process plugins
  const { selected: pluginsToProcess, unknown } = selectPlugins(
    config.plugins,
    options.plugin
  );

  if (unknown.length > 0) {
    console.error(`❌ Not found in configuration: ${unknown.join(', ')}`);
    process.exit(1);
  }

  console.log(
    `${options.dryRun ? 'DRY RUN: ' : ''}Processing ${pluginsToProcess.length} plugin(s)...\n`
  );

  for (const [pluginName, mapping] of pluginsToProcess) {
    artifactResults.push(
      await processPlugin(pluginName, mapping, options.dryRun)
    );
  }

  const results = collapseByPlugin(artifactResults);
  const summary = formatSummary(results);

  console.log('\n' + '='.repeat(60));
  console.log('TRANSFORMATION SUMMARY');
  console.log('='.repeat(60));
  console.log(summary);

  writeStepSummary(`## InfluxDB 3 plugin documentation sync\n\n${summary}`);
  writeStepOutputs({
    needs_attention: needsAttention(results) ? 'true' : 'false',
    summary,
  });

  process.exit(hasFatal(results) ? 1 : 0);
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

export {
  transformContent,
  processPlugin,
  loadMappingConfig,
  mergeGeneratedRegion,
  selectPlugins,
};
