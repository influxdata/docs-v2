/*
  Pure DOM builders for the Subscriber UX Standard card layouts. No state.
  - renderMarkdown: marked -> DOMPurify (used for BOTH body and summary;
    per the 1.0.2 contract summary is markdown).
  - renderCTA: safe external link (safeHref + noopener noreferrer).
  - renderDrawerCard / renderTopBarCard: the two standard layouts.
  - onAnimationDone: run a callback once when a CSS animation ends OR after a
    fallback timeout (so leave/dismiss still progresses under
    prefers-reduced-motion, where animation duration is ~0).
*/

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { formatRelative } from '../format-relative.js';

const ANIM_FALLBACK_MS = 400;

export function renderMarkdown(md) {
  if (!md) return '';
  const dirty = marked.parse(String(md), { breaks: true, gfm: true });
  return DOMPurify.sanitize(dirty);
}

function safeHref(url) {
  if (typeof url !== 'string') return '#';
  if (/^(https?:|mailto:)/i.test(url) || /^[/#]/.test(url)) return url;
  return '#';
}

export function onAnimationDone(el, cb) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    cb();
  };
  el.addEventListener('animationend', finish, { once: true });
  setTimeout(finish, ANIM_FALLBACK_MS);
}

export function renderCTA(cta) {
  const a = document.createElement('a');
  a.className = 'notif-cta';
  a.dataset.style = cta.style ?? 'link';
  a.href = safeHref(cta.url);
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = cta.label;
  return a;
}

function appendCTAs(parent, post, surface, manager, className) {
  if (!post.ctas || post.ctas.length === 0) return;
  const wrap = document.createElement('footer');
  wrap.className = className;
  post.ctas.forEach((cta, idx) => {
    const a = renderCTA(cta);
    a.addEventListener('click', () =>
      manager.handleCTAClick(post, idx, surface)
    );
    wrap.appendChild(a);
  });
  parent.appendChild(wrap);
}

export function renderDrawerCard(item, manager) {
  const post = item.post;
  const card = document.createElement('article');
  card.className = 'notif-card-drawer';
  card.dataset.severity = post.severity;
  card.dataset.unread = item.read ? 'false' : 'true';
  card.dataset.surface = 'drawer';
  card.dataset.postId = item.id;

  const stripe = document.createElement('span');
  stripe.className = 'notif-card-drawer__stripe';
  stripe.setAttribute('aria-hidden', 'true');
  card.appendChild(stripe);

  const text = document.createElement('div');
  text.className = 'notif-card-drawer__text';

  const header = document.createElement('div');
  header.className = 'notif-card-drawer__header';

  const title = document.createElement('h3');
  title.className = 'notif-card-drawer__title';
  title.textContent = post.title;
  header.appendChild(title);

  const dismiss = document.createElement('button');
  dismiss.className = 'notif-card-drawer__dismiss';
  dismiss.type = 'button';
  dismiss.setAttribute('aria-label', 'Dismiss');
  dismiss.textContent = '×';
  dismiss.addEventListener('click', (e) => {
    e.stopPropagation();
    if (card.dataset.state === 'leaving') return;
    card.dataset.state = 'leaving';
    onAnimationDone(card, () => manager.dismissFromDrawer(item.id));
  });
  header.appendChild(dismiss);
  text.appendChild(header);

  // Summary is markdown (1.0.2 contract); fall back to body markdown.
  if (post.summary && post.summary.trim() !== '') {
    const summary = document.createElement('div');
    summary.className =
      'notif-card-drawer__summary notif-card-drawer__summary--md';
    summary.innerHTML = renderMarkdown(post.summary);
    text.appendChild(summary);
  } else if (post.body) {
    const fallback = document.createElement('div');
    fallback.className =
      'notif-card-drawer__summary notif-card-drawer__summary--md';
    fallback.innerHTML = renderMarkdown(post.body);
    text.appendChild(fallback);
  }

  appendCTAs(text, post, 'drawer', manager, 'notif-card-drawer__ctas');

  const meta = document.createElement('div');
  meta.className = 'notif-card-drawer__meta';

  const dot = document.createElement('button');
  dot.className = 'notif-card-drawer__dot';
  dot.type = 'button';
  dot.setAttribute('aria-label', 'Mark as read');
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    manager.markRead(item.id);
  });
  meta.appendChild(dot);

  const ts = post.publishedAt ?? post.createdAt;
  meta.appendChild(
    document.createTextNode(`${formatRelative(ts)} · ${post.category}`)
  );
  text.appendChild(meta);

  card.appendChild(text);
  return card;
}

