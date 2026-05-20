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

/*
  CTA URLs that leave the docs site open in a new tab; in-docs links open
  in the same tab. mailto: is treated as in-tab (the browser's mail handler
  takes over, no navigation occurs).
*/
function isExternalHref(href) {
  if (!href || href === '#') return false;
  if (href.startsWith('mailto:')) return false;
  try {
    const u = new URL(href, window.location.href);
    return !!u.hostname && u.hostname !== window.location.hostname;
  } catch {
    return false;
  }
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
  // Only force a new tab for links that leave the docs origin. In-docs and
  // mailto: links use the default in-tab behavior. rel="noopener noreferrer"
  // only matters with target="_blank", so it's set together.
  if (isExternalHref(a.href)) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
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

/*
  Drawer card. opts.initialExpanded restores the body's expanded state when
  the drawer re-renders (the controller owns a Set<id> across re-renders;
  see drawer.js). opts.onToggle is fired with the new expanded boolean so
  the controller can update its Set.
*/
export function renderDrawerCard(item, manager, opts = {}) {
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
  dismiss.title = 'Dismiss';
  dismiss.textContent = '×';
  dismiss.addEventListener('click', (e) => {
    e.stopPropagation();
    if (card.dataset.state === 'leaving') return;
    card.dataset.state = 'leaving';
    onAnimationDone(card, () => manager.dismissFromDrawer(item.id));
  });
  header.appendChild(dismiss);
  text.appendChild(header);

  // Summary is markdown (1.0.2 contract). When a post has BOTH a summary and
  // a body, the body sits behind a "Show more" toggle (mirrors the
  // banner/blocking top-bar card). With only a body, it's shown as the
  // summary fallback.
  if (post.summary && post.summary.trim() !== '') {
    const summary = document.createElement('div');
    summary.className =
      'notif-card-drawer__summary notif-card-drawer__summary--md';
    summary.innerHTML = renderMarkdown(post.summary);
    text.appendChild(summary);

    if (post.body) {
      const body = document.createElement('div');
      body.className =
        'notif-card-drawer__summary notif-card-drawer__summary--md notif-card-drawer__body';
      body.id = `notif-drawer-body-${item.id}`;
      // Drive show/hide via [data-expanded] (CSS-animatable) instead of the
      // [hidden] attribute (display:none — not animatable). aria-hidden
      // preserves the assistive-tech semantic.
      let expanded = !!opts.initialExpanded;
      body.dataset.expanded = String(expanded);
      body.setAttribute('aria-hidden', String(!expanded));
      body.innerHTML = renderMarkdown(post.body);
      text.appendChild(body);

      const toggle = document.createElement('button');
      toggle.className = 'notif-card__expand';
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute('aria-controls', body.id);
      toggle.textContent = expanded ? '↑ Show less' : '↓ Show more';
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        expanded = !expanded;
        body.dataset.expanded = String(expanded);
        body.setAttribute('aria-hidden', String(!expanded));
        toggle.textContent = expanded ? '↑ Show less' : '↓ Show more';
        toggle.setAttribute('aria-expanded', String(expanded));
        // Tell the controller so it can persist this across re-renders.
        if (typeof opts.onToggle === 'function') opts.onToggle(expanded);
        // Expanding to read the body advances read state — consistent with
        // the top-bar card and the standard's "summary expansion = read".
        // expandSummary emits 'change' which triggers the drawer to
        // re-render every card; the controller-owned expanded Set keeps
        // this card open across that re-render via opts.initialExpanded.
        if (expanded) manager.expandSummary(item.id);
      });
      text.appendChild(toggle);
    }
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
  dot.title = 'Mark as read';
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

  // Severity pill is omitted on all top-bar surfaces — banner conveys
  // severity via the left bar; blocking has the modal context (and the
  // user prefers no badge there).

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
  // Banner AND blocking render CTAs inside the card body. (Drawer cards use
  // their own renderer; blocking's modal footer holds only the Acknowledge
  // button — no CTAs there.)
  const hasInlineCTAs =
    (surface === 'banner' || surface === 'blocking') &&
    post.ctas &&
    post.ctas.length > 0;

  if (hasSummary) {
    const summary = document.createElement('div');
    summary.className = 'notif-card__summary notif-card__summary--md';
    summary.innerHTML = renderMarkdown(post.summary);
    inner.appendChild(summary);

    // Only the body lives behind the Show more toggle — CTAs stay outside
    // (always visible), matching the drawer card. With no body there's
    // nothing to reveal, so the toggle is omitted.
    if (hasBody) {
      const expandable = document.createElement('div');
      expandable.className = 'notif-card__expandable';
      expandable.id = `notif-expandable-${item.id}-${surface}`;
      // CSS-animatable state — see drawer card above for the rationale.
      expandable.dataset.expanded = 'false';
      expandable.setAttribute('aria-hidden', 'true');

      const body = document.createElement('div');
      body.className = 'notif-card__body';
      body.innerHTML = renderMarkdown(post.body);
      expandable.appendChild(body);
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
        expandable.dataset.expanded = String(expanded);
        expandable.setAttribute('aria-hidden', String(!expanded));
        toggle.textContent = expanded ? '↑ Show less' : '↓ Show more';
        toggle.setAttribute('aria-expanded', String(expanded));
        // Top-bar expand does NOT advance read state on either surface:
        // - banner: marking read removes it from the banner queue mid-read.
        // - blocking: marking read makes the modal close on its own.
        // Only explicit X (banner) or Acknowledge (blocking) marks read.
        // The drawer card's renderer handles its own read advancement.
      });
      inner.appendChild(toggle);
    }

    // CTAs always visible, after summary (and any expandable + toggle).
    if (hasInlineCTAs) {
      appendCTAs(inner, post, surface, manager, 'notif-card__ctas');
    }
  } else {
    if (hasBody) {
      const body = document.createElement('div');
      body.className = 'notif-card__body';
      body.innerHTML = renderMarkdown(post.body);
      inner.appendChild(body);
    }
    if (hasInlineCTAs) {
      appendCTAs(inner, post, surface, manager, 'notif-card__ctas');
    }
  }

  card.appendChild(inner);
  return card;
}
