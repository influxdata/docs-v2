/**
 * RapiDoc Mini Component
 *
 * Initializes RapiDoc Mini web component for single API operation rendering.
 * Features:
 * - Dynamic CDN loading (memoized across instances)
 * - Theme synchronization with Hugo theme system
 * - Multiple instance support (no hardcoded IDs)
 * - Cleanup function for proper teardown
 *
 * Usage:
 * <div data-component="rapidoc-mini"
 *      data-spec-url="/path/to/spec.yml"
 *      data-match-paths="post /write">
 * </div>
 */

import { getPreference } from '../services/local-storage.js';

interface ComponentOptions {
  component: HTMLElement;
}

interface ThemeConfig {
  theme: 'light' | 'dark';
  bgColor: string;
  textColor: string;
  primaryColor: string;
  navBgColor: string;
  navTextColor: string;
  navHoverBgColor: string;
  navHoverTextColor: string;
}

type CleanupFn = () => void;

// Use full RapiDoc for proper auth tooltip behavior
// (mini version has limited features)
const RAPIDOC_CDN = 'https://unpkg.com/rapidoc/dist/rapidoc-min.js';
const RAPIDOC_ELEMENT = 'rapi-doc';

// Memoization: track script loading state
let scriptLoadPromise: Promise<void> | null = null;

/**
 * Load RapiDoc Mini script from CDN (memoized)
 */
