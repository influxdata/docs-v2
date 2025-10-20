import { getPreference, setPreference } from './services/local-storage.js';

const PROPS = {
  style_preference_name: 'theme',
  style_cookie_duration: 30, // number of days
  style_domain: 'docs.influxdata.com',
};

// Get the user's theme preference
function getPreferredTheme() {
  return `${getPreference(PROPS.style_preference_name)}-theme`;
}

function switchStyle({ styles_element, css_title }) {
  // Disable all other theme stylesheets
  styles_element
    .querySelectorAll('link[rel*="stylesheet"][title*="theme"]')
    .forEach(function (link) {
      link.disabled = true;
    });

  // Enable the stylesheet with the specified title
  const link = styles_element.querySelector(
    `link[rel*="stylesheet"][title="${css_title}"]`
  );
  link && (link.disabled = false);

  setPreference(PROPS.style_preference_name, css_title.replace(/-theme/, ''));
}

function setVisibility(component) {
  component.style.visibility = 'visible';
}

export default function Theme({ component, style }) {
  if (style == undefined) {
    style = getPreferredTheme();
  }
  style && switchStyle({ styles_element: document, css_title: style });

  // Check for the data attribute and set visibility if needed
  if (component.dataset?.themeCallback === 'setVisibility') {
    setVisibility(component);
  }
}
