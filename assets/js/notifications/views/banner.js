/*
  Banner view. Renders posts whose EFFECTIVE presentation (after
  display_override for the current path) is "banner". Max 3 visible,
  severity-sorted by bucketBySurface.
*/

import { bucketBySurface } from '../effective-presentation.js';
import { buildCTAs, severityClass } from './shared.js';

const MAX_VISIBLE = 3;

export function initBanner(manager, ctx) {
  const region = document.getElementById('notif-banners');
  if (!region) return;

  function render() {
    region.textContent = '';
    const { banner } = bucketBySurface(
      manager.getItems(),
      ctx.pathname,
      ctx.productMap
    );
    banner.slice(0, MAX_VISIBLE).forEach((item) => {
      const post = item.post;
      const el = document.createElement('div');
      el.className = `notif-banner ${severityClass(post.severity)}`;
      el.id = `notif-banner-${post.id}`;

      const text = document.createElement('div');
      text.className = 'notif-banner-text';
      const strong = document.createElement('strong');
      strong.textContent = post.title;
      text.appendChild(strong);
      if (post.summary) {
        const span = document.createElement('span');
        span.className = 'notif-banner-summary';
        span.textContent = post.summary;
        text.appendChild(span);
      }
      el.appendChild(text);

      const ctas = buildCTAs(post, (p, i) =>
        manager.handleCTAClick(p, i, 'banner')
      );
      if (ctas) el.appendChild(ctas);

      const close = document.createElement('button');
      close.className = 'notif-banner-close';
      close.type = 'button';
      close.setAttribute('aria-label', 'Dismiss');
      close.innerHTML = '<span class="cf-icon Remove_New"></span>';
      close.addEventListener('click', () => manager.dismissBanner(item.id));
      el.appendChild(close);

      region.appendChild(el);
      manager.recordImpressionOnce(item.id);
    });
  }

  manager.addEventListener('change', render);
  render();
}
