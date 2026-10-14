interface ComponentOptions {
  component: HTMLElement;
}

function fragmentTarget(link: HTMLAnchorElement): HTMLElement | null {
  const href = link.getAttribute('href');
  if (!href?.startsWith('#')) return null;
  try {
    return document.getElementById(decodeURIComponent(href.slice(1)));
  } catch {
    return null;
  }
}

function headerOffset(): number {
  const header = document.querySelector<HTMLElement>('.topnav');
  if (!header) return 0;
  const position = getComputedStyle(header).position;
  return position === 'fixed' || position === 'sticky'
    ? Math.max(0, header.getBoundingClientRect().bottom)
    : 0;
}

/** Shared heading navigation; pre-rendered API operation links remain intact. */
export default function PageToc({ component }: ComponentOptions): void {
  const article = component
    .closest('.content-wrapper')
    ?.querySelector<HTMLElement>('.article--content');
  const nav = component.querySelector<HTMLElement>('.api-toc-nav');
  const toggle = component.querySelector<HTMLButtonElement>('.page-toc-toggle');
  if (article && nav && toggle) mount(component, article, nav, toggle);
}

function mount(
  component: HTMLElement,
  article: HTMLElement,
  nav: HTMLElement,
  toggle: HTMLButtonElement
): void {
  const serverLinks = [
    ...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
  ];
  const depth =
    component.dataset.tocDepth === '3' ? 'h2[id], h3[id]' : 'h2[id]';
  let links: HTMLAnchorElement[] = [];
  let refreshTimer = 0;
  let scrollFrame = 0;
  let pinned: { href: string; top: number; distance: number } | null = null;
  let settleTimer = 0;
  const desktop = matchMedia('(min-width: 1280px)');
  let expanded = false;

  function present(): void {
    const chat = document.body.dataset.askAiState;
    const suspended =
      !desktop.matches && ['loading', 'opening', 'open'].includes(chat || '');
    const visible = desktop.matches || (expanded && !suspended);
    toggle.hidden = desktop.matches || suspended;
    toggle.setAttribute('aria-expanded', String(visible));
    nav.hidden = !visible;
    component.classList.toggle('is-expanded', visible);
    component.classList.toggle('is-suspended', suspended);
    if (!visible && nav.contains(document.activeElement)) {
      if (!suspended) toggle.focus({ preventScroll: true });
      else
        document
          .querySelector<HTMLElement>('.ask-ai-button')
          ?.focus({ preventScroll: true });
    }
  }

  function dismiss(focus = true): void {
    expanded = false;
    present();
    if (focus) toggle.focus({ preventScroll: true });
  }
  toggle.addEventListener('click', () => {
    expanded = !expanded;
    present();
  });
  document.addEventListener('keydown', (event) => {
    if (
      event.key !== 'Escape' ||
      event.defaultPrevented ||
      desktop.matches ||
      !expanded
    )
      return;
    if (
      document.querySelector('[role="dialog"][aria-modal="true"], dialog[open]')
    )
      return;
    event.preventDefault();
    dismiss();
  });
  document.addEventListener('pointerdown', (event) => {
    if (
      !desktop.matches &&
      expanded &&
      !['loading', 'opening', 'open'].includes(
        document.body.dataset.askAiState || ''
      ) &&
      event.target instanceof Node &&
      !component.contains(event.target) &&
      !(
        event.target instanceof Element &&
        event.target.closest('[data-ask-ai-action="open"], .ask-ai-open')
      )
    )
      dismiss();
  });
  desktop.addEventListener('change', present);
  document.addEventListener('ask-ai-state-change', present);

  function setActive(active: HTMLAnchorElement | undefined): void {
    links.forEach((link) => {
      link.classList.toggle('is-active', link === active);
      if (link === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (active && !nav.hidden) {
      const scroller = desktop.matches ? component : nav;
      const panel = scroller.getBoundingClientRect();
      const entry = active.getBoundingClientRect();
      if (entry.top < panel.top) scroller.scrollTop += entry.top - panel.top;
      else if (entry.bottom > panel.bottom)
        scroller.scrollTop += entry.bottom - panel.bottom;
    }
  }

  function unpin(): void {
    window.clearTimeout(settleTimer);
    pinned = null;
  }

  function release(): void {
    unpin();
    highlight();
  }

  /** Distance from the selected target, or from as close as the page can get. */
  function remaining(top: number): number {
    const limit = document.documentElement.scrollHeight - window.innerHeight;
    return Math.abs(window.scrollY - Math.max(0, Math.min(top, limit)));
  }

  /**
   * Release the selected link once scrolling stops. Re-evaluate the active
   * entry only when the page stopped short of the selected target.
   */
  function settle(): void {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      const arrived = pinned !== null && remaining(pinned.top) <= 2;
      unpin();
      if (!arrived) highlight();
    }, 150);
  }

  /**
   * Below the desktop layout, publish the scroll offset so the stylesheet can
   * carry the rail up from its breakpoint start to its floor.
   */
  function shiftRail(): void {
    if (desktop.matches) return;
    component.style.setProperty(
      '--page-rail-scroll',
      `${Math.round(window.scrollY)}px`
    );
  }

  function frame(): void {
    scrollFrame = 0;
    shiftRail();
    if (!pinned) highlight();
  }

  function highlight(): void {
    const pin = pinned;
    const selected =
      pin && links.find((link) => link.getAttribute('href') === pin.href);
    if (selected) {
      setActive(selected);
      return;
    }
    let active = links[0];
    for (const link of links) {
      const target = fragmentTarget(link);
      if (target && target.getBoundingClientRect().top <= headerOffset() + 8)
        active = link;
    }
    setActive(active);
  }

  function refresh(): void {
    if (serverLinks.length) links = serverLinks;
    else {
      const list = document.createElement('ul');
      list.className = 'api-toc-list';
      for (const heading of article.querySelectorAll<HTMLElement>(depth)) {
        if (
          heading.closest('.feedback, [hidden], .page-actions') ||
          !heading.getClientRects().length
        )
          continue;
        const item = document.createElement('li');
        item.className = 'api-toc-item';
        item.classList.toggle('api-toc-item--nested', heading.tagName === 'H3');
        const link = document.createElement('a');
        link.className = 'api-toc-link';
        link.setAttribute('href', `#${encodeURIComponent(heading.id)}`);
        link.textContent = heading.textContent?.trim() || '';
        item.append(link);
        list.append(item);
      }
      nav.replaceChildren(list);
      links = [...nav.querySelectorAll<HTMLAnchorElement>('a')];
    }
    component.hidden = links.length === 0;
    component.classList.toggle('is-hidden', component.hidden);
    component
      .closest('.content-wrapper')
      ?.classList.toggle('has-page-toc', !component.hidden);
    shiftRail();
    highlight();
    present();
  }

  function scheduleRefresh(): void {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(refresh, 80);
  }

  component.addEventListener('click', (event) => {
    if (
      !(event.target instanceof Element) ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    )
      return;
    const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const target = fragmentTarget(link);
    const href = link.getAttribute('href');
    if (!target || !href) return;
    event.preventDefault();
    if (!desktop.matches) dismiss(false);
    history.pushState(null, '', href);
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerOffset();
    pinned = { href, top, distance: Infinity };
    window.scrollTo({
      top,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    setActive(link);
    settle();
  });
  window.addEventListener(
    'scroll',
    () => {
      if (pinned) {
        // A programmatic scroll only closes in on its target. Anything that
        // moves the page away from it has taken over, so drop the selection.
        const distance = remaining(pinned.top);
        if (distance <= pinned.distance + 1) {
          pinned.distance = distance;
          settle();
        } else unpin();
      }
      if (!scrollFrame) scrollFrame = requestAnimationFrame(frame);
    },
    { passive: true }
  );
  window.addEventListener('resize', scheduleRefresh);
  window.addEventListener('hashchange', release);
  window.addEventListener('popstate', release);
  const observer = new MutationObserver(scheduleRefresh);
  observer.observe(article, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden', 'open'],
  });
  window.addEventListener(
    'pagehide',
    () => {
      observer.disconnect();
      clearTimeout(refreshTimer);
      clearTimeout(settleTimer);
      cancelAnimationFrame(scrollFrame);
    },
    { once: true }
  );
  refresh();
}
