import Theme from './theme.js';

export default function ThemeSwitch(element) {
  document.querySelectorAll(`.theme-switch-light`).forEach((button) => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      Theme({ style: 'light-theme' });
    });
  });

  document.querySelectorAll(`.theme-switch-dark`).forEach((button) => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      Theme({ style: 'dark-theme' });
    });
  });
}
