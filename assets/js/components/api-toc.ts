/**
 * API Table of Contents Component
 *
 * Generates "ON THIS PAGE" navigation from content headings or operations data.
 * Features:
 * - Builds TOC from h2/h3 headings in the active tab panel (legacy)
 * - Builds TOC from operations data passed via data-operations attribute (tag-based)
 * - Highlights current section on scroll (intersection observer)
 * - Smooth scroll to anchors
 * - Updates when tab changes
 *
 * Usage:
 * <aside class="api-toc" data-component="api-toc" data-operations='[...]'>
 *   <h4 class="api-toc-header">ON THIS PAGE</h4>
 *   <nav class="api-toc-nav"></nav>
 * </aside>
 */

interface ComponentOptions {
  component: HTMLElement;
}

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

/**
 * Operation metadata from frontmatter (for tag-based pages)
 */
interface OperationMeta {
  operationId: string;
  method: string;
  path: string;
  summary: string;
  tags: string[];
}

/**
 * Get headings from the currently visible content
 */
function getVisibleHeadings(): TocEntry[] {
  // Find the active tab panel or main content area
  const activePanel = document.querySelector(
    '.tab-content:not([style*="display: none"]), [data-tab-panel]:not([style*="display: none"]), .article--content'
  );

  if (!activePanel) {
    return [];
  }

  const headings = activePanel.querySelectorAll('h2, h3');
  const entries: TocEntry[] = [];

  headings.forEach((heading) => {
    // Skip headings without IDs
    if (!heading.id) {
      return;
    }

    // Skip hidden headings
    const rect = heading.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      return;
    }

    entries.push({
      id: heading.id,
      text: heading.textContent?.trim() || '',
      level: heading.tagName === 'H2' ? 2 : 3,
    });
  });

  return entries;
}

/**
 * Build TOC HTML from entries
 */
function buildTocHtml(entries: TocEntry[]): string {
  if (entries.length === 0) {
    // Return empty string - the TOC container can be hidden via CSS when empty
    return '';
  }

  let html = '<ul class="api-toc-list">';

  entries.forEach((entry) => {
    const indent = entry.level === 3 ? ' api-toc-item--nested' : '';
    html += `
      <li class="api-toc-item${indent}">
        <a href="#${entry.id}" class="api-toc-link">${entry.text}</a>
      </li>
    `;
  });

  html += '</ul>';
  return html;
}

/**
 * Get method badge class for HTTP method
 */
function getMethodClass(method: string): string {
  const m = method.toLowerCase();
  switch (m) {
    case 'get':
      return 'api-method--get';
    case 'post':
      return 'api-method--post';
    case 'put':
      return 'api-method--put';
    case 'patch':
      return 'api-method--patch';
    case 'delete':
      return 'api-method--delete';
    default:
      return '';
  }
}

/**
 * Build TOC HTML from operations data (for tag-based pages)
 */
function buildOperationsTocHtml(operations: OperationMeta[]): string {
  if (operations.length === 0) {
    return '<p class="api-toc-empty">No operations on this page.</p>';
  }

  let html = '<ul class="api-toc-list api-toc-list--operations">';

  operations.forEach((op) => {
    // Generate anchor ID from operationId (RapiDoc uses operationId for anchors)
    const anchorId = op.operationId;
    const methodClass = getMethodClass(op.method);

    html += `
      <li class="api-toc-item api-toc-item--operation">
        <a href="#${anchorId}" class="api-toc-link api-toc-link--operation">
          <span class="api-method ${methodClass}">${op.method.toUpperCase()}</span>
          <span class="api-path">${op.path}</span>
        </a>
      </li>
    `;
  });

  html += '</ul>';
  return html;
}

/**
 * Parse operations from data attribute
 */
