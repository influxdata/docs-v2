/** Isolate the Website Widget's modal behavior from the desktop page. */
export function adaptKapaSidebar(
  host: HTMLElement,
  onIncompatible?: () => void
): () => void {
  const root = host.shadowRoot || host;
  const desktop = matchMedia('(min-width: 1280px)');
  function present(): void {
    const dialog = root.querySelector<HTMLElement>('#kapa-modal-content');
    if (!dialog) {
      if (root.querySelector('[role="dialog"]')) onIncompatible?.();
      return;
    }
    const value = String(!desktop.matches);
    if (dialog.getAttribute('aria-modal') !== value) {
      dialog.setAttribute('aria-modal', value);
    }
  }
  function allowPageTraversal(event: Event): void {
    if (
      !(event instanceof KeyboardEvent) ||
      event.key !== 'Tab' ||
      !desktop.matches
    )
      return;
    const dialog = root.querySelector('#kapa-modal-content');
    if (dialog && event.composedPath().includes(dialog)) {
      // Keep the native Tab action; stop only the vendor's modal Tab handler.
      event.stopImmediatePropagation();
    }
  }
  root.addEventListener('keydown', allowPageTraversal, true);
  const observer = new MutationObserver(present);
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-modal', 'id', 'role'],
  });
  desktop.addEventListener('change', present);
  present();
  return () => {
    observer.disconnect();
    desktop.removeEventListener('change', present);
    root.removeEventListener('keydown', allowPageTraversal, true);
  };
}
