/**
 * Telegraf Plugin Audit Report Generator
 *
 * Generates markdown reports for Telegraf plugin documentation audits
 *
 * @module telegraf-audit-reporter
 */

import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Generate a comprehensive Telegraf audit report
 */
export async function generateTelegrafAuditReport(comparison, version, docsBranch, outputDir) {
  const timestamp = new Date().toISOString();
  const reportPath = join(outputDir, 'telegraf-audit-report.md');

  const report = generateReportContent(comparison, version, docsBranch, timestamp);
  await fs.writeFile(reportPath, report, 'utf8');

  // Also generate JSON output for programmatic use
  const jsonPath = join(outputDir, 'telegraf-audit-report.json');
  await fs.writeFile(jsonPath, JSON.stringify(comparison, null, 2), 'utf8');

  console.log(`\n📊 Report Statistics:`);
  console.log(`   Plugins: ${comparison.summary.totalDocumentedPlugins}/${comparison.summary.totalSourcePlugins} documented`);
  console.log(`   Data Formats: ${comparison.summary.totalDocumentedDataFormats}/${comparison.summary.totalSourceDataFormats} documented`);
  console.log(`   Missing documentation: ${comparison.summary.totalMissingDocs + comparison.summary.totalMissingDataFormatDocs}`);
  console.log(`   Potentially orphaned docs: ${comparison.summary.totalOrphanedDocs + comparison.summary.totalOrphanedDataFormatDocs}`);
}

/**
 * Generate the markdown report content
 */
