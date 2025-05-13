import { getPlatform } from './utils/user-agent-platform.js';

/**
 * Adds OS-specific class to component
 * @param {string} osClass - OS-specific class to add
 * @param {Object} options - Component options
 * @param {jQuery} options.$component - jQuery element reference
 */
function addOSClass(osClass, { $component }) {
  $component.addClass(osClass);
}

/**
 * Updates keybinding display based on detected platform
 * @param {Object} options - Component options
 * @param {jQuery} options.$component - jQuery element reference
 * @param {string} options.platform - Detected platform
 */
function updateKeyBindings({ $component, platform }) {
  const osx = $component.data('osx');
  const linux = $component.data('linux');
  const win = $component.data('win');
  
  let keybind;

  if (platform === 'other') {
    if (win !== linux) {
      keybind = `<code class="osx">${osx}</code> for macOS, <code>${linux}</code> for Linux, and <code>${win}</code> for Windows`;
    } else {
      keybind = `<code>${linux}</code> for Linux and Windows and <code class="osx">${osx}</code> for macOS`;
    }
  } else {
    keybind = `<code>${$component.data(platform)}</code>`;
  }

  $component.html(keybind);
}

/**
 * Initialize and render platform-specific keybindings
 * @param {Object} options - Component options
 * @param {HTMLElement} options.component - DOM element
 * @returns {void}
 */
export default function KeyBinding({ component }) {
  // Initialize keybindings
  const platform = getPlatform();
  const $component = $(component);
  
  addOSClass(platform, { $component });
  updateKeyBindings({ $component, platform });
}