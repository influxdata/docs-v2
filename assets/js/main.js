// assets/js/main.js

import $ from 'jquery';

// If you need to pass parameters from the calling Hugo page, you can import them here like so:
// import * as pageParams from '@params';

/** Import modules that are not components.
 * TODO: Refactor these into single-purpose component modules.
 */
import * as codeblocksPreferences from './api-libs.js';
import * as datetime from './datetime.js';
import * as featureCallouts from './feature-callouts.js';
import * as homeInteractions from './home-interactions.js';
import { getUrls, getReferrerHost, InfluxDBUrl } from './influxdb-url.js';
import * as keybindings from './keybindings.js';
import * as listFilters from './list-filters.js';
import { Modal } from './modal.js';
import * as notifications from './notifications.js';
import * as releaseTOC from './release-toc.js';
import * as scroll from './scroll.js';
import { TabbedContent } from './tabbed-content.js';

/** Import UI Component-like Modules
 * Following a pattern similar to frameworks like React, a component is a
 * single-purpose module for a specific UI element or interaction.
 * Ideally, a module should export a single function that initializes HTML component behavior and handles state changes or interactions.
 */
import ApiReferencePage from './api-reference/ApiReferencePage.js';
import CodeControls from './code-controls.js';
import ContentInteractions from './content-interactions.js';
import CustomTimestamps from './custom-timestamps.js';
import FluxGroupKeysExample from './FluxGroupKeysExample.js';
import FluxInfluxDBVersionsModal from './flux-influxdb-versions.js';
import PageFeedback from './page-feedback.js';
import SearchInput from './SearchInput.js';
import Sidebar from './Sidebar.js';
import V3Wayfinding from './v3-wayfinding.js';
import VersionSelector from './version-selector.js';
import ThemeLightDarkSwitch from './ThemeLightDarkToggle.js';

/** Initialize components
 Component Structure: Each component is structured as a jQuery anonymous function that listens for the document ready state.
 Initialization in main.js: Each component is called in main.js inside a jQuery document ready function to ensure they are initialized when the document is ready.
 Note: These components should *not* be called directly in the HTML.
 */
document.addEventListener('DOMContentLoaded', () => {
  //ThemePreference();
});

$(function () {
  ApiReferencePage();
  CodeControls();
  ContentInteractions();
  CustomTimestamps();
  FluxGroupKeysExample();
  FluxInfluxDBVersionsModal();
  InfluxDBUrl();
  Modal();
  PageFeedback();
  SearchInput();
  Sidebar();
  TabbedContent();
  ThemeLightDarkSwitch();
  V3Wayfinding();
  //VersionSelector();
});

// Expose libraries and components within a namespaced object (for backwards compatibility or testing)
if (typeof window.influxdatadocs === 'undefined') {
  window.influxdatadocs = {};
}
window.influxdatadocs = {
  ApiReferencePage,
  codeblocksPreferences,
  CodeControls,
  ContentInteractions,
  CustomTimestamps,
  datetime,
  featureCallouts,
  FluxGroupKeysExample,
  FluxInfluxDBVersionsModal,
  getUrls,
  homeInteractions,
  keybindings,
  listFilters,
  Modal,
  notifications,
  PageFeedback,
  releaseTOC,
  getReferrerHost,
  scroll,
  SearchInput,
  Sidebar,
  TabbedContent,
  ThemeLightDarkSwitch,
  V3Wayfinding,
  VersionSelector,
  ...window.influxdatadocs,
};
