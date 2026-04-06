/**
 * Issue Creator
 *
 * Creates GitHub issues for high/critical documentation gaps found by the
 * gap reporter. Uses the `gh` CLI (GitHub CLI) to avoid adding an @octokit
 * dependency.
 *
 * Supports --dry-run mode which prints issue bodies to stdout instead of
 * calling the GitHub API.
 *
 * SECURITY: No private repo names or URLs are hardcoded. Repository context
 * is read from `gh repo view` or from environment variables.
 *
 * @module issue-creator
 */

import { execSync, execFileSync } from 'child_process';
import { scoreSeverity, deriveCategoryLabel } from './gap-severity.js';

// ─── Label management ─────────────────────────────────────────────────────────

/**
 * Ensure required labels exist in the repo. Creates them if missing.
 * Labels are created with appropriate colours for easy visual scanning.
 * Silently skips labels that already exist.
 */
async function ensureLabels(dryRun) {
  const labelsToCreate = [
    { name: 'doc-gap', color: 'd93f0b', description: 'Documentation gap detected by automated pipeline' },
    { name: 'doc-gap:critical', color: 'b60205', description: 'Critical priority documentation gap' },
    { name: 'doc-gap:high', color: 'e4e669', description: 'High priority documentation gap' },
    { name: 'doc-gap:medium', color: '0075ca', description: 'Medium priority documentation gap' },
    { name: 'doc-gap:low', color: 'cfd3d7', description: 'Low priority documentation gap' },
  ];

  if (dryRun) return; // Skip label creation in dry-run mode

  for (const label of labelsToCreate) {
    try {
      execSync(
        `gh label create "${label.name}" --color "${label.color}" --description "${label.description}" 2>/dev/null || true`,
        { stdio: 'pipe' }
      );
    } catch {
      // Label likely already exists; ignore
    }
  }
}

// ─── Issue body builder ───────────────────────────────────────────────────────

/**
 * Build the markdown body for a gap issue.
 *
 * @param {object} gap     - Gap entry from gap-reporter output
 * @param {string} product - 'core' | 'enterprise' | 'both'
 * @param {string} version - Release version string
 * @returns {string}
 */
