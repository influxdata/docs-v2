/**
 * Gap Reporter
 *
 * Assembles a severity-scored documentation gap report from:
 *   - A doc location map result (from doc-location-map.js)
 *   - An optional spec delta (operationIds that changed between two version tags)
 *
 * Outputs:
 *   - Structured JSON gap report (for machine consumption / issue creation)
 *   - Markdown summary (for PR bodies and human review)
 *
 * SECURITY: Uses only local git history and committed spec files. No external
 * network access required.
 *
 * @module gap-reporter
 */

import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';
import yaml from 'js-yaml';
import {
  scoreSeverity,
  deriveCategoryLabel,
  sortBySeverity,
} from './gap-severity.js';

// ─── Spec delta computation ───────────────────────────────────────────────────

/**
 * Compute the set of operationIds that changed between two git refs by diffing
 * the committed OpenAPI spec files.
 *
 * Requires a full git history (fetch-depth: 0 in CI).
 *
 * @param {string} specRelPath     - Repo-relative path to the spec YAML file
 * @param {string} fromRef         - Previous version tag or commit SHA
 * @param {string} toRef           - New version tag, branch, or 'HEAD'
 * @param {string} repoRoot        - Absolute path to docs-v2 repo root
 * @returns {{ added: string[], modified: string[], removed: string[] }}
 */
export function computeSpecDelta(
  specRelPath,
  fromRef,
  toRef = 'HEAD',
  repoRoot
) {
  repoRoot = repoRoot || resolve(new URL('../../..', import.meta.url).pathname);

  let oldContent = '';
  let newContent = '';

  try {
    oldContent = execSync(
      `git -C "${repoRoot}" show "${fromRef}:${specRelPath}"`,
      {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }
    );
  } catch {
    // File didn't exist at fromRef — all operations are 'added'
  }

  try {
    if (toRef === 'HEAD') {
      newContent = execSync(`cat "${join(repoRoot, specRelPath)}"`, {
        encoding: 'utf-8',
      });
    } else {
      newContent = execSync(
        `git -C "${repoRoot}" show "${toRef}:${specRelPath}"`,
        {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }
      );
    }
  } catch {
    // File doesn't exist at toRef — all operations are 'removed'
  }

  const oldOpIds = extractOperationIds(oldContent);
  const newOpIds = extractOperationIds(newContent);

  const added = [...newOpIds].filter((id) => !oldOpIds.has(id));
  const removed = [...oldOpIds].filter((id) => !newOpIds.has(id));

  // Modified: in both but spec content changed (simplified: check if summary/description differs)
  const modified = [];
  if (oldContent && newContent) {
    const oldSpec = safeParseYaml(oldContent);
    const newSpec = safeParseYaml(newContent);
    for (const opId of newOpIds) {
      if (oldOpIds.has(opId)) {
        const oldOp = findOperationInSpec(oldSpec, opId);
        const newOp = findOperationInSpec(newSpec, opId);
        if (oldOp && newOp && hasOperationChanged(oldOp, newOp)) {
          modified.push(opId);
        }
      }
    }
  }

  return { added, modified, removed };
}

function extractOperationIds(specContent) {
  const ids = new Set();
  if (!specContent) return ids;
  const matches = specContent.matchAll(/^\s+operationId:\s+(\S+)/gm);
  for (const m of matches) ids.add(m[1]);
  return ids;
}

function safeParseYaml(content) {
  try {
    return yaml.load(content) || {};
  } catch {
    return {};
  }
}

function findOperationInSpec(spec, operationId) {
  for (const pathItem of Object.values(spec.paths || {})) {
    for (const op of Object.values(pathItem)) {
      if (op && op.operationId === operationId) return op;
    }
  }
  return null;
}

function hasOperationChanged(oldOp, newOp) {
  // Consider changed if summary, description, or parameter count changed
  if (oldOp.summary !== newOp.summary) return true;
  if (oldOp.description !== newOp.description) return true;
  const oldParamCount = (oldOp.parameters || []).length;
  const newParamCount = (newOp.parameters || []).length;
  if (oldParamCount !== newParamCount) return true;
  return false;
}

