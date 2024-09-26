import { getPreference } from './cookies.js';
import { switchStyle } from './theme-style-helpers.js';
import ThemeSettings from './ThemeSettings.js';

function setStyleFromCookie () {
  const css_title = `${getPreference(ThemeSettings.style_preference_name)}-theme`;
  if (css_title !== 'undefined-theme') {
    switchStyle(css_title);
  }
}

export default function ThemePreference() {
  setStyleFromCookie();
}
