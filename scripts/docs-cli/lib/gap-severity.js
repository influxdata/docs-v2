/**
 * Gap Severity Scorer
 *
 * Assigns a severity tier to each undocumented API operation based on:
 *   1. API category (derived from path prefix and tags)
 *   2. Edition scope (both editions = wider user impact)
 *   3. Change type (new endpoint, modified, removed)
 *
 * Severity tiers: critical | high | medium | low
 *
 * @module gap-severity
 */

// ─── Category tier lookup ─────────────────────────────────────────────────────

/**
 * Path prefix → base severity tier.
 * More specific prefixes must come before more general ones.
 */
const PATH_TIER = [
  // Write paths — core user workflow
  { prefix: '/write', tier: 'high' },
  { prefix: '/api/v2/write', tier: 'high' },
  { prefix: '/api/v3/write_lp', tier: 'high' },

  // Query paths — core user workflow
  { prefix: '/query', tier: 'high' },
  { prefix: '/api/v2/query', tier: 'high' },
  { prefix: '/api/v3/query_sql', tier: 'high' },
  { prefix: '/api/v3/query_influxql', tier: 'high' },

  // Database / table management — primary admin workflow
  { prefix: '/api/v3/configure/database', tier: 'high' },
  { prefix: '/api/v3/configure/table', tier: 'high' },

  // Token management
  { prefix: '/api/v3/configure/token', tier: 'medium' },
  { prefix: '/api/v3/configure/token', tier: 'medium' },

  // Caching
  { prefix: '/api/v3/configure/distinct_cache', tier: 'medium' },
  { prefix: '/api/v3/configure/last_cache', tier: 'medium' },

  // Processing engine / triggers
  { prefix: '/api/v3/configure/processing_engine_trigger', tier: 'medium' },
  { prefix: '/api/v3/engine', tier: 'medium' },

  // Export (Enterprise-specific)
  { prefix: '/api/v3/export', tier: 'medium' },
  { prefix: '/api/v3/enterprise', tier: 'medium' },

  // Plugin management
  { prefix: '/api/v3/configure/plugin_environment', tier: 'low' },
  { prefix: '/api/v3/plugins', tier: 'low' },
  { prefix: '/api/v3/configure/plugin', tier: 'low' },

  // Health / metrics / ping — self-explanatory; capped at low regardless of bumps
  { prefix: '/health', tier: 'low', cap: 'low' },
  { prefix: '/ping', tier: 'low', cap: 'low' },
  { prefix: '/metrics', tier: 'low', cap: 'low' },

  // Plugin test endpoints — internal / developer tooling
  {
    prefix: '/api/v3/configure/processing_engine_trigger/test',
    tier: 'low',
    cap: 'low',
  },
];

/**
 * Tag → base severity tier override (used when path prefix doesn't match).
 */
const TAG_TIER = {
  'Write data': 'high',
  'Query data': 'high',
  'Manage databases': 'high',
  'Manage tables': 'high',
  Authenticate: 'medium',
  'Manage tokens': 'medium',
  'Cache data': 'medium',
  'Processing engine': 'medium',
  'Export data': 'medium',
  System: 'low',
};

// Tier ordering for cap enforcement
const TIER_ORDER = { critical: 3, high: 2, medium: 1, low: 0 };
const TIER_FROM_ORDER = ['low', 'medium', 'high', 'critical'];

function capTier(tier, cap) {
  if (!cap) return tier;
  const capIdx = TIER_ORDER[cap] ?? 0;
  const tierIdx = TIER_ORDER[tier] ?? 0;
  return TIER_FROM_ORDER[Math.min(tierIdx, capIdx)];
}

/**
 * Derive base severity tier from operation path and tags.
 * Returns { tier, cap? } where cap is the maximum allowed severity.
 * @param {string} path   - API path, e.g. "/api/v3/configure/database"
 * @param {string[]} tags - Operation tags from the spec
 * @returns {{ tier: 'high'|'medium'|'low', cap?: string }}
 */
function baseTierFromPathAndTags(path, tags = []) {
  // Check path prefixes (most specific first)
  for (const entry of PATH_TIER) {
    if (path.startsWith(entry.prefix))
      return { tier: entry.tier, cap: entry.cap };
  }

  // Fall back to tag-based lookup
  for (const tag of tags) {
    if (TAG_TIER[tag]) return { tier: TAG_TIER[tag] };
  }

  return { tier: 'low' }; // default
}

