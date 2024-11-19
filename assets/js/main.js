// assets/js/main.js
/** Import existing JS as "libraries" for now
 * until we can refactor them into component modules.
 */
import * as codeblocksPreferences from './api-libs.js'
import * as codeControls from './code-controls.js';
import * as cookies from './cookies.js';
import * as datetime from './datetime.js';
import * as featureCallouts from './feature-callouts.js';
import * as fluxGroupKeys from './flux-group-keys.js';
import * as fluxInfluxDBVersions from './flux-influxdb-versions.js';
import * as homeInteractions from './home-interactions.js';
import * as influxDBUrls from './influxdb-url.js';
import * as keybindings from './keybindings.js';
import * as listFilters from './list-filters.js';
import * as modals from './modals.js';
import * as notifications from './notifications.js';
import * as pageFeedback from './page-feedback.js';
import * as releaseTOC from './release-toc.js';
import * as scroll from './scroll.js';
import * as searchInteractions from './search-interactions.js';
import * as sidebarToggle from './sidebar-toggle.js';
import * as tabbedContent from './tabbed-content.js';
import * as themes from './docs-themes.js';
import * as v3wayfinding from './v3-wayfinding.js';


/** UI Component-like Modules **/
/** Following the React JSX component pattern, a component is a module
 * that exports a single function
 * encapsulating the behavior of the component.
 * This function should
 * be called in a DOMContentLoaded event listener to ensure that the
 * component is properly initialized.
*/
import ApiReferencePage from "./api-doc/ApiReferencePage.js";
import ContentInteractions from './content-interactions.js';
import FluxGroupKeys from './FluxGroupKeys.js';
import SearchInput from './search-interactions.js';
import Sidebar from './Sidebar.js'
import ThemeStyle from './ThemeStyle.js';
import VersionSelector from './version-selector.js';

// Import parameters passed from the calling page to js.Build.
import * as pageParams from '@params';

document.addEventListener('DOMContentLoaded', () => {
  // Expose libraries and components within a namespaced object.
  window.influxdatadocs = {
    ApiReferencePage,
    codeblocksPreferences,
    codeControls,
    ContentInteractions,
    cookies,
    datetime,
    featureCallouts,
    fluxGroupKeys,
    FluxGroupKeys,
    fluxInfluxDBVersions,
    homeInteractions,
    influxDBUrls,
    keybindings,
    listFilters,
    modals,
    notifications,
    pageFeedback,
    pageParams,
    releaseTOC,
    scroll,
    searchInteractions,
    SearchInput,
    Sidebar,
    sidebarToggle,
    tabbedContent,
    themes,
    ThemeStyle,
    v3wayfinding,
    VersionSelector,
  };
});