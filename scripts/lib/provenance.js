/**
 * Provenance helpers for LLM-native artifacts (issue #7290).
 *
 * Single source of truth for InfluxData org identity is data/influxdata.yml
 * (also consumed by the Organization JSON-LD partial). These helpers let the
 * Markdown/llms build scripts stamp publisher + canonical provenance without
 * duplicating the identity list.
 */
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

export const FALLBACK_ORIGIN = 'https://docs.influxdata.com';

/**
 * Load InfluxData org identity from data/influxdata.yml.
 * @param {string} dataPath
 * @returns {Promise<{name: string, url: string, sameAs: string[]}>}
 */
export async function loadOrgIdentity(dataPath = 'data/influxdata.yml') {
  const raw = await fs.readFile(dataPath, 'utf-8');
  const data = yaml.load(raw);
  const org = data && data.organization;
  if (!org || !org.name) {
    throw new Error(`Missing organization.name in ${dataPath}`);
  }
  return {
    name: org.name,
    url: org.url || '',
    sameAs: Array.isArray(org.sameAs) ? org.sameAs : [],
  };
}

/**
 * Read the production site origin from public/sitemap-md.xml.
 * Mirrors loadEligibleUrls() in build-llms-full-txt.js so staging builds
 * produce staging URLs and prod builds produce prod URLs.
 * @param {string} publicDir
 * @returns {Promise<string>} origin like "https://docs.influxdata.com"
 */
export async function readSitemapOrigin(publicDir = 'public') {
  const sitemapPath = path.join(publicDir, 'sitemap-md.xml');
  try {
    const xml = await fs.readFile(sitemapPath, 'utf-8');
    const match = xml.match(/<loc>([^<]+)<\/loc>/);
    if (match) return new URL(match[1]).origin;
  } catch {
    /* fall through to fallback */
  }
  return FALLBACK_ORIGIN;
}

/**
 * Build a urlPath -> lastmod map from sitemap-md.xml. Keys are site-relative
 * paths (e.g. "/influxdb3/core/"), matching the build script's urlPath.
 * @param {string} publicDir
 * @returns {Promise<Map<string,string>>}
 */
export async function readSitemapLastmods(publicDir = 'public') {
  const map = new Map();
  try {
    const xml = await fs.readFile(
      path.join(publicDir, 'sitemap-md.xml'),
      'utf-8'
    );
    const re = /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
    let m;
    while ((m = re.exec(xml)) !== null) {
      const urlPath = new URL(m[1]).pathname.replace(/index\.md$/, '');
      map.set(urlPath, m[2]);
    }
  } catch {
    /* no sitemap -> empty map -> timestamps omitted */
  }
  return map;
}

/**
 * Inject publisher + canonical (and optionally date/lastmod) into an
 * already-serialized twin Markdown string. Converter-agnostic: works whether
 * the Rust or JS converter produced the frontmatter. Returns the input
 * unchanged if it has no frontmatter. Timestamps are omitted when `lastmod`
 * is falsy (e.g. the page is absent from the sitemap).
 * @param {string} markdown
 * @param {{publisher: string, canonical: string, lastmod?: string}} provenance
 * @returns {string}
 */
export function injectPageProvenance(
  markdown,
  { publisher, canonical, lastmod }
) {
  const match = markdown.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n+([\s\S]+)$/);
  if (!match) return markdown;
  let fm;
  try {
    fm = yaml.load(match[1]);
  } catch {
    return markdown;
  }
  if (!fm || typeof fm !== 'object') return markdown;
  fm.publisher = publisher;
  fm.canonical = canonical;
  if (lastmod) {
    fm.date = lastmod;
    fm.lastmod = lastmod;
  }
  const body = match[2];
  const serialized = yaml.dump(fm, { lineWidth: -1, noRefs: true }).trim();
  return `---\n${serialized}\n---\n\n${body}`;
}