function parseOperationsData(component: HTMLElement): OperationMeta[] | null {
  const dataAttr = component.getAttribute('data-operations');
  if (!dataAttr) {
    return null;
  }

  try {
    const operations = JSON.parse(dataAttr) as OperationMeta[];
    return Array.isArray(operations) ? operations : null;
  } catch (e) {
    console.warn('[API TOC] Failed to parse operations data:', e);
    return null;
  }
}

/**
 * Set up intersection observer for scroll highlighting
 */
function setupScrollHighlighting(
  container: HTMLElement,
  entries: TocEntry[]
): IntersectionObserver | null {
  if (entries.length === 0) {
    return null;
  }

  const headingIds = entries.map((e) => e.id);
  const links = container.querySelectorAll<HTMLAnchorElement>('.api-toc-link');

  // Create a map of heading ID to link element
  const linkMap = new Map<string, HTMLAnchorElement>();
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) {
      linkMap.set(href.slice(1), link);
    }
  });

  // Track which headings are visible
  const visibleHeadings = new Set<string>();

  const observer = new IntersectionObserver(
    (observerEntries) => {
      observerEntries.forEach((entry) => {
        const id = entry.target.id;

        if (entry.isIntersecting) {
          visibleHeadings.add(id);
        } else {
          visibleHeadings.delete(id);
        }
      });

      // Find the first visible heading (in document order)
      let activeId: string | null = null;
      for (const id of headingIds) {
        if (visibleHeadings.has(id)) {
          activeId = id;
          break;
        }
      }

      // If no heading is visible, use the last one that was scrolled past
      if (!activeId && visibleHeadings.size === 0) {
        const scrollY = window.scrollY;
        for (let i = headingIds.length - 1; i >= 0; i--) {
          const heading = document.getElementById(headingIds[i]);
          if (heading && heading.offsetTop < scrollY + 100) {
            activeId = headingIds[i];
            break;
          }
        }
      }

      // Update active state on links
      links.forEach((link) => {
        link.classList.remove('is-active');
      });

      if (activeId) {
        const activeLink = linkMap.get(activeId);
        activeLink?.classList.add('is-active');
      }
    },
    {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    }
  );

  // Observe all headings
  headingIds.forEach((id) => {
    const heading = document.getElementById(id);
    if (heading) {
      observer.observe(heading);
    }
  });

  return observer;
}

/**
 * Set up RapiDoc navigation for TOC links (for tag pages)
 * Uses RapiDoc's scrollToPath method instead of native scroll
 */
function setupRapiDocNavigation(container: HTMLElement): void {
  container.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest<HTMLAnchorElement>('.api-toc-link');

    if (!link) {
      return;
    }

    const href = link.getAttribute('href');
    if (!href?.startsWith('#')) {
      return;
    }

    event.preventDefault();

    // Get the path from the hash (e.g., "post-/api/v3/configure/distinct_cache")
    const path = href.slice(1);

    // Find RapiDoc element and call scrollToPath
    const rapiDoc = document.querySelector('rapi-doc') as HTMLElement & {
      scrollToPath?: (path: string) => void;
    };

    if (rapiDoc && typeof rapiDoc.scrollToPath === 'function') {
      rapiDoc.scrollToPath(path);
    }

    // Update URL hash
    history.pushState(null, '', href);
  });
}

/**
 * Set up smooth scroll for TOC links
 */
function setupSmoothScroll(container: HTMLElement): void {
  container.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest<HTMLAnchorElement>('.api-toc-link');

    if (!link) {
      return;
    }

    const href = link.getAttribute('href');
    if (!href?.startsWith('#')) {
      return;
    }

    const targetElement = document.getElementById(href.slice(1));
    if (!targetElement) {
      return;
    }

    event.preventDefault();

    // Scroll with offset for fixed header
    const headerOffset = 80;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    // Update URL hash without jumping
    history.pushState(null, '', href);
  });
}

/**
 * Update TOC visibility based on active tab
 * Hide TOC for Operations tab (RapiDoc has built-in navigation)
 */
