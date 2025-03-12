import $ from 'jquery';
import { switchStyle } from './theme-style-helpers.js';

export default function ThemeLightDarkSwitch() {
  $('#theme-switch-light').on('click', function(event) {
    event.preventDefault();
    switchStyle('light-theme');
  });

  $('#theme-switch-dark').on('click', function(event) {
    event.preventDefault();
    switchStyle('dark-theme');
  });
}
