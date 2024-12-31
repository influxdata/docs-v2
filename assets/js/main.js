// assets/js/main.js

// If you need to pass parameters from the calling Hugo page, you can import them here like so:
// import * as pageParams from '@params';

/** Import modules that are not components.
 * TODO: Refactor these into single-purpose component modules.
 */
// import * as codeblocksPreferences from './api-libs.js';
// import * as datetime from './datetime.js';
// import * as featureCallouts from './feature-callouts.js';
// import * as homeInteractions from './home-interactions.js';
// import { getUrls, getReferrerHost, InfluxDBUrl } from './influxdb-url.js';
// import * as keybindings from './keybindings.js';
// import * as listFilters from './list-filters.js';
// import { Modal } from './modal.js';
// import { showNotifications } from './notifications.js';
// import ReleaseTOC from './release-toc.js';
// import * as scroll from './scroll.js';
// import { TabbedContent } from './tabbed-content.js';

/** Import component modules
 *  The component pattern organizes JavaScript, CSS, and HTML for a specific UI element or interaction:
 *  - HTML: my-component.html
 *  - CSS: my-component.css
 *  - JavaScript: my-component.js
 * The JavaScript is ideally a single-purpose module that exports a single default function to initialize the component and handle any component interactions.
 */

import AIChat from './ai-chat.js';
// import CodeControls from './code-controls.js';
// import ContentInteractions from './content-interactions.js';
// import CustomTimestamps from './custom-timestamps.js';
// import Diagram from './Diagram.js';
// import FluxGroupKeysExample from './FluxGroupKeysExample.js';
// import FluxInfluxDBVersionsModal from './flux-influxdb-versions.js';
// import PageFeedback from './page-feedback.js';
// import SearchInput from './SearchInput.js';
// import Sidebar from './Sidebar.js';
// import V3Wayfinding from './v3-wayfinding.js';
// import VersionSelector from './VersionSelector.js';
import Theme from './theme.js';
import ThemeSwitch from './theme-switch.js';

// Expose libraries and components within a namespaced object (for backwards compatibility or testing)
// Expose libraries and components within a namespaced object (for backwards compatibility or testing)
if (typeof window.influxdatadocs === 'undefined') {
  window.influxdatadocs = {};
}
window.influxdatadocs = Object.assign({}, window.influxdatadocs, {
  AIChat,
  // codeblocksPreferences,
  // CodeControls,
  // ContentInteractions,
  // CustomTimestamps,
  // datetime,
  // Diagram,
  // featureCallouts,
  // FluxGroupKeysExample,
  // FluxInfluxDBVersionsModal,
  // getUrls,
  // homeInteractions,
  // keybindings,
  // listFilters,
  // Modal,
  // showNotifications,
  // PageFeedback,
  // ReleaseTOC,
  // getReferrerHost,
  // scroll,
  // SearchInput,
  // showNotifications,
  // Sidebar,
  // TabbedContent,
  Theme,
  ThemeSwitch,
  // V3Wayfinding,
  // VersionSelector,
});

/** Initialize components
 Component Structure: Each component is structured as a jQuery anonymous function that listens for the document ready state.
 Initialization in main.js: Each component is called in main.js inside a jQuery document ready function to ensure they are initialized when the document is ready.
 Note: These components should *not* be called directly in the HTML.
 */

document.addEventListener('DOMContentLoaded', function () {
  const components = document.querySelectorAll('[data-component]');
  components.forEach(element => {
    const componentName = element.getAttribute('data-component');
    switch (componentName) {
      case 'Theme':
        Theme({});
        break;
        // CodeControls();
        // ContentInteractions();
        // CustomTimestamps();
        // Diagram();
        // FluxGroupKeysExample();
        // FluxInfluxDBVersionsModal();
        // InfluxDBUrl();
        // Modal();
        // PageFeedback();
        // ReleaseTOC();
        // SearchInput();
        // showNotifications();
        // Sidebar();
        // TabbedContent();
        // ThemeSwitch({});
        // V3Wayfinding();
        // VersionSelector();
        case 'ThemeSwitch':
          ThemeSwitch(element);
          break;
      default:
        console.warn(`Unknown component: ${componentName}`);
    }
  });
});
