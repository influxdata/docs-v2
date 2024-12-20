// Import parameters passed from the calling page to js.Build.
import ThemeSwitch from './ThemeSwitch.js';

// Initialize components to load as early as possible
ThemeSwitch();

// Expose libraries and components within a namespaced object (for backwards compatibility or testing)
if (typeof window.influxdatadocs === 'undefined') {
  window.influxdatadocs = {};
}

window.influxdatadocs = {
  ThemeSwitch,
  ...window.influxdatadocs,
};