function updateTocVisibility(container: HTMLElement): void {
  const operationsPanel = document.querySelector(
    '[data-tab-panel="operations"]'
  );
  const isOperationsVisible =
    operationsPanel &&
    !operationsPanel.getAttribute('style')?.includes('display: none');

  if (isOperationsVisible) {
    container.classList.add('is-hidden');
  } else {
    container.classList.remove('is-hidden');
  }
}

/**
 * Watch for tab changes to rebuild TOC
 */
function watchTabChanges(
  container: HTMLElement,
  rebuild: () => void
): MutationObserver {
  const tabPanels = document.querySelector('.api-tab-panels');

  if (!tabPanels) {
    return new MutationObserver(() => {});
  }

  const observer = new MutationObserver((mutations) => {
    // Check if any tab panel visibility changed
    const hasVisibilityChange = mutations.some((mutation) => {
      return (
        mutation.type === 'attributes' &&
        (mutation.attributeName === 'style' ||
          mutation.attributeName === 'class')
      );
    });

    if (hasVisibilityChange) {
      // Update visibility based on active tab
      updateTocVisibility(container);
      // Debounce rebuild
      setTimeout(rebuild, 100);
    }
  });

  observer.observe(tabPanels, {
    attributes: true,
    subtree: true,
    attributeFilter: ['style', 'class'],
  });

  return observer;
}

/**
 * Initialize API TOC component
 */
export default function ApiToc({ component }: ComponentOptions): void {
  const nav = component.querySelector<HTMLElement>('.api-toc-nav');

  if (!nav) {
    console.warn('[API TOC] No .api-toc-nav element found');
    return;
  }

  // Check if TOC was pre-rendered server-side (has existing links)
  // For tag pages with RapiDoc, the TOC is rendered by Hugo from operations frontmatter
  const hasServerRenderedToc = nav.querySelectorAll('.api-toc-link').length > 0;

  if (hasServerRenderedToc) {
    // Server-side TOC exists - just show it and set up navigation
    component.classList.remove('is-hidden');

    // For tag pages with RapiDoc, use RapiDoc's scrollToPath for navigation
    // instead of smooth scrolling (which can't access shadow DOM elements)
    const rapiDocWrapper = document.querySelector('[data-tag-page="true"]');
    if (rapiDocWrapper) {
      setupRapiDocNavigation(component);
    } else {
      setupSmoothScroll(component);
    }
    return;
  }

  // Check for operations data (tag-based pages)
  const operations = parseOperationsData(component);
  let observer: IntersectionObserver | null = null;

  /**
   * Rebuild the TOC
   */
  function rebuild(): void {
    // Clean up previous observer
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    // If operations data is present, build operations-based TOC
    if (operations && operations.length > 0) {
      if (nav) {
        nav.innerHTML = buildOperationsTocHtml(operations);
      }
      // Don't hide TOC for tag-based pages - always show operations
      component.classList.remove('is-hidden');
      return;
    }

    // Otherwise, fall back to heading-based TOC
    const entries = getVisibleHeadings();
    if (nav) {
      nav.innerHTML = buildTocHtml(entries);
    }

    // Hide TOC if no entries, show if entries exist
    if (entries.length === 0) {
      component.classList.add('is-hidden');
    } else {
      component.classList.remove('is-hidden');
      // Set up scroll highlighting only when we have entries
      observer = setupScrollHighlighting(component, entries);
    }
  }

  // Check initial visibility (hide for Operations tab, only for non-operations pages)
  if (!operations || operations.length === 0) {
    updateTocVisibility(component);
  }

  // Initial build
  rebuild();

  // Set up smooth scroll
  setupSmoothScroll(component);

  // Watch for tab changes (only for non-operations pages)
  if (!operations || operations.length === 0) {
    watchTabChanges(component, rebuild);
  }

  // Also rebuild on window resize (headings may change visibility)
  let resizeTimeout: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(rebuild, 250);
  });
}
