/**
 * RapiDoc API Documentation Component
 *
 * Initializes the full RapiDoc renderer with theme synchronization.
 * This is the component version of the inline JavaScript from rapidoc.html.
 *
 * Features:
 * - Theme detection from Hugo's stylesheet toggle system
 * - Automatic theme synchronization when user toggles dark/light mode
 * - Shadow DOM manipulation to hide unwanted UI elements
 * - CSS custom property injection for styling
 *
 * Usage:
 * <div data-component="api-rapidoc" data-spec-url="/path/to/spec.yml"></div>
 *
 * The component expects a <rapi-doc> element to already exist in the container
 * (created by Hugo template) or will wait for it to be added.
 */

import { getPreference } from '../services/local-storage.js';

interface ComponentOptions {
  component: HTMLElement;
}

interface ThemeColors {
  theme: 'light' | 'dark';
  bgColor: string;
  textColor: string;
  headerColor: string;
  primaryColor: string;
  navBgColor: string;
  navTextColor: string;
  navHoverBgColor: string;
  navHoverTextColor: string;
  navAccentColor: string;
  codeTheme: string;
}

type CleanupFn = () => void;

/**
 * Get current theme from localStorage (source of truth for Hugo theme system)
 */
function getTheme(): 'dark' | 'light' {
  const theme = getPreference('theme');
  return theme === 'dark' ? 'dark' : 'light';
}

/**
 * Get theme colors matching Hugo SCSS variables
 */
function getThemeColors(isDark: boolean): ThemeColors {
  if (isDark) {
    return {
      theme: 'dark',
      bgColor: '#14141F', // $grey10 ($article-bg in dark theme)
      textColor: '#D4D7DD', // $g15-platinum
      headerColor: '#D4D7DD',
      primaryColor: '#a0a0ff',
      navBgColor: '#1a1a2a',
      navTextColor: '#D4D7DD',
      navHoverBgColor: '#252535',
      navHoverTextColor: '#ffffff',
      navAccentColor: '#a0a0ff',
      codeTheme: 'monokai',
    };
  }

  return {
    theme: 'light',
    bgColor: '#ffffff', // $g20-white
    textColor: '#2b2b2b',
    headerColor: '#020a47', // $br-dark-blue
    primaryColor: '#020a47',
    navBgColor: '#f7f8fa',
    navTextColor: '#2b2b2b',
    navHoverBgColor: '#e8e8f0',
    navHoverTextColor: '#020a47',
    navAccentColor: '#020a47',
    codeTheme: 'prism',
  };
}

/**
 * Apply theme to RapiDoc element
 */
function applyTheme(rapiDoc: HTMLElement): void {
  const isDark = getTheme() === 'dark';
  const colors = getThemeColors(isDark);

  rapiDoc.setAttribute('theme', colors.theme);
  rapiDoc.setAttribute('bg-color', colors.bgColor);
  rapiDoc.setAttribute('text-color', colors.textColor);
  rapiDoc.setAttribute('header-color', colors.headerColor);
  rapiDoc.setAttribute('primary-color', colors.primaryColor);
  rapiDoc.setAttribute('nav-bg-color', colors.navBgColor);
  rapiDoc.setAttribute('nav-text-color', colors.navTextColor);
  rapiDoc.setAttribute('nav-hover-bg-color', colors.navHoverBgColor);
  rapiDoc.setAttribute('nav-hover-text-color', colors.navHoverTextColor);
  rapiDoc.setAttribute('nav-accent-color', colors.navAccentColor);
  rapiDoc.setAttribute('code-theme', colors.codeTheme);
}

/**
 * Set custom CSS properties on RapiDoc element
 */
function setInputBorderStyles(rapiDoc: HTMLElement): void {
  rapiDoc.style.setProperty('--border-color', '#00A3FF');
}

/**
 * Hide unwanted elements in RapiDoc shadow DOM
 */
function hideExpandCollapseControls(rapiDoc: HTMLElement): void {
  const maxAttempts = 10;
  let attempts = 0;

  const tryHide = (): void => {
    attempts++;

    try {
      const shadowRoot = rapiDoc.shadowRoot;
      if (!shadowRoot) {
        if (attempts < maxAttempts) {
          setTimeout(tryHide, 500);
        }
        return;
      }

      // Find elements containing "Expand all" / "Collapse all" and hide them
      const allElements = shadowRoot.querySelectorAll('*');
      let hiddenCount = 0;

      allElements.forEach((element) => {
        const text = element.textContent || '';

        if (text.includes('Expand all') || text.includes('Collapse all')) {
          (element as HTMLElement).style.display = 'none';
          if (element.parentElement) {
            element.parentElement.style.display = 'none';
          }
          hiddenCount++;
        }
      });

      // Hide "Overview" headings
      const headings = shadowRoot.querySelectorAll('h1, h2, h3, h4');
      headings.forEach((heading) => {
        const text = (heading.textContent || '').trim();
        if (text.includes('Overview')) {
          (heading as HTMLElement).style.display = 'none';
          hiddenCount++;
        }
      });

      // Inject CSS as backup
      const style = document.createElement('style');
      style.textContent = `
        .section-gap.section-tag,
        [id*="overview"],
        .regular-font.section-gap:empty,
        h1:empty, h2:empty, h3:empty {
          display: none !important;
        }
      `;
      shadowRoot.appendChild(style);

      if (hiddenCount === 0 && attempts < maxAttempts) {
        setTimeout(tryHide, 500);
      }
    } catch {
      if (attempts < maxAttempts) {
        setTimeout(tryHide, 500);
      }
    }
  };

  setTimeout(tryHide, 500);
}

/**
 * Watch for theme changes via stylesheet toggle
 */
function watchThemeChanges(rapiDoc: HTMLElement): CleanupFn {
  const handleThemeChange = (): void => {
    applyTheme(rapiDoc);
  };

  // Watch stylesheet disabled attribute changes (Hugo theme.js toggles this)
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.target instanceof HTMLLinkElement &&
        mutation.target.title?.includes('theme')
      ) {
        handleThemeChange();
        break;
      }
      // Also watch data-theme changes as fallback
      if (mutation.attributeName === 'data-theme') {
        handleThemeChange();
      }
    }
  });

  // Observe head for stylesheet changes
  observer.observe(document.head, {
    attributes: true,
    attributeFilter: ['disabled'],
    subtree: true,
  });

  // Observe documentElement for data-theme changes
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return (): void => {
    observer.disconnect();
  };
}

/**
 * Initialize RapiDoc component
 */
export default function ApiRapiDoc({
  component,
}: ComponentOptions): CleanupFn | void {
  // Find the rapi-doc element inside the container
  const rapiDoc = component.querySelector('rapi-doc') as HTMLElement | null;

  if (!rapiDoc) {
    console.warn('[API RapiDoc] No rapi-doc element found in container');
    return;
  }

  // Apply initial theme
  applyTheme(rapiDoc);

  // Set custom CSS properties
  if (customElements && customElements.whenDefined) {
    customElements.whenDefined('rapi-doc').then(() => {
      setInputBorderStyles(rapiDoc);
      setTimeout(() => setInputBorderStyles(rapiDoc), 500);
    });
  } else {
    setInputBorderStyles(rapiDoc);
    setTimeout(() => setInputBorderStyles(rapiDoc), 500);
  }

  // Hide unwanted UI elements
  hideExpandCollapseControls(rapiDoc);

  // Watch for theme changes
  return watchThemeChanges(rapiDoc);
}
