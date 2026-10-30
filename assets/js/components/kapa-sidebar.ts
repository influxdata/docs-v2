/** Isolate the Website Widget's modal behavior from the desktop page. */
export function adaptKapaSidebar(
  host: HTMLElement,
  onClose: () => void,
  onIncompatible?: () => void
): () => void {
  const root = host.shadowRoot || host;
  const desktop = matchMedia('(min-width: 1280px)');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'docs-ask-ai-close';
  close.setAttribute('aria-label', 'Close Ask AI');
  close.innerHTML = '<span class="icon-remove" aria-hidden="true"></span>';
  close.addEventListener('click', onClose);
  const style = document.createElement('style');
  style.textContent = `
    #kapa-modal-content .docs-ask-ai-close { display: none; }
    /* Mirror the site's icon-remove rule inside the widget's shadow root. */
    #kapa-modal-content .docs-ask-ai-close .icon-remove {
      font-family: 'icomoon-v2' !important;
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #kapa-modal-content .docs-ask-ai-close .icon-remove::before {
      content: "\\e933";
    }
    @media (max-width: 600px) {
      #kapa-modal-content .mantine-Modal-header:has(> .docs-ask-ai-close) {
        position: sticky;
        top: 0;
        z-index: 2;
        box-sizing: border-box;
        min-height: calc(60px + env(safe-area-inset-top, 0px));
        padding-top: calc(8px + env(safe-area-inset-top, 0px)) !important;
        padding-right: calc(60px + env(safe-area-inset-right, 0px)) !important;
      }
      #kapa-modal-content .mantine-Modal-header:has(> .docs-ask-ai-close) .mantine-Modal-close {
        display: none !important;
      }
      #kapa-modal-content .docs-ask-ai-close {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: calc(8px + env(safe-area-inset-top, 0px));
        right: calc(8px + env(safe-area-inset-right, 0px));
        width: 44px;
        height: 44px;
        padding: 0;
        box-sizing: border-box;
        border: 1px solid currentColor;
        border-radius: 8px;
        color: var(--mantine-color-text);
        background: var(--mantine-color-body);
        cursor: pointer;
      }
      #kapa-modal-content .docs-ask-ai-close:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }
    }
  `;
  function present(): void {
    const dialog = root.querySelector<HTMLElement>('#kapa-modal-content');
    if (!dialog) {
      if (root.querySelector('[role="dialog"]')) onIncompatible?.();
      return;
    }
    if (style.parentNode !== root) root.append(style);
    const header = dialog.querySelector('.mantine-Modal-header');
    if (header && close.parentNode !== header) header.append(close);
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
    close.removeEventListener('click', onClose);
    close.remove();
    style.remove();
  };
}
