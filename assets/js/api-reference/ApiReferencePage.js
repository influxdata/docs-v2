import 'rapidoc';
import { getPreference } from '../cookies.js';
import { setServerUrl } from './index.js';

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
    'primary-color': '#2D87E2',
    'render-style': 'view',
    'show-header': 'false',
    'show-info': 'false',
    'theme': 'light',
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

function setFeatures(el) {
  const featureAttributes = {
    'allow-authentication': 'true',
    'allow-search': 'false',
  }

  for (const [key, value] of Object.entries(featureAttributes)) {
    el.setAttribute(key, value);
  }
}

export function onPreferenceChanged(e) {
  const apiPathDoc = document.getElementById('api-path-doc');
  if(apiPathDoc === null) return;
  setStyles(apiPathDoc);
  setServerUrl(apiPathDoc);
  setFeatures(apiPathDoc);
}

export default function ApiReferencePage() {
  const apiPathDoc = document.getElementById('api-path-doc');
  if(apiPathDoc === null) return;
  setStyles(apiPathDoc);
  setFeatures(apiPathDoc);
  setServerUrl(apiPathDoc);
  apiPathDoc.addEventListener('spec-loaded', (e) => {
    // Unhide the element once the spec is loaded--the only way to prevent a flash of Rapidoc's loading spinner
    const inlineStyles = apiPathDoc.getAttribute('style').replace('display: none;', '');
    apiPathDoc.setAttribute('style', inlineStyles);
  });
  cookieStore.addEventListener('change', (e) => {
    if(e.changed) {
      onPreferenceChanged(e, apiPathDoc);
    }
  });
  apiPathDoc.loadSpec(JSON.parse(apiPathDoc.dataset.openapiSpec));
}