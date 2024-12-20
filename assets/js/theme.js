import ThemeModeSwitch from './ThemeModeSwitch.js';

// Initialize components
ThemeModeSwitch({});

// Expose libraries and components within a namespaced object (for backwards compatibility or testing)
if (typeof window.influxdatadocs === 'undefined') {
  window.influxdatadocs = {};
}

window.influxdatadocs = {
  ThemeModeSwitch,
  ...window.influxdatadocs,
};
