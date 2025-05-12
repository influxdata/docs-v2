export default function SearchInteractions({ searchInput }) {
  const contentWrapper = document.querySelector('.content-wrapper');
  const dropdownMenu = document.querySelector('.ds-dropdown-menu');

  // Fade content wrapper when focusing on search input
  searchInput.addEventListener('focus', () => {
    // Using CSS transitions instead of jQuery's fadeTo for better performance
    contentWrapper.style.opacity = '0.35';
    contentWrapper.style.transition = 'opacity 300ms';
  });

  // Hide search dropdown when leaving search input
  searchInput.addEventListener('blur', () => {
    contentWrapper.style.opacity = '1';
    contentWrapper.style.transition = 'opacity 200ms';
    
    // Hide dropdown menu
    if (dropdownMenu) {
      dropdownMenu.style.display = 'none';
    }
  });
}