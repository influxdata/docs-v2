/**
 * Scalar API Documentation Component
 *
 * Initializes the Scalar API reference viewer for OpenAPI documentation.
 * Features:
 * - Dynamic CDN loading of Scalar library
 * - Theme synchronization with site theme
 * - InfluxData brand colors
 * - Error handling and fallback UI
 *
 * Usage:
 * <div data-component="api-scalar" data-spec-path="/path/to/spec.yml"></div>
 */

import { getPreference } from '../services/local-storage.js';

interface ComponentOptions {
  component: HTMLElement;
}

interface ScalarConfig {
  url: string;
  forceDarkModeState?: 'dark' | 'light';
  layout?: 'classic' | 'modern';
  showSidebar?: boolean;
  hideDarkModeToggle?: boolean;
  hideSearch?: boolean;
  documentDownloadType?: 'none' | 'yaml' | 'json';
  hideModels?: boolean;
  hideTestRequestButton?: boolean;
  withDefaultFonts?: boolean;
  customCss?: string;
}

type ScalarCreateFn = (
  selector: string | HTMLElement,
  config: ScalarConfig
) => void;

declare global {
  interface Window {
    Scalar?: {
      createApiReference: ScalarCreateFn;
    };
  }
}

const SCALAR_CDN = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest';

/**
 * Load script dynamically
 */
function loadScript(src: string, timeout = 8000): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existing = Array.from(document.scripts).find(
      (s) => s.src && s.src.includes(src)
    );
    if (existing && window.Scalar?.createApiReference) {
      return resolve();
    }

    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.head.appendChild(script);

    // Fallback timeout
    setTimeout(() => {
      if (window.Scalar?.createApiReference) {
        resolve();
      } else {
        reject(new Error(`Timeout loading script: ${src}`));
      }
    }, timeout);
  });
}

/**
 * Get current theme from localStorage (source of truth for Hugo theme system)
 */
function getTheme(): 'dark' | 'light' {
  const theme = getPreference('theme');
  return theme === 'dark' ? 'dark' : 'light';
}

/**
 * Poll for Scalar availability
 */
function waitForScalar(maxAttempts = 50, interval = 100): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkInterval = setInterval(() => {
      attempts++;

      if (window.Scalar?.createApiReference) {
        clearInterval(checkInterval);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        reject(
          new Error(`Scalar not available after ${maxAttempts * interval}ms`)
        );
      }
    }, interval);
  });
}

/**
 * Initialize Scalar API reference
 */
async function initScalar(
  container: HTMLElement,
  specUrl: string
): Promise<void> {
  if (!window.Scalar?.createApiReference) {
    throw new Error('Scalar is not available');
  }

  // Clean up previous Scalar instance (important for theme switching)
  // Remove any Scalar-injected content and classes
  container.innerHTML = '';
  // Remove Scalar's dark-mode class from body if it exists
  document.body.classList.remove('dark-mode');

  const isDark = getTheme() === 'dark';

  window.Scalar.createApiReference(container, {
    url: specUrl,
    forceDarkModeState: getTheme(),
    layout: 'classic',
    showSidebar: false,
    hideDarkModeToggle: true,
    hideSearch: true,
    documentDownloadType: 'none',
    hideModels: false,
    hideTestRequestButton: false,
    withDefaultFonts: false,
    customCss: `
      :root {
        /* Typography - match Hugo docs site */
        --scalar-font: 'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --scalar-font-code: 'IBM Plex Mono', Monaco, Consolas, monospace;
        --scalar-font-size-base: 16px;
        --scalar-line-height: 1.65;

        /* InfluxData brand colors */
        --scalar-color-1: #F63C41;
        --scalar-color-2: #d32f34;
        --scalar-color-accent: #F63C41;

        /* Border radius */
        --scalar-radius: 4px;
        --scalar-radius-lg: 8px;

        /* Background and text colors - theme-aware */
        --scalar-background-1: ${isDark ? '#1a1a2e' : '#ffffff'};
        --scalar-background-2: ${isDark ? '#232338' : '#f7f8fa'};
        --scalar-background-3: ${isDark ? '#2d2d44' : '#f0f2f5'};
        --scalar-text-1: ${isDark ? '#e0e0e0' : '#2b2b2b'};
        --scalar-text-2: ${isDark ? '#a0a0a0' : '#545454'};
        --scalar-text-3: ${isDark ? '#888888' : '#757575'};
        --scalar-border-color: ${isDark ? '#3a3a50' : '#e0e0e0'};

        /* Heading colors */
        --scalar-heading-color: ${isDark ? '#ffffff' : '#2b2b2b'};
      }

      /* Match Hugo heading styles */
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--scalar-font);
        font-weight: 600;
        color: var(--scalar-heading-color);
        line-height: 1.25;
      }

      h1 { font-size: 2rem; }
      h2 { font-size: 1.5rem; margin-top: 2rem; }
      h3 { font-size: 1.25rem; margin-top: 1.5rem; }
      h4 { font-size: 1rem; margin-top: 1rem; }

      /* Body text size */
      p, li, td, th {
        font-size: 1rem;
        line-height: var(--scalar-line-height);
      }

      /* Code block styling */
      pre, code {
        font-family: var(--scalar-font-code);
        font-size: 0.875rem;
      }

      /* Hide section-content div */
      div.section-content {
        display: none !important;
      }
    `,
  });

  console.log(
    '[API Docs] Scalar initialized with spec:',
    specUrl,
    'theme:',
    getTheme()
  );
}