function loadRapiDocScript(timeout = 10000): Promise<void> {
  // Return existing promise if already loading
  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  // Check if custom element already registered
  if (customElements.get(RAPIDOC_ELEMENT)) {
    return Promise.resolve();
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    // Check if script tag already exists
    const existing = Array.from(document.scripts).find(
      (s) => s.src && s.src.includes('rapidoc')
    );

    if (existing && customElements.get(RAPIDOC_ELEMENT)) {
      return resolve();
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = RAPIDOC_CDN;

    script.onload = () => {
      // Poll for custom element registration
      const startTime = Date.now();
      const pollInterval = setInterval(() => {
        if (customElements.get(RAPIDOC_ELEMENT)) {
          clearInterval(pollInterval);
          resolve();
        } else if (Date.now() - startTime > timeout) {
          clearInterval(pollInterval);
          reject(new Error('RapiDoc Mini custom element not registered'));
        }
      }, 50);
    };

    script.onerror = () => {
      scriptLoadPromise = null; // Reset on error for retry
      reject(new Error(`Failed to load RapiDoc Mini from ${RAPIDOC_CDN}`));
    };

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

/**
 * Get current theme from localStorage
 */
function getTheme(): 'dark' | 'light' {
  const theme = getPreference('theme');
  return theme === 'dark' ? 'dark' : 'light';
}

/**
 * Get theme configuration for RapiDoc Mini
 * Colors matched to Hugo theme SCSS variables:
 * - Dark: _theme-dark.scss
 * - Light: _theme-light.scss
 */
function getThemeConfig(isDark: boolean): ThemeConfig {
  return isDark
    ? {
        theme: 'dark',
        bgColor: '#14141F', // $grey10 ($article-bg in dark theme)
        textColor: '#D4D7DD', // $g15-platinum ($article-text in dark theme)
        primaryColor: '#00A3FF', // $b-pool ($article-link)
        navBgColor: '#07070E', // $grey5 ($body-bg in dark theme)
        navTextColor: '#D4D7DD', // $g15-platinum ($nav-item)
        navHoverBgColor: '#00A3FF', // $b-pool
        navHoverTextColor: '#FFFFFF', // $g20-white
      }
    : {
        theme: 'light',
        bgColor: '#FFFFFF', // $g20-white ($article-bg in light theme)
        textColor: '#020a47', // $br-dark-blue ($article-text in light theme)
        primaryColor: '#00A3FF', // $b-pool ($article-link)
        navBgColor: '#f3f4fb', // $body-bg in light theme
        navTextColor: '#757888', // $g9-mountain ($nav-item)
        navHoverBgColor: '#BF2FE5', // $br-magenta ($nav-item-hover)
        navHoverTextColor: '#FFFFFF', // $g20-white
      };
}

/**
 * Apply theme attributes to RapiDoc Mini element
 */
function applyTheme(element: HTMLElement): void {
  const isDark = getTheme() === 'dark';
  const config = getThemeConfig(isDark);

  // Core theme colors
  element.setAttribute('theme', config.theme);
  element.setAttribute('bg-color', config.bgColor);
  element.setAttribute('text-color', config.textColor);
  element.setAttribute('primary-color', config.primaryColor);

  // Navigation colors (for any internal nav elements)
  element.setAttribute('nav-bg-color', config.navBgColor);
  element.setAttribute('nav-text-color', config.navTextColor);
  element.setAttribute('nav-hover-bg-color', config.navHoverBgColor);
  element.setAttribute('nav-hover-text-color', config.navHoverTextColor);

  // Accent color - prevent green defaults
  element.setAttribute('nav-accent-color', config.primaryColor);
}

/**
 * Build match pattern that identifies operations within a spec.
 *
 * When using path-specific specs (recommended), the spec contains only one path,
 * so matchPaths is just the HTTP method (e.g., "post"). The path isolation at the
 * file level prevents substring matching issues - no title needed.
 *
 * When using tag-based specs (fallback), matchPaths includes the full path
 * (e.g., "post /api/v3/configure/token/admin"). Adding the title helps differentiate
 * operations whose paths are prefixes of each other.
 *
 * RapiDoc's search string format:
 *   `${method} ${path} ${summary} ${description} ${operationId} ${tagName}`.toLowerCase()
 *
 * @param matchPaths - The match pattern: just method for path-specific specs,
 *                     or "method /path" for tag-based specs
 * @param title - Optional page title to append (only used for tag-based specs)
 * @returns Pattern for RapiDoc's match-paths attribute
 */
function buildMatchPattern(matchPaths: string, title?: string): string {
  // Detect path-specific spec mode: matchPaths is just an HTTP method (no path)
  const isMethodOnly = /^(get|post|put|patch|delete|options|head|trace)$/i.test(
    matchPaths.trim()
  );

  // For path-specific specs: use method only, title not needed (path isolated at file level)
  // For tag-based specs: append title to differentiate prefix conflicts
  if (title && !isMethodOnly) {
    return `${matchPaths} ${title.toLowerCase()}`;
  }
  return matchPaths;
}

/**
 * Create RapiDoc Mini element with configuration
 */
function createRapiDocElement(
  specUrl: string,
  matchPaths?: string,
  title?: string
): HTMLElement {
  const element = document.createElement(RAPIDOC_ELEMENT);

  // Core attributes
  element.setAttribute('spec-url', specUrl);

  // Set match-paths filter. With path-specific specs, this is just the method.
  // With tag-based specs, includes path + optional title for uniqueness.
  if (matchPaths) {
    element.setAttribute('match-paths', buildMatchPattern(matchPaths, title));
  }

  // Typography - match docs theme fonts
  element.setAttribute(
    'regular-font',
    'Proxima Nova, -apple-system, BlinkMacSystemFont, sans-serif'
  );
  element.setAttribute(
    'mono-font',
    'IBM Plex Mono, Monaco, Consolas, monospace'
  );
  element.setAttribute('font-size', 'default'); // Match surrounding content size

  // Layout - use 'read' style for compact, single-operation display
  //
  // EXPERIMENTAL FINDINGS (Task 4 - API Security Schemes):
  // -----------------------------------------------------
  // RapiDoc's `allow-authentication="true"` DOES NOT show auth input
  // on operation pages when using `match-paths` to filter to a single
  // operation. Here's what was tested:
  //
  // 1. render-style="read" + allow-authentication="true":
  //    - Auth section (#auth) exists in shadow DOM with input fields
  //    - BUT it's not visible (filtered out by match-paths)
  //    - Only shows the matched operation, not the full spec
  //    - Found: username/password inputs for Basic auth in shadow DOM
  //    - Result: NO visible auth UI for users
  //
  // 2. render-style="focused" + allow-authentication="true":
  //    - Auth section completely removed from shadow DOM
  //    - Shows links to #auth section that don't exist (broken links)
  //    - Lists security schemes but no input fields
  //    - Result: NO auth section at all
  //
  // CONCLUSION:
  // RapiDoc's built-in authentication UI is incompatible with
  // match-paths filtering. The auth section is either hidden or
  // completely removed when filtering to single operations.
  // For credential input on operation pages, we need a custom
  // component (Task 5).
  //
  // Layout and render style for compact operation display
  element.setAttribute('layout', 'column');
  element.setAttribute('render-style', 'read');
  element.setAttribute('show-header', 'false');
  element.setAttribute('allow-server-selection', 'false');

  // Schema display - use 'table' style to reduce parameter indentation
  element.setAttribute('schema-style', 'table');
  element.setAttribute('default-schema-tab', 'schema');
  element.setAttribute('paths-expanded', 'true');
  element.setAttribute('schema-expand-level', '1');

  // Interactivity
  element.setAttribute('allow-try', 'true');
  element.setAttribute('fill-request-fields-with-example', 'true');

  // Reduce excessive spacing
  element.setAttribute('use-path-in-nav-bar', 'false');
  element.setAttribute('show-info', 'false');

  // Authentication display - disabled because RapiDoc's auth UI doesn't work
  // with match-paths filtering. We show a separate auth info banner instead.
  element.setAttribute('allow-authentication', 'false');
  element.setAttribute('show-components', 'false');

  // Custom CSS for internal style overrides (table layout, etc.)
  element.setAttribute('css-file', '/css/rapidoc-custom.css');

  // Override method colors to use theme primary color instead of green
  element.setAttribute('post-color', '#00A3FF'); // $b-pool instead of green
  element.setAttribute('get-color', '#00A3FF');
  element.setAttribute('put-color', '#9394FF'); // $br-galaxy
  element.setAttribute('delete-color', '#BF3D5E'); // $r-ruby
  element.setAttribute('patch-color', '#9394FF');

  // Apply initial theme
  applyTheme(element);

  return element;
}

/**
 * Inject custom styles into RapiDoc's shadow DOM
 * Removes the top border and reduces whitespace above operations
 */
function injectShadowStyles(element: HTMLElement): void {
  const tryInject = (): boolean => {
    const shadowRoot = (element as unknown as { shadowRoot: ShadowRoot | null })
      .shadowRoot;
    if (!shadowRoot) return false;

    // Check if styles already injected
    if (shadowRoot.querySelector('#rapidoc-custom-styles')) return true;

    const style = document.createElement('style');
    style.id = 'rapidoc-custom-styles';
    style.textContent = `
      /* Hide the operation divider line */
      .divider[part="operation-divider"] {
        display: none !important;
      }

      /* Reduce spacing above operation sections */
      .section-gap {
        padding-top: 0 !important;
      }

      /* Fix text cutoff - ensure content flows responsively */
      .req-res-title,
      .resp-head,
      .api-request,
      .api-response,
      .param-name,
      .param-type,
      .descr {
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      /* Allow wrapping in tables and flex containers */
      table {
        table-layout: auto !important;
        width: 100% !important;
      }

      td, th {
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal !important;
      }

      /* Prevent horizontal overflow */
      .section-gap,
      .expanded-req-resp-container {
        max-width: 100%;
        overflow-x: auto;
      }

      /* Fix Copy button overlapping code content in Try It section */
      /* The Copy button is absolutely positioned, so add padding to prevent overlap */
      .curl-request pre,
      .curl-request code,
      .request-body-container pre,
      .response-panel pre {
        padding-right: 4.5rem !important; /* Space for Copy button */
      }

      /* Ensure Copy button stays visible and accessible */
      .copy-btn,
      button[title="Copy"] {
        z-index: 1;
        background: rgba(0, 163, 255, 0.9) !important;
        border-radius: 4px;
      }

      /* Make code blocks wrap long URLs instead of requiring horizontal scroll */
      .curl-request code,
      .request-body-container code {
        white-space: pre-wrap !important;
        word-break: break-all;
      }

      /* ============================================
         RESPONSIVE STYLES FOR MOBILE (max-width: 600px)
         ============================================ */
      @media (max-width: 600px) {
        /* CRITICAL FIX: The button row container uses inline display:flex
           and the hide-in-small-screen div has width:calc(100% - 60px)
           which only leaves 60px for all buttons - not enough!

           Structure:
           div[part="wrap-request-btn"] style="display:flex"
             > div.hide-in-small-screen style="width:calc(100% - 60px)"  <- PROBLEM
             > button.m-btn (FILL EXAMPLE)
             > button.m-btn (CLEAR)
             > button.m-btn (TRY)
        */

        /* Target the outer button wrapper - make it wrap */
        [part="wrap-request-btn"] {
          flex-wrap: wrap !important;
          gap: 0.5rem !important;
        }

        /* The hide-in-small-screen div steals width - override its calc() */
        .hide-in-small-screen {
          width: 100% !important;
          flex-basis: 100% !important;
          margin-bottom: 0.5rem !important;
        }

        /* Make buttons smaller on mobile and ensure they fit */
        button.m-btn, .m-btn {
          padding: 0.35rem 0.5rem !important;
          font-size: 0.7rem !important;
          margin-right: 4px !important;
          flex-shrink: 0 !important;
        }

        /* Full width for nested elements */
        .request-body-container,
        .response-panel,
        .req-resp-container {
          width: 100% !important;
          max-width: 100% !important;
        }

        /* Make tables scroll horizontally if needed */
        .table-wrapper,
        table {
          display: block !important;
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch;
        }

        /* Tab navigation - scroll horizontally */
        .tab-buttons,
        [role="tablist"] {
          overflow-x: auto !important;
          flex-wrap: nowrap !important;
          -webkit-overflow-scrolling: touch;
        }
      }
    `;
    shadowRoot.appendChild(style);

    return true;
  };

  // Try immediately
  if (tryInject()) return;

  // Retry a few times as shadow DOM may not be ready
  let attempts = 0;
  const maxAttempts = 10;
  const interval = setInterval(() => {
    attempts++;
    if (tryInject() || attempts >= maxAttempts) {
      clearInterval(interval);
    }
  }, 100);
}

/**
 * Apply responsive fixes directly to element styles via JavaScript
 * This is more reliable than CSS for overriding inline styles
 *
 * IMPORTANT: RapiDoc has NESTED shadow DOMs:
 *   rapi-doc.shadowRoot > api-request.shadowRoot
 * The buttons (FILL EXAMPLE, CLEAR, TRY) are in the api-request shadow root.
 */
function applyResponsiveFixes(element: HTMLElement): void {
  /**
   * Recursively collect all shadow roots (including nested ones)
   */
  const getAllShadowRoots = (root: Document | ShadowRoot): ShadowRoot[] => {
    const shadowRoots: ShadowRoot[] = [];
    const elements = Array.from(root.querySelectorAll('*'));
    for (const el of elements) {
      const htmlEl = el as HTMLElement;
      if (htmlEl.shadowRoot) {
        shadowRoots.push(htmlEl.shadowRoot);
        shadowRoots.push(...getAllShadowRoots(htmlEl.shadowRoot));
      }
    }
    return shadowRoots;
  };

  /**
   * Apply fixes to a single shadow root
   */
  const applyFixes = (shadowRoot: ShadowRoot): number => {
    let fixCount = 0;

    // Find the button wrapper by its part attribute
    const btnWrapper = shadowRoot.querySelector(
      '[part="wrap-request-btn"]'
    ) as HTMLElement;

    if (btnWrapper) {
      btnWrapper.style.flexWrap = 'wrap';
      btnWrapper.style.gap = '0.5rem';
      fixCount++;
    }

    // Find hide-in-small-screen divs and fix their width
    const hideInSmall = shadowRoot.querySelectorAll(
      '.hide-in-small-screen'
    ) as NodeListOf<HTMLElement>;
    hideInSmall.forEach((el) => {
      el.style.width = '100%';
      el.style.flexBasis = '100%';
      el.style.marginBottom = '0.5rem';
      fixCount++;
    });

    // Make buttons smaller
    const buttons = shadowRoot.querySelectorAll(
      '.m-btn'
    ) as NodeListOf<HTMLElement>;
    buttons.forEach((btn) => {
      btn.style.padding = '0.35rem 0.5rem';
      btn.style.fontSize = '0.7rem';
      btn.style.marginRight = '4px';
    });
    if (buttons.length > 0) {
      fixCount += buttons.length;
    }

    return fixCount;
  };

  /**
   * Apply fixes to ALL shadow roots (including nested api-request)
   * Returns the number of buttons found (used to determine if RapiDoc fully loaded)
   */
  const applyToAllShadowRoots = (): number => {
    const topShadowRoot = (
      element as unknown as { shadowRoot: ShadowRoot | null }
    ).shadowRoot;
    if (!topShadowRoot) {
      return 0;
    }

    // Get all shadow roots including nested ones (e.g., api-request inside rapi-doc)
    const allShadowRoots = [topShadowRoot, ...getAllShadowRoots(topShadowRoot)];

    let buttonCount = 0;

    for (const sr of allShadowRoots) {
      applyFixes(sr);
      buttonCount += sr.querySelectorAll('.m-btn').length;
    }

    return buttonCount;
  };

  const tryApplyFixes = (): boolean => {
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    if (!isMobile) {
      return true; // Not mobile, no fixes needed
    }

    const topShadowRoot = (
      element as unknown as { shadowRoot: ShadowRoot | null }
    ).shadowRoot;
    if (!topShadowRoot) {
      return false; // Shadow root not ready
    }

    const buttonCount = applyToAllShadowRoots();

    // Set up observer on top-level shadow root for future changes
    const existingObserver = (
      topShadowRoot as unknown as { _mobileObserver?: MutationObserver }
    )._mobileObserver;
    if (!existingObserver) {
      const observer = new MutationObserver(() => {
        applyToAllShadowRoots();
      });
      observer.observe(topShadowRoot, {
        childList: true,
        subtree: true,
      });
      (
        topShadowRoot as unknown as { _mobileObserver?: MutationObserver }
      )._mobileObserver = observer;
    }

    // Need at least 3 buttons (FILL EXAMPLE, CLEAR, TRY) to consider complete
    return buttonCount >= 3;
  };

  // Always apply fixes regardless of viewport (let CSS handle visibility)
  // This ensures fixes are ready when user resizes to mobile
  const applyFixesUnconditionally = (): boolean => {
    const topShadowRoot = (
      element as unknown as { shadowRoot: ShadowRoot | null }
    ).shadowRoot;
    if (!topShadowRoot) {
      return false; // Shadow root not ready
    }

    const buttonCount = applyToAllShadowRoots();

    // Set up observer on top-level shadow root for future changes
    const existingObserver = (
      topShadowRoot as unknown as { _mobileObserver?: MutationObserver }
    )._mobileObserver;
    if (!existingObserver) {
      const observer = new MutationObserver(() => {
        applyToAllShadowRoots();
      });
      observer.observe(topShadowRoot, {
        childList: true,
        subtree: true,
      });
      (
        topShadowRoot as unknown as { _mobileObserver?: MutationObserver }
      )._mobileObserver = observer;
    }

    // Need at least 3 buttons (FILL EXAMPLE, CLEAR, TRY) to consider complete
    return buttonCount >= 3;
  };

  // Try immediately
  if (applyFixesUnconditionally()) return;

  // Retry with increasing delays (RapiDoc loads spec asynchronously)
  // Need longer delays - RapiDoc fully renders after spec is loaded
  const delays = [100, 300, 500, 1000, 1500, 2000, 3000, 5000];
  let attempt = 0;

  const retry = (): void => {
    if (attempt >= delays.length) {
      return;
    }
    setTimeout(() => {
      if (!applyFixesUnconditionally()) {
        attempt++;
        retry();
      }
    }, delays[attempt]);
  };

  retry();

  // Also reapply on resize
  window.addEventListener('resize', () => {
    tryApplyFixes();
  });
}

/**
 * Watch for theme changes and update RapiDoc element
 */
function watchThemeChanges(container: HTMLElement): CleanupFn {
  let currentElement: HTMLElement | null =
    container.querySelector(RAPIDOC_ELEMENT);

  const handleThemeChange = (): void => {
    if (currentElement) {
      applyTheme(currentElement);
    }
  };

  // Watch stylesheet changes (Hugo theme.js enables/disables stylesheets)
  const styleObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.target instanceof HTMLLinkElement &&
        mutation.target.title?.includes('theme')
      ) {
        handleThemeChange();
        break;
      }
    }
  });

  const head = document.querySelector('head');
  if (head) {
    styleObserver.observe(head, {
      attributes: true,
      attributeFilter: ['disabled'],
      subtree: true,
    });
  }

  // Watch localStorage changes from other tabs
  const storageHandler = (event: StorageEvent): void => {
    if (event.key === 'influxdata_docs_preferences' && event.newValue) {
      try {
        const prefs = JSON.parse(event.newValue);
        if (prefs.theme) {
          handleThemeChange();
        }
      } catch (error) {
        console.error('[RapiDoc Mini] Failed to parse preferences:', error);
      }
    }
  };

  window.addEventListener('storage', storageHandler);

  // Return cleanup function
  return (): void => {
    styleObserver.disconnect();
    window.removeEventListener('storage', storageHandler);
  };
}

