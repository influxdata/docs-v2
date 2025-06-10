////////////////////////////////////////////////////////////////////////////////
///////////////// Preferred Client Library programming language  ///////////////
////////////////////////////////////////////////////////////////////////////////
import { activateTabs, updateBtnURLs } from './tabbed-content.js';
import { getPreference, setPreference } from './services/local-storage.js';

function getVisitedApiLib() {
  const path = window.location.pathname.match(
    /client-libraries\/((?:v[0-9]|flight)\/)?([a-zA-Z0-9]*)/
  );
  return path && path.length && path[2];
}

function isApiLib() {
  return /\/client-libraries\//.test(window.location.pathname);
}

// Set the user's programming language (client library) preference.
function setApiLibPreference(preference) {
  setPreference('api_lib', preference);
}

// Retrieve the user's programming language (client library) preference.
function getApiLibPreference() {
  return getPreference('api_lib') || '';
}

function initialize() {
  // When visiting a client library page, set the api_lib preference
  if (isApiLib()) {
    var selectedApiLib = getVisitedApiLib();
    setPreference('api_lib', selectedApiLib);
  }

  // Activate code-tabs based on the cookie then override with query param.
  const tab = getApiLibPreference();
  ['.tabs, .code-tabs'].forEach(
    (selector) => activateTabs(selector, tab),
    updateBtnURLs(tab)
  );
}

export { initialize };
