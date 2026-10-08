import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
await p.goto(process.argv[2], { waitUntil: 'networkidle' });
await p.waitForSelector('.mermaid[data-processed="true"]');
await p.waitForTimeout(600);
console.log(await p.evaluate(() => {
  const s = document.querySelector('.mermaid svg');
  return JSON.stringify({
    viewBox: s.getAttribute('viewBox'),
    widthAttr: s.getAttribute('width'),
    heightAttr: s.getAttribute('height'),
    preserveAR: s.getAttribute('preserveAspectRatio'),
    foreignObjects: s.querySelectorAll('foreignObject').length,
  });
}));
await b.close();