// ─── Suggested doc paths ──────────────────────────────────────────────────────

/**
 * Derive suggested documentation paths for an uncovered operation by looking
 * at what adjacent operations (same path prefix) are already documented.
 *
 * @param {string}   operationId
 * @param {object}   opInfo          - { path, method, tags }
 * @param {Map}      confirmedMap     - From doc-location-map result
 * @param {Map}      operationIdToPath
 * @returns {string[]}
 */
function suggestDocPaths(operationId, opInfo, confirmedMap, operationIdToPath) {
  const suggestions = new Set();
  const pathPrefix = opInfo.path.split('/').slice(0, 4).join('/'); // e.g. /api/v3/configure

  for (const [coveredOpId, entries] of confirmedMap) {
    const coveredOp = operationIdToPath.get(coveredOpId);
    if (coveredOp && coveredOp.path.startsWith(pathPrefix)) {
      for (const entry of entries) {
        // Convert content path to URL-style suggestion
        const url =
          '/' +
          entry.docPath
            .replace(/\/_index\.md$/, '/')
            .replace(/\.md$/, '/')
            .replace(/\/index\.md$/, '/');
        suggestions.add(url);
      }
    }
  }

  return [...suggestions].slice(0, 3);
}

// ─── Gap assembly ─────────────────────────────────────────────────────────────

/**
 * Build the flat list of gap entries from a doc-location-map result and spec
 * delta information.
 *
 * @param {object} params
 * @param {object} params.mapResult          - Return value of runDocLocationMap()
 * @param {object} [params.specDelta]        - { added, modified, removed } per edition
 * @returns {object[]}  Gap entries
 */
function buildGapEntries({ mapResult, specDelta }) {
  const gaps = [];

  for (const [edition, data] of Object.entries(mapResult.editions)) {
    const {
      uncovered,
      orphaned,
      confirmedMap,
      operationIdToPath,
      specVersion,
    } = data;
    const editionDelta = specDelta?.[edition] || {
      added: [],
      modified: [],
      removed: [],
    };

    // Uncovered operations
    for (const opId of uncovered) {
      const opInfo = operationIdToPath.get(opId);
      if (!opInfo) continue;

      let changeType = 'existing';
      if (editionDelta.added.includes(opId)) changeType = 'new';
      else if (editionDelta.modified.includes(opId)) changeType = 'modified';

      // Determine edition scope
      let editionScope = edition;
      if (mapResult.editions.core && mapResult.editions.enterprise) {
        const inCore = mapResult.editions.core.operationIdToPath.has(opId);
        const inEnterprise =
          mapResult.editions.enterprise.operationIdToPath.has(opId);
        editionScope =
          inCore && inEnterprise ? 'both' : inCore ? 'core' : 'enterprise';
      }

      const { severity, rationale } = scoreSeverity(
        opInfo,
        editionScope,
        changeType
      );
      const suggestedDocPaths = suggestDocPaths(
        opId,
        opInfo,
        confirmedMap,
        operationIdToPath
      );
      const category = deriveCategoryLabel(opInfo.path, opInfo.tags);

      gaps.push({
        operationId: opId,
        method: opInfo.method,
        path: opInfo.path,
        summary: opInfo.summary || '',
        tags: opInfo.tags || [],
        category,
        edition,
        editionScope,
        specVersion,
        changeType,
        severity,
        severityRationale: rationale,
        existingDocPages: [],
        suggestedDocPaths,
      });
    }

    // Partially covered (in confirmedMap but also delta-modified — may need updates)
    for (const opId of editionDelta.modified) {
      if (confirmedMap.has(opId)) {
        const opInfo = operationIdToPath.get(opId);
        if (!opInfo) continue;

        const editionScope = edition;
        const { severity, rationale } = scoreSeverity(
          opInfo,
          editionScope,
          'modified'
        );
        const category = deriveCategoryLabel(opInfo.path, opInfo.tags);
        const existingPages =
          confirmedMap.get(opId)?.map((e) => e.docPath) || [];

        gaps.push({
          operationId: opId,
          method: opInfo.method,
          path: opInfo.path,
          summary: opInfo.summary || '',
          tags: opInfo.tags || [],
          category,
          edition,
          editionScope,
          specVersion,
          changeType: 'modified',
          severity,
          severityRationale: rationale,
          existingDocPages: existingPages,
          suggestedDocPaths: existingPages.map(
            (p) => '/' + p.replace(/\/_index\.md$/, '/').replace(/\.md$/, '/')
          ),
          note: 'Existing docs may need updates for this changed endpoint.',
        });
      }
    }

    // Orphaned references
    for (const ref of orphaned) {
      gaps.push({
        operationId: ref.operationId,
        method: '',
        path: '',
        summary: '',
        tags: [],
        category: 'Removed endpoint',
        edition,
        editionScope: edition,
        specVersion,
        changeType: 'removed',
        severity: 'medium',
        severityRationale:
          'Doc page references a removed endpoint; page needs update or removal',
        existingDocPages: [ref.docPath],
        suggestedDocPaths: [],
      });
    }
  }

  // Deduplicate by operationId (can appear in both editions)
  const seen = new Map();
  const deduped = [];
  for (const gap of gaps) {
    const key = `${gap.operationId}:${gap.changeType}`;
    if (seen.has(key)) {
      // Merge edition scopes
      const existing = seen.get(key);
      if (existing.editionScope !== gap.editionScope) {
        existing.editionScope = 'both';
        // Re-score with wider scope
        const opInfo = {
          path: existing.path,
          method: existing.method,
          tags: existing.tags,
        };
        const { severity, rationale } = scoreSeverity(
          opInfo,
          'both',
          existing.changeType
        );
        existing.severity = severity;
        existing.severityRationale = rationale;
      }
    } else {
      seen.set(key, gap);
      deduped.push(gap);
    }
  }

  return sortBySeverity(deduped);
}

