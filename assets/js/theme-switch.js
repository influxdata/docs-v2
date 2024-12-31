import Theme from './theme.js';

export default function ThemeSwitch(element) {
  document.getElementsByClassName(`theme-switch-light`).on('click', function(event) {
    event.preventDefault();
    Theme({ style: 'light-theme' });
  });

  document.getElementsByClassName(`theme-switch-dark`).on('click', function(event) {
    event.preventDefault();
    Theme({ style: 'dark-theme' });
  });
}
