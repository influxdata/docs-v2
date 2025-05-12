import SearchInteractions from '../utils/search-interactions';

export default function SidebarSearch({ component }) {
  const searchInput = component.querySelector('.sidebar--search-field');
  SearchInteractions({ searchInput });
}