// ─── Report generation ────────────────────────────────────────────────────────

/**
 * Generate a severity-scored gap report.
 *
 * @param {object} params
 * @param {'core'|'enterprise'|'both'} params.product
 * @param {string} params.version          - Release version (e.g. "v3.9.0")
 * @param {string} [params.previousVersion] - Previous version tag (e.g. "v3.8.0")
 * @param {object} params.mapResult        - From runDocLocationMap()
 * @param {string} params.outputDir        - Directory for output files
 * @param {string} [params.repoRoot]       - docs-v2 repo root
 * @returns {Promise<object>} The gap report object
 */
export async function generateGapReport({
  product,
  version,
  previousVersion,
  mapResult,
  outputDir,
  repoRoot,
}) {
  repoRoot = repoRoot || resolve(new URL('../../..', import.meta.url).pathname);
  await fs.mkdir(outputDir, { recursive: true });

  console.log(`\n📊 Generating gap report for ${product} ${version}...`);

  // Compute spec delta per edition
  let specDelta = null;
  if (previousVersion) {
    specDelta = {};
    const specFiles = {
      core: 'api-docs/influxdb3/core/v3/influxdb3-core-openapi.yaml',
      enterprise:
        'api-docs/influxdb3/enterprise/v3/influxdb3-enterprise-openapi.yaml',
    };

    for (const edition of Object.keys(mapResult.editions)) {
      if (specFiles[edition]) {
        console.log(
          `   Computing spec delta ${previousVersion}→${version} for ${edition}...`
        );
        try {
          specDelta[edition] = computeSpecDelta(
            specFiles[edition],
            previousVersion,
            version === 'HEAD' || !version ? 'HEAD' : version,
            repoRoot
          );
          const d = specDelta[edition];
          console.log(
            `   Delta: +${d.added.length} added, ~${d.modified.length} modified, -${d.removed.length} removed`
          );
        } catch (err) {
          console.warn(
            `   ⚠️  Could not compute spec delta for ${edition}: ${err.message}`
          );
          specDelta[edition] = { added: [], modified: [], removed: [] };
        }
      }
    }
  }

  const gaps = buildGapEntries({ mapResult, specDelta });

  const summary = {
    critical: gaps.filter((g) => g.severity === 'critical').length,
    high: gaps.filter((g) => g.severity === 'high').length,
    medium: gaps.filter((g) => g.severity === 'medium').length,
    low: gaps.filter((g) => g.severity === 'low').length,
    total: gaps.length,
  };

  const report = {
    product,
    version: version || 'HEAD',
    previousVersion: previousVersion || null,
    generatedAt: new Date().toISOString(),
    summary,
    gaps,
  };

  // Write JSON
  const jsonFilename = `gap-report-${product}-${version || 'HEAD'}.json`;
  const jsonPath = join(outputDir, jsonFilename);
  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`   Gap report JSON: ${jsonPath}`);

  // Write markdown summary
  const mdPath = join(outputDir, jsonFilename.replace('.json', '.md'));
  await writeMdSummary(report, mdPath);
  console.log(`   Gap report markdown: ${mdPath}`);

  return report;
}

