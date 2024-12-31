import { getPreference, setPreference } from './local-storage.js';

const PROPS = {
  style_preference_name: 'theme',
  style_cookie_duration: 30, // number of days
  style_domain: 'docs.influxdata.com',
};

function getPreferredTheme () {
  return `${getPreference(PROPS.style_preference_name)}-theme`;
}

function switchStyle(css_title) {
  // Disable all other theme stylesheets
  document.querySelectorAll('link[rel*="stylesheet"][title*="theme"]')
  .forEach(function (link) {
    link.disabled = true;
  });

  // Enable the stylesheet with the specified title
  const link = document.querySelector(`link[rel*="stylesheet"][title="${css_title}"]`);
  link && (link.disabled = false);

  setPreference(PROPS.style_preference_name, css_title.replace(/-theme/, ''));
}

export default function Theme({ style }) {
  if (style == undefined) {
    style = getPreferredTheme();
  }
  style && switchStyle(style);
}
