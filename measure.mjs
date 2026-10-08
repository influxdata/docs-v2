import { chromium } from 'playwright';
const url = process.argv[2], out = process.argv[3];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForSelector('.mermaid[data-processed="true"]', { timeout: 20000 });
await p.waitForTimeout(800);
const m = await p.evaluate(() => {
  const px = el => el ? getComputedStyle(el).fontSize : null;
  const c = document.querySelector('.mermaid');
  const svg = c.querySelector('svg');
  const r = svg.getBoundingClientRect();
  const edge = [...c.querySelectorAll('.edgeLabel')].filter(e=>e.textContent.trim());
  const node = [...c.querySelectorAll('.nodeLabel')];
  return {
    containerWidth: Math.round(c.getBoundingClientRect().width),
    svgWidth: Math.round(r.width), svgHeight: Math.round(r.height),
    svgMaxWidth: svg.style.maxWidth || getComputedStyle(svg).maxWidth,
    edgeSizes: [...new Set(edge.map(px))],
    nodeSizes: [...new Set(node.map(px))],
  };
});
console.log(JSON.stringify(m));
await (await p.$('.mermaid')).screenshot({ path: out });
await b.close();
