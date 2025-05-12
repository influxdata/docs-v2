import Theme from './theme.js';

export default function ThemeSwitch({ component }) {
  if ( component == undefined) {
    component = document;
  }
  component.querySelectorAll(`.theme-switch-light`).forEach((button) => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      Theme({component, style: 'light-theme' });
    });
  });

  component.querySelectorAll(`.theme-switch-dark`).forEach((button) => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      Theme({component, style: 'dark-theme' });
    });
  });
}
