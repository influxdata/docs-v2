// assets/js/main.js

// If you need to pass parameters from the calling Hugo page, you can import them here like so:
// import * as pageParams from '@params';

/** Import modules that are not components.
 * TODO: Refactor these into single-purpose component modules.
 */
// import * as codeblocksPreferences from './api-libs.js';
// import * as datetime from './datetime.js';
// import * as featureCallouts from './feature-callouts.js';
import * as apiLibs from './api-libs.js';
import * as codeControls from './code-controls.js';
import * as contentInteractions from './content-interactions.js';
import { delay } from './helpers.js';
import { InfluxDBUrl } from './influxdb-url.js';
import * as localStorage from './local-storage.js'; 
import * as modals from './modals.js';
import * as notifications from './notifications.js';
import * as pageContext from './page-context.js';
import * as pageFeedback from './page-feedback.js';
import * as tabbedContent from './tabbed-content.js';
import * as v3Wayfinding from './v3-wayfinding.js';
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
import AskAITrigger from './ask-ai-trigger.js';
import { CustomTimeTrigger } from './custom-timestamps.js';
import { SearchButton } from './search-button.js';
import { SidebarToggle } from './sidebar-toggle.js';
import Theme from './theme.js';
import ThemeSwitch from './theme-switch.js';
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

// Expose libraries and components within a namespaced object (for backwards compatibility or testing)
// Expose libraries and components within a namespaced object (for backwards compatibility or testing)



document.addEventListener('DOMContentLoaded', function () {
  if (typeof window.influxdatadocs === 'undefined') {
    window.influxdatadocs = {};
  }

  // Expose modules to the global object for debugging, testing, and backwards compatibility for non-ES6 modules.
  window.influxdatadocs.delay = delay;
  window.influxdatadocs.localStorage = window.LocalStorageAPI = localStorage;
  window.influxdatadocs.pageContext = pageContext;
  window.influxdatadocs.toggleModal = modals.toggleModal;

  // On content loaded, initialize (not-component-ready) UI interaction modules
  // To differentiate these from component-ready modules, these modules typically export an initialize function that wraps UI interactions and event listeners.
  modals.initialize();
  apiLibs.initialize();
  codeControls.initialize();
  contentInteractions.initialize();
  InfluxDBUrl();
  notifications.initialize();
  pageFeedback.initialize();
  tabbedContent.initialize();
  v3Wayfinding.initialize();

  /** Initialize components
   Component Structure: Each component is structured as a jQuery anonymous function that listens for the document ready state.
  Initialization in main.js: Each component is called in main.js inside a jQuery document ready function to ensure they are initialized when the document is ready.
  Note: These components should *not* be called directly in the HTML.
  */
  const components = document.querySelectorAll('[data-component]');
  components.forEach((component) => {
    const componentName = component.getAttribute('data-component');
    switch (componentName) {
      case 'ask-ai-trigger':
        AskAITrigger({ component });
        window.influxdatadocs[componentName] = AskAITrigger;
        break;
      case 'custom-time-trigger':
        CustomTimeTrigger({ component });
        window.influxdatadocs[componentName] = CustomTimeTrigger;
        break;
      case 'search-button':
        SearchButton({ component });
        window.influxdatadocs[componentName] = SearchButton;
        break;
      case 'sidebar-toggle':
        SidebarToggle({ component });
        window.influxdatadocs[componentName] = SidebarToggle;
        break;
      case 'theme':
        Theme({ component });
        window.influxdatadocs[componentName] = Theme;
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
        case 'theme-switch':
          ThemeSwitch({ component });
          window.influxdatadocs[componentName] = ThemeSwitch;
          break;
      default:
        console.warn(`Unknown component: ${componentName}`);
    }
  });
});
