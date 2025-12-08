/**
 * API Navigation Component
 *
 * Handles collapsible navigation groups in the API sidebar.
 * Features:
 * - Toggle expand/collapse on group headers
 * - ARIA accessibility support
 * - Keyboard navigation
 *
 * Usage:
 * <nav class="api-nav" data-component="api-nav">
 *   <div class="api-nav-group">
 *     <button class="api-nav-group-header" aria-expanded="false">
 *       Group Title
 *     </button>
 *     <ul class="api-nav-group-items">
 *       ...
 *     </ul>
 *   </div>
 * </nav>
 */

interface ComponentOptions {
  component: HTMLElement;
}

/**
 * Initialize API Navigation component
 */
export default function ApiNav({ component }: ComponentOptions): void {
  const headers = component.querySelectorAll<HTMLButtonElement>(
    '.api-nav-group-header'
  );

  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const isOpen = header.classList.toggle('is-open');
      header.setAttribute('aria-expanded', String(isOpen));

      const items = header.nextElementSibling;
      if (items) {
        items.classList.toggle('is-open', isOpen);
      }
    });

    // Keyboard support - Enter and Space already work for buttons
    // but add support for arrow keys to navigate between groups
    header.addEventListener('keydown', (event: KeyboardEvent) => {
      const allHeaders = Array.from(headers);
      const currentIndex = allHeaders.indexOf(header);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (currentIndex < allHeaders.length - 1) {
            allHeaders[currentIndex + 1].focus();
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (currentIndex > 0) {
            allHeaders[currentIndex - 1].focus();
          }
          break;
        case 'Home':
          event.preventDefault();
          allHeaders[0].focus();
          break;
        case 'End':
          event.preventDefault();
          allHeaders[allHeaders.length - 1].focus();
          break;
      }
    });
  });
}