// ─── Score computation ────────────────────────────────────────────────────────

/**
 * Score the severity of a documentation gap.
 *
 * @param {object} operation   - Operation descriptor from the spec inventory
 *   @param {string} operation.path
 *   @param {string} operation.method
 *   @param {string[]} operation.tags
 * @param {'core'|'enterprise'|'both'} editionScope
 * @param {'new'|'modified'|'removed'|'existing'} changeType
 *   - 'new'      gap for a newly added endpoint
 *   - 'modified' gap for a changed endpoint
 *   - 'removed'  doc references a removed endpoint (orphan)
 *   - 'existing' gap for an endpoint that has been in the spec unchanged
 * @returns {{ severity: 'critical'|'high'|'medium'|'low', rationale: string }}
 */
export function scoreSeverity(operation, editionScope, changeType) {
  const { path, method, tags = [] } = operation;
  const { tier: baseTier, cap } = baseTierFromPathAndTags(path, tags);
  let tier = baseTier;

  const reasons = [];

  // Change type adjustments
  if (changeType === 'new') {
    // New endpoints always warrant documentation
    reasons.push('new endpoint in release');
    if (tier === 'low') tier = 'medium'; // bump low → medium for new endpoints
  } else if (changeType === 'modified') {
    reasons.push('endpoint changed in release');
  } else if (changeType === 'removed') {
    reasons.push('endpoint removed — doc page needs update or removal');
  } else {
    reasons.push('existing undocumented endpoint');
  }

  // Edition scope
  if (editionScope === 'both') {
    reasons.push('affects both Core and Enterprise users');
    if (tier === 'medium') tier = 'high'; // bump medium → high for cross-edition
    if (tier === 'low') tier = 'medium'; // bump low → medium for cross-edition
  } else if (editionScope === 'enterprise') {
    reasons.push('Enterprise only');
  } else {
    reasons.push('Core only');
  }

  // Promote 'high' to 'critical' for new write/query endpoints affecting both editions
  if (
    tier === 'high' &&
    changeType === 'new' &&
    editionScope === 'both' &&
    (path.includes('/write') || path.includes('/query'))
  ) {
    tier = 'critical';
    reasons.push('write/query path affecting both editions');
  }

  // Apply path-level cap (e.g. health/ping always stay ≤ low)
  tier = capTier(tier, cap);

  const categoryLabel = deriveCategoryLabel(path, tags);
  reasons.unshift(categoryLabel);

  return {
    severity: tier,
    rationale: reasons.join('; '),
  };
}

/**
 * Derive a human-readable category label for an operation.
 */
export function deriveCategoryLabel(path, tags = []) {
  if (
    path.startsWith('/write') ||
    path.startsWith('/api/v2/write') ||
    path.startsWith('/api/v3/write')
  ) {
    return 'Write data';
  }
  if (
    path.startsWith('/query') ||
    path.startsWith('/api/v2/query') ||
    path.startsWith('/api/v3/query')
  ) {
    return 'Query data';
  }
  if (path.startsWith('/api/v3/configure/database'))
    return 'Database management';
  if (path.startsWith('/api/v3/configure/table')) return 'Table management';
  if (
    path.startsWith('/api/v3/configure/token') ||
    path.startsWith('/api/v3/configure/token')
  )
    return 'Token management';
  if (path.startsWith('/api/v3/configure/distinct_cache'))
    return 'Distinct Value Cache';
  if (path.startsWith('/api/v3/configure/last_cache'))
    return 'Last Value Cache';
  if (path.startsWith('/api/v3/configure/processing_engine_trigger'))
    return 'Processing engine triggers';
  if (path.startsWith('/api/v3/engine')) return 'Processing engine';
  if (path.startsWith('/api/v3/export')) return 'Export data';
  if (path.startsWith('/api/v3/enterprise')) return 'Enterprise administration';
  if (path.startsWith('/api/v3/plugins')) return 'Plugin management';
  if (
    path.startsWith('/health') ||
    path.startsWith('/ping') ||
    path.startsWith('/metrics')
  )
    return 'System';

  // Fall back to first tag
  if (tags.length > 0) return tags[0];
  return 'API';
}

/**
 * Sort gap entries by severity (critical first).
 * @param {Array} gaps - Array of objects with a .severity field
 * @returns {Array}
 */
export function sortBySeverity(gaps) {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...gaps].sort(
    (a, b) => (order[a.severity] ?? 4) - (order[b.severity] ?? 4)
  );
}