function generateReportContent(comparison, version, docsBranch, timestamp) {
  const { summary } = comparison;

  const totalSource = summary.totalSourcePlugins + summary.totalSourceDataFormats;
  const totalDocumented = summary.totalDocumentedPlugins + summary.totalDocumentedDataFormats;
  const coveragePercent = totalSource > 0
    ? ((totalDocumented / totalSource) * 100).toFixed(1)
    : '0.0';

  let report = `# Telegraf Plugin Documentation Audit Report

**Generated:** ${timestamp}
**Telegraf Version:** \`${version}\`
**Docs Branch:** \`${docsBranch}\`

## Summary

| Metric | Count |
|--------|-------|
| Total plugins in Telegraf | ${summary.totalSourcePlugins} |
| Documented plugins | ${summary.totalDocumentedPlugins} |
| Missing plugin documentation | ${summary.totalMissingDocs} |
| Potentially orphaned plugin docs | ${summary.totalOrphanedDocs} |
| Total data formats in Telegraf | ${summary.totalSourceDataFormats} |
| Documented data formats | ${summary.totalDocumentedDataFormats} |
| Missing data format documentation | ${summary.totalMissingDataFormatDocs} |
| Potentially orphaned data format docs | ${summary.totalOrphanedDataFormatDocs} |

**Overall Coverage:** ${coveragePercent}% (${totalDocumented}/${totalSource})

---

## Coverage by Category

### Plugins

| Category | Source | Documented | Missing | Orphaned | Coverage |
|----------|--------|------------|---------|----------|----------|
`;

  // Add plugin category rows
  for (const data of Object.values(comparison.plugins)) {
    const coverage = data.source.length > 0
      ? ((data.documented.length / data.source.length) * 100).toFixed(1)
      : '100.0';
    report += `| ${data.config.displayName} | ${data.source.length} | ${data.documented.length} | ${data.missing.length} | ${data.orphaned.length} | ${coverage}% |\n`;
  }

  report += `
### Data Formats

| Category | Source | Documented | Missing | Orphaned | Coverage |
|----------|--------|------------|---------|----------|----------|
`;

  // Add data format category rows
  for (const data of Object.values(comparison.dataFormats)) {
    const coverage = data.source.length > 0
      ? ((data.documented.length / data.source.length) * 100).toFixed(1)
      : '100.0';
    report += `| ${data.config.displayName} | ${data.source.length} | ${data.documented.length} | ${data.missing.length} | ${data.orphaned.length} | ${coverage}% |\n`;
  }

  // Section: Missing Documentation
  report += `
---

## Missing Documentation

These plugins exist in the Telegraf repository with README.md files but are not documented in docs-v2.

`;

  let hasMissingDocs = false;

  for (const data of Object.values(comparison.plugins)) {
    if (data.missing.length > 0) {
      hasMissingDocs = true;
      report += `### ${data.config.displayName} (${data.missing.length} missing)\n\n`;
      report += `| Plugin ID | Source README |\n`;
      report += `|-----------|---------------|\n`;

      for (const plugin of data.missing) {
        const sourceLink = `https://github.com/influxdata/telegraf/blob/${version}/${data.config.sourcePath}/${plugin.originalName}/README.md`;
        report += `| \`${plugin.id}\` | [README.md](${sourceLink}) |\n`;
      }

      report += `\n`;
    }
  }

  for (const data of Object.values(comparison.dataFormats)) {
    if (data.missing.length > 0) {
      hasMissingDocs = true;
      report += `### ${data.config.displayName} (${data.missing.length} missing)\n\n`;
      report += `| Format ID | Source README |\n`;
      report += `|-----------|---------------|\n`;

      for (const format of data.missing) {
        const sourceLink = `https://github.com/influxdata/telegraf/blob/${version}/${data.config.sourcePath}/${format.originalName}/README.md`;
        report += `| \`${format.id}\` | [README.md](${sourceLink}) |\n`;
      }

      report += `\n`;
    }
  }

  if (!hasMissingDocs) {
    report += `*No missing documentation found.*\n\n`;
  }

  // Section: Potentially Orphaned Documentation
  report += `---

## Potentially Orphaned Documentation

These documentation pages exist in docs-v2 but no corresponding plugin/format with README.md was found in the Telegraf repository. They may need to be reviewed for removal or the source plugin may have been renamed/moved.

`;

  let hasOrphanedDocs = false;

  for (const data of Object.values(comparison.plugins)) {
    if (data.orphaned.length > 0) {
      hasOrphanedDocs = true;
      report += `### ${data.config.displayName} (${data.orphaned.length} orphaned)\n\n`;
      report += `| Plugin ID | Docs Location |\n`;
      report += `|-----------|---------------|\n`;

      for (const doc of data.orphaned) {
        const dirname = doc.originalName || doc.id;
        const docsLink = `https://github.com/influxdata/docs-v2/tree/${docsBranch}/${data.config.docsPath}/${dirname}`;
        report += `| \`${doc.id}\` | [${data.config.docsPath}/${dirname}/](${docsLink}) |\n`;
      }

      report += `\n`;
    }
  }

  for (const data of Object.values(comparison.dataFormats)) {
    if (data.orphaned.length > 0) {
      hasOrphanedDocs = true;
      report += `### ${data.config.displayName} (${data.orphaned.length} orphaned)\n\n`;
      report += `| Format ID | Docs Location |\n`;
      report += `|-----------|---------------|\n`;

      for (const doc of data.orphaned) {
        const filename = doc.originalName || doc.id;
        const docsLink = `https://github.com/influxdata/docs-v2/tree/${docsBranch}/${data.config.docsPath}/${filename}.md`;
        report += `| \`${doc.id}\` | [${filename}.md](${docsLink}) |\n`;
      }

      report += `\n`;
    }
  }

  if (!hasOrphanedDocs) {
    report += `*No orphaned documentation found.*\n\n`;
  }

  // Section: Fully Documented (collapsed for brevity)
  report += `---

## Fully Documented Plugins

<details>
<summary>Click to expand the list of documented plugins (${totalDocumented} total)</summary>

`;

  for (const data of Object.values(comparison.plugins)) {
    if (data.documented.length > 0) {
      report += `### ${data.config.displayName} (${data.documented.length})\n\n`;
      report += data.documented.map(p => `- \`${p.id}\``).join('\n');
      report += `\n\n`;
    }
  }

  for (const data of Object.values(comparison.dataFormats)) {
    if (data.documented.length > 0) {
      report += `### ${data.config.displayName} (${data.documented.length})\n\n`;
      report += data.documented.map(p => `- \`${p.id}\``).join('\n');
      report += `\n\n`;
    }
  }

  report += `</details>

---

## Notes

- **Missing documentation**: Plugins in Telegraf with \`README.md\` files that don't have corresponding documentation in docs-v2
- **Orphaned documentation**: Documentation in docs-v2 that doesn't have a corresponding plugin with \`README.md\` in Telegraf
- Orphaned docs may be intentional (deprecated plugins, renamed plugins) - review before removing
- Some plugins may have different names in source vs docs (e.g., \`prometheusremotewrite\` vs \`prometheus-remote-write\`)

## Actions

1. **Add missing documentation**: Create docs-v2 pages for plugins listed in "Missing Documentation"
2. **Review orphaned docs**: Investigate plugins listed in "Potentially Orphaned Documentation"
   - If the plugin was removed from Telegraf, consider removing or archiving the docs
   - If the plugin was renamed, update the docs to match
   - If the plugin exists but without README.md, consider adding a README to the source

---

*Report generated by \`docs audit telegraf\` command*
`;

  return report;
}