/**
 * Show error message in container
 */
function showError(container: HTMLElement, message: string): void {
  container.innerHTML = `<p class="error">${message}</p>`;
}

/**
 * Watch for Hugo theme changes via stylesheet manipulation
 * Hugo theme.js enables/disables link[title*="theme"] elements
 */
function watchThemeChanges(container: HTMLElement, specUrl: string): void {
  // Watch for stylesheet changes in the document
  const observer = new MutationObserver(() => {
    const currentTheme = getTheme();
    console.log('[API Docs] Theme changed to:', currentTheme);
    // Re-initialize Scalar with new theme
    initScalar(container, specUrl).catch((error) => {
      console.error(
        '[API Docs] Failed to re-initialize Scalar on theme change:',
        error
      );
    });
  });

  // Watch for changes to stylesheet link elements
  const head = document.querySelector('head');
  if (head) {
    observer.observe(head, {
      attributes: true,
      attributeFilter: ['disabled'],
      subtree: true,
    });
  }

  // Also watch for localStorage changes from other tabs
  window.addEventListener('storage', (event) => {
    if (event.key === 'influxdata_docs_preferences' && event.newValue) {
      try {
        const prefs = JSON.parse(event.newValue);
        if (prefs.theme) {
          const currentTheme = getTheme();
          console.log(
            '[API Docs] Theme changed via storage event to:',
            currentTheme
          );
          initScalar(container, specUrl).catch((error) => {
            console.error(
              '[API Docs] Failed to re-initialize Scalar on storage change:',
              error
            );
          });
        }
      } catch (error) {
        console.error(
          '[API Docs] Failed to parse localStorage preferences:',
          error
        );
      }
    }
  });
}

/**
 * Initialize API Scalar component
 */
export default async function ApiScalar({
  component,
}: ComponentOptions): Promise<void> {
  try {
    // Get spec path from data attribute
    const specPath = component.dataset.specPath;
    const cdn = component.dataset.cdn || SCALAR_CDN;

    if (!specPath) {
      console.error('[API Docs] No OpenAPI specification path provided');
      showError(
        component,
        'Error: No API specification configured for this page.'
      );
      return;
    }

    // Build full URL for spec (Scalar needs absolute URL)
    const specUrl = window.location.origin + specPath;

    // Load Scalar from CDN if not already loaded
    if (!window.Scalar?.createApiReference) {
      try {
        await loadScript(cdn);
      } catch (err) {
        console.error('[API Docs] Failed to load Scalar from CDN', err);
      }
    }

    // Wait for Scalar to be ready
    try {
      await waitForScalar();
    } catch (err) {
      console.error('[API Docs] Scalar failed to initialize', err);
      showError(component, 'Error: API viewer failed to load.');
      return;
    }

    // Initialize Scalar
    await initScalar(component, specUrl);

    // Watch for theme changes and re-initialize Scalar when theme changes
    watchThemeChanges(component, specUrl);
  } catch (err) {
    console.error('[API Docs] ApiScalar component error', err);
    showError(component, 'Error: API viewer failed to initialize.');
  }
}
