// assets/js/main.js

// Import dependencies that we still need to load in the global scope
import $ from 'jquery';

/** Import modules that are not components.
 * TODO: Refactor these into single-purpose component modules.
 */
import * as apiLibs from './api-libs.js';
import * as codeControls from './code-controls.js';
import * as contentInteractions from './content-interactions.js';
import * as datetime from './datetime.js';
import { delay } from './helpers.js';
import { InfluxDBUrl } from './influxdb-url.js';
import * as localStorage from './services/local-storage.js';
import * as modals from './modals.js';
import * as notifications from './notifications.js';
import * as pageContext from './page-context.js';
import * as pageFeedback from './page-feedback.js';
import * as tabbedContent from './tabbed-content.js';
import * as v3Wayfinding from './v3-wayfinding.js';

/** Import component modules
 *  The component pattern organizes JavaScript, CSS, and HTML for a specific UI element or interaction:
 *  - HTML: my-component.html
 *  - CSS: my-component.css
 *  - JavaScript: my-component.js
 * The JavaScript is ideally a single-purpose module that exports a single default function to initialize the component and handle any component interactions.
 */
import AskAITrigger from './ask-ai-trigger.js';
import CodePlaceholder from './code-placeholders.js';
import { CustomTimeTrigger } from './custom-timestamps.js';
import Diagram from './components/diagram.js';
import DocSearch from './components/doc-search.js';
import FeatureCallout from './feature-callouts.js';
import FluxGroupKeysDemo from './flux-group-keys.js';
import FluxInfluxDBVersionsTrigger from './flux-influxdb-versions.js';
import FormatSelector from './components/format-selector.ts';
import InfluxDBVersionDetector from './influxdb-version-detector.ts';
import KeyBinding from './keybindings.js';
import ListFilters from './list-filters.js';
import ProductSelector from './version-selector.js';
import ReleaseToc from './release-toc.js';
import { SearchButton } from './search-button.js';
import SidebarSearch from './components/sidebar-search.js';
import { SidebarToggle } from './sidebar-toggle.js';
import Theme from './theme.js';
import ThemeSwitch from './theme-switch.js';
import ApiNav from './components/api-nav.ts';
import ApiScalar from './components/api-scalar.ts';
import ApiTabs from './components/api-tabs.ts';
import ApiToc from './components/api-toc.ts';

/**
 * Component Registry
 * A central registry that maps component names to their constructor functions.
 * Add new components to this registry as they are created or migrated from non-component modules.
 * This allows for:
 * 1. Automatic component initialization based on data-component attributes
 * 2. Centralized component management
 * 3. Easy addition/removal of components
 * 4. Simplified testing and debugging
 */
const componentRegistry = {
  'ask-ai-trigger': AskAITrigger,
  'code-placeholder': CodePlaceholder,
  'custom-time-trigger': CustomTimeTrigger,
  diagram: Diagram,
  'doc-search': DocSearch,
  'feature-callout': FeatureCallout,
  'flux-group-keys-demo': FluxGroupKeysDemo,
  'flux-influxdb-versions-trigger': FluxInfluxDBVersionsTrigger,
  'format-selector': FormatSelector,
  'influxdb-version-detector': InfluxDBVersionDetector,
  keybinding: KeyBinding,
  'list-filters': ListFilters,
  'product-selector': ProductSelector,
  'release-toc': ReleaseToc,
  'search-button': SearchButton,
  'sidebar-search': SidebarSearch,
  'sidebar-toggle': SidebarToggle,
  theme: Theme,
  'theme-switch': ThemeSwitch,
  'api-nav': ApiNav,
  'api-scalar': ApiScalar,
  'api-tabs': ApiTabs,
  'api-toc': ApiToc,
};

/**
 * Initialize global namespace for documentation JavaScript
 * Exposes core modules for debugging, testing, and backwards compatibility
 */
function initGlobals() {
  if (typeof window.influxdatadocs === 'undefined') {
    window.influxdatadocs = {};
  }

  // Expose modules to the global object for debugging, testing, and backwards compatibility
  window.influxdatadocs.delay = delay;
  window.influxdatadocs.localStorage = window.LocalStorageAPI = localStorage;
  window.influxdatadocs.pageContext = pageContext;
  window.influxdatadocs.toggleModal = modals.toggleModal;
  window.influxdatadocs.componentRegistry = componentRegistry;

  // Re-export jQuery to global namespace for legacy scripts
  if (typeof window.jQuery === 'undefined') {
    window.jQuery = window.$ = $;
  }

  return window.influxdatadocs;
}

/**
 * Initialize components based on data-component attributes
 * @param {Object} globals - The global influxdatadocs namespace
 */
function initComponents(globals) {
  const components = document.querySelectorAll('[data-component]');

  components.forEach((component) => {
    const componentName = component.getAttribute('data-component');
    const ComponentConstructor = componentRegistry[componentName];

    if (ComponentConstructor) {
      // Initialize the component and store its instance in the global namespace
      try {
        // Prepare component options
        const options = { component };

        const instance = ComponentConstructor(options);
        globals[componentName] = ComponentConstructor;

        // Optionally store component instances for future reference
        if (!globals.instances) {
          globals.instances = {};
        }

        if (!globals.instances[componentName]) {
          globals.instances[componentName] = [];
        }

        globals.instances[componentName].push({
          element: component,
          instance,
        });
      } catch (error) {
        console.error(
          `Error initializing component "${componentName}":`,
          error
        );
      }
    } else {
      console.warn(`Unknown component: "${componentName}"`);
    }
  });
}

/**
 * Initialize all non-component modules
 */
function initModules() {
  modals.initialize();
  apiLibs.initialize();
  codeControls.initialize();
  contentInteractions.initialize();
  datetime.initialize();
  InfluxDBUrl();
  notifications.initialize();
  pageFeedback.initialize();
  tabbedContent.initialize();
  v3Wayfinding.initialize();
}

/**
 * Main initialization function
 */
function init() {
  // Initialize global namespace and expose core modules
  const globals = initGlobals();

  // Initialize non-component UI modules
  initModules();

  // Initialize components from registry
  initComponents(globals);
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export public API
export { initGlobals, componentRegistry };
