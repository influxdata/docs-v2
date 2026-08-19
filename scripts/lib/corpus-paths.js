/**
 * Derive per-product corpus paths from data/products.yml.
 *
 * Each corpus is one product (or product+version) entry yielding the
 * filesystem path under `public/` where that product's llms-full.txt lives.
 *
 * The mapping reads `content_path` (handling both string and per-version
 * object forms) and combines it with `versions` to produce a versioned path:
 *
 *   - content_path is an object: per-version paths (e.g., influxdb).
 *   - content_path is a string AND contains the version segment already
 *     (e.g., 'influxdb3/core' for versions: [core]): use as-is.
 *   - content_path is a string AND does not contain the version (e.g.,
 *     'telegraf' for versions: [v1]): append /<version>.
 *   - content_path is a string AND versions is empty (e.g., explorer):
 *     use the content_path as-is.
 *
 * Products without content_path (telegraf_controller, influxdb_cloud1)
 * are excluded.
 *
 * See PLAN.md for context on why a derivation utility (single source of
 * truth from products.yml) is preferable to hardcoded lists in this script
 * and in layouts/index.llmstxt.txt. The same logic is mirrored in the Hugo
 * template; check-md-alternate-coherence.js verifies the two surfaces
 * stay aligned.
 *
 * @param {Record<string, object>} products - Parsed products.yml object.
 * @returns {Array<{ key: string, name: string, path: string, version: string | null }>}
 */
export function getCorpusPaths(products) {
  const result = [];
  for (const [key, p] of Object.entries(products)) {
    if (!p || !p.content_path) continue;
    const cp = p.content_path;
    const versions = Array.isArray(p.versions) ? p.versions : [];

    if (typeof cp === 'object') {
      for (const [v, versionedPath] of Object.entries(cp)) {
        const name = p[`name__${v}`] || p.name;
        result.push({ key, name, path: versionedPath, version: v });
      }
      continue;
    }

    if (typeof cp !== 'string') continue;

    if (versions.length === 0) {
      result.push({ key, name: p.name, path: cp, version: null });
      continue;
    }

    for (const v of versions) {
      const pathHasVersion = cp.endsWith(`/${v}`);
      const path = pathHasVersion ? cp : `${cp}/${v}`;
      const name = p[`name__${v}`] || p.name;
      result.push({ key, name, path, version: v });
    }
  }
  return result;
}
