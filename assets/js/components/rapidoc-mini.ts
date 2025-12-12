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

// Use full RapiDoc for proper auth tooltip behavior (mini version has limited features)
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
 * Create RapiDoc Mini element with configuration
 */
function createRapiDocElement(
  specUrl: string,
  matchPaths?: string
): HTMLElement {
  const element = document.createElement(RAPIDOC_ELEMENT);

  // Core attributes
  element.setAttribute('spec-url', specUrl);
  // matchPaths format: "method /path" (e.g., "post /write")
  if (matchPaths) {
    element.setAttribute('match-paths', matchPaths);
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

  // Layout - use 'read' style for proper auth element layout
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

  // Authentication display - allow-authentication enables proper layout
  element.setAttribute('allow-authentication', 'true');
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
    const rapiDocElement = createRapiDocElement(specUrl, matchPaths);
    component.appendChild(rapiDocElement);

    // Watch for theme changes and return cleanup function
    return watchThemeChanges(component);
  } catch (error) {
    console.error('[RapiDoc Mini] Component initialization error:', error);
    showError(component, 'API viewer failed to initialize.');
  }
}
