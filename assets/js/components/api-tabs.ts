/**
 * API Tabs Component
 *
 * Handles tab switching for API reference documentation.
 * Uses data-tab and data-tab-panel attributes for explicit panel targeting,
 * unlike the generic tabs which use positional indexing.
 *
 * Features:
 * - Explicit panel targeting via data-tab-panel
 * - Deep linking via URL hash
 * - Browser back/forward navigation support
 * - Custom event dispatch for TOC updates
 *
 * Usage:
 * <div class="api-tabs-wrapper" data-component="api-tabs">
 *   <div class="api-tabs-nav">
 *     <a href="#operations" data-tab="operations" class="is-active">Operations</a>
 *     <a href="#auth" data-tab="auth">Authentication</a>
 *   </div>
 * </div>
 * <div class="api-tab-panels">
 *   <section data-tab-panel="operations">...</section>
 *   <section data-tab-panel="auth" style="display:none">...</section>
 * </div>
 */

interface ComponentOptions {
  component: HTMLElement;
}

/**
 * Find the panels container (sibling element after tabs)
 */
function findPanelsContainer(tabsWrapper: HTMLElement): HTMLElement | null {
  let sibling = tabsWrapper.nextElementSibling;
  while (sibling) {
    if (sibling.classList.contains('api-tab-panels')) {
      return sibling as HTMLElement;
    }
    sibling = sibling.nextElementSibling;
  }
  return null;
}

/**
 * Switch to a specific tab
 */
function switchTab(
  tabsWrapper: HTMLElement,
  panelsContainer: HTMLElement,
  tabId: string,
  updateHash = true
): void {
  // Update active tab
  const tabs = tabsWrapper.querySelectorAll<HTMLAnchorElement>('[data-tab]');
  tabs.forEach((tab) => {
    if (tab.dataset.tab === tabId) {
      tab.classList.add('is-active');
    } else {
      tab.classList.remove('is-active');
    }
  });

  // Update visible panel
  const panels =
    panelsContainer.querySelectorAll<HTMLElement>('[data-tab-panel]');
  panels.forEach((panel) => {
    if (panel.dataset.tabPanel === tabId) {
      panel.style.display = 'block';
    } else {
      panel.style.display = 'none';
    }
  });

  // Update URL hash without scrolling
  if (updateHash) {
    history.replaceState(null, '', '#' + tabId);
  }

  // Dispatch custom event for TOC update
  document.dispatchEvent(
    new CustomEvent('api-tab-change', { detail: { tab: tabId } })
  );
}

/**
 * Get tab ID from URL hash
 */
function getTabFromHash(): string | null {
  const hash = window.location.hash.substring(1);
  return hash || null;
}

/**
 * Initialize API Tabs component
 */
export default function ApiTabs({ component }: ComponentOptions): void {
  const panelsContainer = findPanelsContainer(component);

  if (!panelsContainer) {
    console.warn('[API Tabs] No .api-tab-panels container found');
    return;
  }

  const tabs = component.querySelectorAll<HTMLAnchorElement>('[data-tab]');

  if (tabs.length === 0) {
    console.warn('[API Tabs] No tabs found with data-tab attribute');
    return;
  }

  // Handle tab clicks
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent other tab handlers from firing

      const tabId = tab.dataset.tab;
      if (tabId) {
        switchTab(component, panelsContainer, tabId);
      }
    });
  });

  // Handle deep linking via URL hash on load
  const hashTab = getTabFromHash();
  if (hashTab) {
    const matchingTab = component.querySelector(`[data-tab="${hashTab}"]`);
    if (matchingTab) {
      switchTab(component, panelsContainer, hashTab, false);
    }
  }

  // Handle browser back/forward navigation
  window.addEventListener('hashchange', () => {
    const newTabId = getTabFromHash();
    if (newTabId) {
      const matchingTab = component.querySelector(`[data-tab="${newTabId}"]`);
      if (matchingTab) {
        switchTab(component, panelsContainer, newTabId, false);
      }
    }
  });
}
