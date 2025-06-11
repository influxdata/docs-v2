import SearchInteractions from '../utils/search-interactions.js';

export default function SidebarSearch({ component }) {
  const searchInput = component.querySelector('.sidebar--search-field');
  SearchInteractions({ searchInput });
}
