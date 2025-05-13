/**
 * Manages search interactions for DocSearch integration
 * Uses MutationObserver to watch for dropdown creation
 */
export default function SearchInteractions({ searchInput }) {
  const contentWrapper = document.querySelector('.content-wrapper');
  let observer = null;
  let dropdownObserver = null;
  let dropdownMenu = null;
  
  // Fade content wrapper when focusing on search input
  function handleFocus() {
    contentWrapper.style.opacity = '0.35';
    contentWrapper.style.transition = 'opacity 300ms';
  }

  // Hide search dropdown when leaving search input
  function handleBlur(event) {
    // Only process blur if not clicking within dropdown
    const relatedTarget = event.relatedTarget;
    if (relatedTarget && (
        relatedTarget.closest('.algolia-autocomplete') || 
        relatedTarget.closest('.ds-dropdown-menu'))) {
      return;
    }
    
    contentWrapper.style.opacity = '1';
    contentWrapper.style.transition = 'opacity 200ms';
    
    // Hide dropdown if it exists
    if (dropdownMenu) {
      dropdownMenu.style.display = 'none';
    }
  }
  
  // Add event listeners
  searchInput.addEventListener('focus', handleFocus);
  searchInput.addEventListener('blur', handleBlur);
  
  // Use MutationObserver to detect when dropdown is added to the DOM
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        const newDropdown = document.querySelector('.ds-dropdown-menu:not([data-monitored])');
        if (newDropdown) {
          console.log('DocSearch dropdown detected');
          
          // Save reference to dropdown
          dropdownMenu = newDropdown;
          newDropdown.setAttribute('data-monitored', 'true');
          
          // Monitor dropdown removal/display changes
          dropdownObserver = new MutationObserver((dropdownMutations) => {
            for (const dropdownMutation of dropdownMutations) {
              if (dropdownMutation.type === 'attributes' && 
                  dropdownMutation.attributeName === 'style') {
                console.log('Dropdown style changed:', dropdownMenu.style.display);
              }
            }
          });
          
          // Observe changes to dropdown attributes (like style)
          dropdownObserver.observe(dropdownMenu, { 
            attributes: true,
            attributeFilter: ['style']
          });
          
          // Add event listeners to keep dropdown open when interacted with
          dropdownMenu.addEventListener('mousedown', (e) => {
            // Prevent blur on searchInput when clicking in dropdown
            e.preventDefault();
          });
        }
      }
    }
  });
  
  // Start observing the document body for dropdown creation
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  // Return cleanup function
  return function cleanup() {
    searchInput.removeEventListener('focus', handleFocus);
    searchInput.removeEventListener('blur', handleBlur);
    
    if (observer) {
      observer.disconnect();
    }
    
    if (dropdownObserver) {
      dropdownObserver.disconnect();
    }
  };
}