import { toggleSidebar } from './sidebar-toggle.js';

export function SearchButton({ component }) {
  component.querySelector('[data-action="toggle"]')
    .addEventListener('click', () => {
      toggleSidebar('sidebar-open');
      document.getElementById('algolia-search-input').focus();
      return false;
    });
}