/**
 * Show error message in container
 */
function showError(container: HTMLElement, message: string): void {
  container.innerHTML = `
    <div class="api-operation-error">
      <p><strong>Error loading API documentation</strong></p>
      <p>${message}</p>
    </div>
  `;
}

/**
 * Initialize RapiDoc Mini component
 */
export default async function RapiDocMini({
  component,
}: ComponentOptions): Promise<CleanupFn | void> {
  try {
    // Get configuration from data attributes
    const specUrl = component.dataset.specUrl;
    const matchPaths = component.dataset.matchPaths;
    const title = component.dataset.title;

    if (!specUrl) {
      console.error('[RapiDoc Mini] No data-spec-url attribute provided');
      showError(component, 'No API specification configured.');
      return;
    }

    // Load RapiDoc Mini from CDN (memoized)
    try {
      await loadRapiDocScript();
    } catch (error) {
      console.error('[RapiDoc Mini] Failed to load from CDN:', error);
      showError(
        component,
        'Failed to load API viewer. Please refresh the page.'
      );
      return;
    }

    // Create and append RapiDoc Mini element
    const rapiDocElement = createRapiDocElement(specUrl, matchPaths, title);
    component.appendChild(rapiDocElement);

    // Inject custom styles into shadow DOM to remove borders/spacing
    injectShadowStyles(rapiDocElement);

    // Apply responsive fixes for mobile (modifies inline styles directly)
    applyResponsiveFixes(rapiDocElement);

    // Watch for theme changes and return cleanup function
    return watchThemeChanges(component);
  } catch (error) {
    console.error('[RapiDoc Mini] Component initialization error:', error);
    showError(component, 'API viewer failed to initialize.');
  }
}