function buildIssueBody(gap, product, version) {
  const severityEmoji = { critical: '🔴', high: '🟠', medium: '🟡', low: '🔵' }[gap.severity] || '⚪';
  const editionLabel =
    gap.editionScope === 'both'
      ? 'Core and Enterprise'
      : `InfluxDB 3 ${gap.editionScope.charAt(0).toUpperCase() + gap.editionScope.slice(1)}`;

  const suggestedPaths =
    gap.suggestedDocPaths?.length > 0
      ? gap.suggestedDocPaths.map((p) => `- ${p}`).join('\n')
      : '- No adjacent documentation found — create a new page in the appropriate section.';

  const existingPages =
    gap.existingDocPages?.length > 0
      ? gap.existingDocPages.map((p) => `- \`${p}\``).join('\n')
      : '- None';

  const editionDoneItems = [];
  if (gap.editionScope === 'both' || gap.editionScope === 'core') {
    editionDoneItems.push('- [ ] Core behavior documented');
  }
  if (gap.editionScope === 'both' || gap.editionScope === 'enterprise') {
    editionDoneItems.push('- [ ] Enterprise-specific behavior documented (if any)');
  }
  if (gap.editionScope === 'both') {
    editionDoneItems.push('- [ ] Superset relationship noted (Enterprise includes all Core changes)');
  }

  const sections = [
    `## ${severityEmoji} ${gap.severity.charAt(0).toUpperCase() + gap.severity.slice(1)} Priority Documentation Gap`,
    '',
    `**Release:** ${product} v${version}`,
    `**Category:** ${gap.category || deriveCategoryLabel(gap.path, gap.tags)}`,
    `**Edition scope:** ${editionLabel}`,
    `**Change type:** ${gap.changeType}`,
    '',
    '## Spec Claim',
    '',
    '| Field | Value |',
    '|-------|-------|',
    `| Operation ID | \`${gap.operationId}\` |`,
    `| HTTP method | \`${gap.method}\` |`,
    `| API path | \`${gap.path}\` |`,
    `| Spec summary | ${gap.summary || '*(not provided in spec)*'} |`,
    '',
    '## Severity Rationale',
    '',
    gap.severityRationale,
    '',
    '## Existing Documentation',
    '',
    existingPages,
    '',
    '## Suggested Documentation Location',
    '',
    suggestedPaths,
    '',
    ...(gap.note ? [`> **Note:** ${gap.note}`, ''] : []),
    '## Engineering Verification Ask',
    '',
    'Before writing documentation, please confirm:',
    '',
    `- [ ] Is \`${gap.operationId}\` (\`${gap.method} ${gap.path}\`) intended for public use in v${version}?`,
    '- [ ] Does this endpoint replace or extend an existing endpoint? If so, which one?',
    '- [ ] What are the primary use cases for end users?',
    '- [ ] Are there any known limitations, gotchas, or required prerequisites?',
    gap.editionScope === 'both'
      ? '- [ ] Is the behavior identical across Core and Enterprise, or are there edition-specific differences?'
      : '',
    '',
    '## Definition of Done',
    '',
    `- [ ] Engineering confirmed endpoint is public and stable in v${version}`,
    '- [ ] Doc page created or updated at the suggested location',
    '- [ ] API reference entry updated (description, example, parameters)',
    '- [ ] Related guides updated if endpoint behavior changed',
    `- [ ] Tested against ${product} v${version} release binary`,
    ...editionDoneItems,
    '',
    '---',
    `*Auto-generated by the release documentation pipeline for ${product} v${version}.*`,
  ];

  return sections.filter((s) => s !== '').join('\n');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Create GitHub issues for high/critical documentation gaps.
 *
 * @param {object} params
 * @param {object} params.mapResult     - From runDocLocationMap()
 * @param {string} params.product       - 'core' | 'enterprise' | 'both'
 * @param {string} params.version       - Release version
 * @param {string} [params.previousVersion]
 * @param {boolean} [params.dryRun]    - Print to stdout instead of creating issues
 * @param {string[]} [params.severities] - Severity levels to file (default: critical + high)
 */
export async function createGapIssues({
  mapResult,
  product,
  version,
  previousVersion,
  dryRun = false,
  severities = ['critical', 'high'],
}) {
  // Collect all uncovered gaps from the map result
  const gaps = [];

  for (const [edition, data] of Object.entries(mapResult.editions)) {
    const { uncovered, operationIdToPath } = data;
    for (const opId of uncovered) {
      const opInfo = operationIdToPath.get(opId);
      if (!opInfo) continue;

      // Determine cross-edition scope
      let editionScope = edition;
      if (mapResult.editions.core && mapResult.editions.enterprise) {
        const inCore = mapResult.editions.core.operationIdToPath.has(opId);
        const inEnterprise = mapResult.editions.enterprise.operationIdToPath.has(opId);
        editionScope = inCore && inEnterprise ? 'both' : inCore ? 'core' : 'enterprise';
      }

      const changeType = 'existing'; // Without delta info here; gap-reporter handles delta scoring
      const { severity, rationale } = scoreSeverity(opInfo, editionScope, changeType);

      if (!severities.includes(severity)) continue;

      gaps.push({
        operationId: opId,
        method: opInfo.method,
        path: opInfo.path,
        summary: opInfo.summary || '',
        tags: opInfo.tags || [],
        category: deriveCategoryLabel(opInfo.path, opInfo.tags),
        editionScope,
        changeType,
        severity,
        severityRationale: rationale,
        existingDocPages: [],
        suggestedDocPaths: [],
      });
    }
  }

  // Deduplicate by operationId
  const seen = new Set();
  const deduped = gaps.filter((g) => {
    if (seen.has(g.operationId)) return false;
    seen.add(g.operationId);
    return true;
  });

  if (deduped.length === 0) {
    console.log('No actionable gaps to file as issues.');
    return;
  }

  console.log(`\n📋 ${dryRun ? '[DRY RUN] Would create' : 'Creating'} ${deduped.length} issue(s) for ${severities.join('/')} gaps...`);

  if (!dryRun) {
    await ensureLabels(false);
  }

  for (const gap of deduped) {
    const title = `Doc gap [${gap.severity}]: ${gap.operationId} — ${product} v${version}`;
    const body = buildIssueBody(gap, product, version);

    const labels = [
      'documentation',
      'doc-gap',
      `doc-gap:${gap.severity}`,
    ];

    if (gap.editionScope === 'both') {
      labels.push('product:influxdb3-core', 'product:influxdb3-enterprise');
    } else {
      labels.push(`product:influxdb3-${gap.editionScope}`);
    }

    if (dryRun) {
      console.log('\n' + '─'.repeat(72));
      console.log(`ISSUE: ${title}`);
      console.log(`LABELS: ${labels.join(', ')}`);
      console.log('─'.repeat(72));
      console.log(body);
    } else {
      try {
        const labelArgs = labels.map((l) => `--label "${l}"`).join(' ');
        execSync(
          `gh issue create --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" ${labelArgs}`,
          { stdio: ['pipe', 'inherit', 'pipe'] }
        );
        console.log(`  ✓ Created: ${title}`);
      } catch (err) {
        // If label doesn't exist in repo, retry without product labels
        try {
          execSync(
            `gh issue create --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" --label "documentation" --label "doc-gap"`,
            { stdio: ['pipe', 'inherit', 'pipe'] }
          );
          console.log(`  ✓ Created (without product labels): ${title}`);
        } catch (err2) {
          console.error(`  ✗ Failed to create issue for ${gap.operationId}: ${err2.message}`);
        }
      }
    }
  }

  if (dryRun) {
    console.log('\n' + '─'.repeat(72));
    console.log(`[DRY RUN] Would have created ${deduped.length} issue(s). Pass --create-issue without --dry-run to create them.`);
  }
}
