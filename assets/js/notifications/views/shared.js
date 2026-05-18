/*
  DOM helpers shared by the drawer/banner/blocking views. Markdown bodies are
  always sanitized; summaries are plain text (textContent only).
*/

import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function renderBody(markdown) {
  if (!markdown) return '';
  const html = marked.parse(markdown, { breaks: true, gfm: true });
  return DOMPurify.sanitize(html);
}

const SEVERITY_CLASS = {
  info: 'notif-info',
  warning: 'notif-warning',
  critical: 'notif-critical',
};

export function severityClass(severity) {
  return SEVERITY_CLASS[severity] || 'notif-info';
}

export function buildCTAs(post, onClick) {
  const ctas = post.ctas || [];
  if (!ctas.length) return null;
  const wrap = document.createElement('div');
  wrap.className = 'notif-ctas';
  ctas.forEach((cta, i) => {
    const isButton = cta.style === 'button';
    const el = document.createElement('a');
    el.className = isButton ? 'notif-cta btn' : 'notif-cta';
    el.href = cta.url;
    el.target = '_blank';
    el.rel = 'noopener';
    el.textContent = cta.label;
    el.addEventListener('click', () => onClick(post, i));
    wrap.appendChild(el);
  });
  return wrap;
}

/*
  Build a notification card. `opts.onExpand` fires when the user expands the
  summary; `opts.onCTA(post, index)` fires on CTA activation.
*/
export function buildCard(post, opts = {}) {
  const card = document.createElement('div');
  card.className = `notif-card ${severityClass(post.severity)}`;
  card.id = `notif-${post.id}`;

  const title = document.createElement('div');
  title.className = 'notif-title';
  title.textContent = post.title;
  card.appendChild(title);

  const body = document.createElement('div');
  body.className = 'notif-body';
  body.innerHTML = renderBody(post.body);
  const ctas = buildCTAs(post, opts.onCTA || (() => {}));
  if (ctas) body.appendChild(ctas);

  if (post.summary) {
    const summary = document.createElement('div');
    summary.className = 'notif-summary';
    summary.textContent = post.summary;
    card.appendChild(summary);

    const toggle = document.createElement('button');
    toggle.className = 'notif-expand';
    toggle.type = 'button';
    toggle.textContent = 'Read more';
    body.hidden = true;
    toggle.addEventListener('click', () => {
      body.hidden = !body.hidden;
      toggle.textContent = body.hidden ? 'Read more' : 'Show less';
      if (!body.hidden && opts.onExpand) opts.onExpand();
    });
    card.appendChild(toggle);
  }

  card.appendChild(body);
  return card;
}