async function writeMdSummary(report, outputPath) {
  const lines = [];
  const titleEdition =
    report.product.charAt(0).toUpperCase() + report.product.slice(1);

  lines.push(`# Documentation Gap Report — InfluxDB 3 ${titleEdition}`);
  lines.push('');
  lines.push(`**Version:** ${report.version}`);
  if (report.previousVersion) {
    lines.push(`**Delta from:** ${report.previousVersion}`);
  }
  lines.push(`**Generated:** ${report.generatedAt.split('T')[0]}`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push('| Severity | Count |');
  lines.push('|----------|-------|');
  lines.push(`| 🔴 Critical | ${report.summary.critical} |`);
  lines.push(`| 🟠 High | ${report.summary.high} |`);
  lines.push(`| 🟡 Medium | ${report.summary.medium} |`);
  lines.push(`| 🔵 Low | ${report.summary.low} |`);
  lines.push(`| **Total** | **${report.summary.total}** |`);
  lines.push('');

  if (report.gaps.length === 0) {
    lines.push('No documentation gaps detected.');
    await fs.writeFile(outputPath, lines.join('\n'), 'utf-8');
    return;
  }

  // Group by severity
  for (const sev of ['critical', 'high', 'medium', 'low']) {
    const sevGaps = report.gaps.filter((g) => g.severity === sev);
    if (sevGaps.length === 0) continue;

    const emoji = { critical: '🔴', high: '🟠', medium: '🟡', low: '🔵' }[sev];
    lines.push(
      `## ${emoji} ${sev.charAt(0).toUpperCase() + sev.slice(1)} Priority (${sevGaps.length})`
    );
    lines.push('');

    for (const gap of sevGaps) {
      lines.push(`### ${gap.operationId}`);
      lines.push('');
      lines.push(`- **Method/Path:** \`${gap.method} ${gap.path}\``);
      lines.push(`- **Category:** ${gap.category}`);
      lines.push(`- **Edition scope:** ${gap.editionScope}`);
      lines.push(`- **Change type:** ${gap.changeType}`);
      lines.push(`- **Rationale:** ${gap.severityRationale}`);
      if (gap.summary) lines.push(`- **Summary:** ${gap.summary}`);
      if (gap.existingDocPages.length > 0) {
        lines.push(
          `- **Existing docs:** ${gap.existingDocPages.map((p) => `\`${p}\``).join(', ')}`
        );
      }
      if (gap.suggestedDocPaths.length > 0) {
        lines.push(
          `- **Suggested location:** ${gap.suggestedDocPaths.join(', ')}`
        );
      }
      if (gap.note) lines.push(`- **Note:** ${gap.note}`);
      lines.push('');
    }
  }

  await fs.writeFile(outputPath, lines.join('\n'), 'utf-8');
}
