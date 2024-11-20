// Import parameters passed from the calling page to js.Build.
import * as themeStyleHelpers from './theme-style-helpers.js';
import ThemeStyleSettings from './ThemeSettings.js';
import ThemePreference from './ThemePreference.js';

// Initialize components to load as early as possible
ThemePreference();

// Expose libraries and components within a namespaced object (for backwards compatibility or testing)
if (typeof window.influxdatadocs === 'undefined') {
  window.influxdatadocs = {};
}

window.influxdatadocs = {
  ...themeStyleHelpers,
  ThemePreference,
  ThemeStyleSettings,
  ...window.influxdatadocs,
};