export function renderTopBarCard(item, surface, manager) {
  const post = item.post;
  const card = document.createElement('article');
  card.className = 'notif-card';
  card.dataset.severity = post.severity;
  card.dataset.unread = item.read ? 'false' : 'true';
  card.dataset.surface = surface;
  card.dataset.postId = item.id;

  const sevBar = document.createElement('div');
  sevBar.className = 'notif-card__sev-bar';
  sevBar.setAttribute('aria-hidden', 'true');
  card.appendChild(sevBar);

  const inner = document.createElement('div');
  inner.className = 'notif-card__inner';

  const meta = document.createElement('div');
  meta.className = 'notif-card__meta';

  if (surface !== 'banner') {
    const pill = document.createElement('span');
    pill.className = 'notif-card__pill';
    pill.dataset.sev = post.severity;
    pill.textContent = post.severity;
    meta.appendChild(pill);
  }

  const cat = document.createElement('span');
  cat.className = 'notif-card__category';
  cat.textContent = post.category;
  meta.appendChild(cat);

  const time = document.createElement('time');
  time.className = 'notif-card__time';
  const ts = post.publishedAt ?? post.createdAt;
  time.dateTime = ts;
  time.title = new Date(ts).toLocaleString();
  time.textContent = formatRelative(ts);
  meta.appendChild(time);

  if (surface === 'banner') {
    const dismiss = document.createElement('button');
    dismiss.className = 'notif-card__dismiss';
    dismiss.type = 'button';
    dismiss.setAttribute('aria-label', 'Dismiss');
    dismiss.textContent = '×';
    dismiss.addEventListener('click', () => manager.dismissBanner(item.id));
    meta.appendChild(dismiss);
  }

  inner.appendChild(meta);

  const title = document.createElement('h3');
  title.className = 'notif-card__title';
  title.textContent = post.title;
  inner.appendChild(title);

  const hasSummary = !!(post.summary && post.summary.trim());
  const hasBody = !!post.body;
  const hasInlineCTAs =
    surface === 'banner' && post.ctas && post.ctas.length > 0;

  if (hasSummary) {
    const summary = document.createElement('div');
    summary.className = 'notif-card__summary notif-card__summary--md';
    summary.innerHTML = renderMarkdown(post.summary);
    inner.appendChild(summary);

    if (hasBody || hasInlineCTAs) {
      const expandable = document.createElement('div');
      expandable.className = 'notif-card__expandable';
      expandable.id = `notif-expandable-${item.id}-${surface}`;
      expandable.hidden = true;

      if (hasBody) {
        const body = document.createElement('div');
        body.className = 'notif-card__body';
        body.innerHTML = renderMarkdown(post.body);
        expandable.appendChild(body);
      }
      if (hasInlineCTAs) {
        appendCTAs(expandable, post, 'banner', manager, 'notif-card__ctas');
      }
      inner.appendChild(expandable);

      const toggle = document.createElement('button');
      toggle.className = 'notif-card__expand';
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', expandable.id);
      toggle.textContent = '↓ Show more';
      let expanded = false;
      toggle.addEventListener('click', () => {
        expanded = !expanded;
        expandable.hidden = !expanded;
        toggle.textContent = expanded ? '↑ Show less' : '↓ Show more';
        toggle.setAttribute('aria-expanded', String(expanded));
        // Expanding a banner must NOT mark read (it would unmount the banner
        // mid-read). Drawer/blocking expand advances read state.
        if (expanded && surface !== 'banner') {
          manager.expandSummary(item.id);
        }
      });
      inner.appendChild(toggle);
    }
  } else {
    if (hasBody) {
      const body = document.createElement('div');
      body.className = 'notif-card__body';
      body.innerHTML = renderMarkdown(post.body);
      inner.appendChild(body);
    }
    if (hasInlineCTAs) {
      appendCTAs(inner, post, 'banner', manager, 'notif-card__ctas');
    }
  }

  card.appendChild(inner);
  return card;
}
