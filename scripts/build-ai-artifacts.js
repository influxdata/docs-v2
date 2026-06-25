#!/usr/bin/env node
/**
 * Build root AI discovery artifacts after Hugo.
 */

import { buildMarkdownSitemap, parsePublicDir } from './build-md-sitemap.js';
import { buildLlmsTxt } from './build-llms-txt.js';

async function main() {
  const publicRoot = parsePublicDir();
  const sitemap = await buildMarkdownSitemap(publicRoot);
  console.log(`Built sitemap-md.xml with ${sitemap.count} Markdown URLs`);

  const llms = await buildLlmsTxt(publicRoot);
  console.log(`Built llms.txt (${llms.bytes} bytes)`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
