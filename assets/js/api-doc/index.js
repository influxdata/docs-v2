import 'rapidoc';
import { getPreference } from '../cookies.js';
import { getUrls } from '../influxdb-url.js';

function getUserPreferredUrl() {
  const urlName = getPreference('influxdb_url');
  return getUrls()[urlName];
}

export function setServerUrl(el) {
  const baseUrl = getUserPreferredUrl();
  el.setAttribute('server-url', baseUrl);
  el.setApiServer(baseUrl);
}

const darkThemeAttributes = {
  'theme': 'dark',
};

const lightThemeAttributes = {
  'theme': 'light',
};

export function setStyles(el) {
  let theme = getPreference('theme') || 'light';
  theme = theme.replace(/-theme/, '');
  let themeAttributes =  {
    'nav-accent-color': "",
    'nav-bg-color': "",
    'nav-hover-bg-color': "",
    'nav-hover-text-color': "",
    'nav-text-color': "",
    'primary-color': "#F63C41",
    'render-style': 'view',
    'show-header': 'false',
    'show-info': 'false',
    'style': 'height:100vh; width:100%',
  }
  switch (theme) {
    case 'light':
      themeAttributes = { ...themeAttributes, ...lightThemeAttributes };
      break;
    case 'dark':
      themeAttributes = { ...themeAttributes, ...darkThemeAttributes };
      break;
  }

  for (const [key, value] of Object.entries(themeAttributes)) {
    el.setAttribute(key, value);
  }
}

export function onPreferenceChanged(e) {
  const rapidocEl = document.getElementById('api-doc');
  if(rapidocEl === null) return;
  setStyles(rapidocEl);
  setServerUrl(rapidocEl);
}
