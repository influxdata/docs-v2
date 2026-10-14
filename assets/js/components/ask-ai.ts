import { adaptKapaSidebar } from './kapa-sidebar.js';
import { pageSourceGroups, widgetAttributes } from './ask-ai-config.js';

interface OpenOptions {
  mode: 'ai';
  query: string;
  submit: false;
}
interface KapaBootstrap {
  (event: string, listener: (data?: unknown) => void, action?: 'remove'): void;
  render(options: { onRender: () => void }): void;
}
interface KapaWidget extends KapaBootstrap {
  open(options: OpenOptions): void;
  close(): void;
  setSourceGroupIDs(ids: string[]): void;
  updateConfig(attributes: Record<string, string>): void;
}
declare global {
  interface Window {
    Kapa?: unknown;
  }
}
interface Request {
  query: string;
  groups: string[];
  origin: HTMLElement;
}
type State =
  | { kind: 'ready' }
  | { kind: 'error'; message: string }
  | { kind: 'loading' | 'opening' | 'open'; request: Request };

function isBootstrap(value: unknown): value is KapaBootstrap {
  return (
    typeof value === 'function' &&
    'render' in value &&
    typeof value.render === 'function'
  );
}

function isWidget(value: unknown): value is KapaWidget {
  return (
    isBootstrap(value) &&
    'open' in value &&
    typeof value.open === 'function' &&
    'close' in value &&
    typeof value.close === 'function' &&
    'setSourceGroupIDs' in value &&
    typeof value.setSourceGroupIDs === 'function' &&
    'updateConfig' in value &&
    typeof value.updateConfig === 'function'
  );
}

function layoutAttributes(): Record<string, string> {
  return {
    modalSize: innerWidth > 1440 ? '386px' : '360px',
    modalFullScreenOnMobile: String(innerWidth <= 600),
    modalInnerPointerEvents: innerWidth >= 1280 ? 'none' : 'auto',
  };
}
function updateLayout(api: KapaWidget): void {
  const attributes = Object.fromEntries(
    Object.entries(layoutAttributes()).map(([key, value]) => [
      `data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      value,
    ])
  );
  api.updateConfig(attributes);
}

/** Opens one widget through the page entry points. */
export default function AskAI({ component }: { component: HTMLElement }): void {
  const headerButton =
    document.querySelector<HTMLButtonElement>('.ask-ai-button');
  if (!headerButton) return;
  const launcher = headerButton;
  const announcement = component;
  let state: State = { kind: 'ready' };
  let rendered: KapaWidget | null = null;
  let bootstrap: KapaBootstrap | null = null;
  let readiness: Promise<KapaWidget> | null = null;
  let pendingTimer = 0;
  let readinessFrame = 0;
  let disposeAdapter = () => {};
  let returnFocus: HTMLElement = launcher;
  function present(): void {
    document.body.dataset.askAiState = state.kind;
    document.dispatchEvent(new Event('ask-ai-state-change'));
    const busy = state.kind === 'loading' || state.kind === 'opening';
    document
      .querySelectorAll<HTMLButtonElement>('[data-ask-ai-action="open"]')
      .forEach((button) => {
        button.setAttribute('aria-disabled', String(busy));
        button.setAttribute('aria-busy', String(busy));
      });
    announcement.textContent =
      state.kind === 'error' ? state.message : busy ? 'Opening Ask AI…' : '';
  }
  function fail(): void {
    clearTimeout(pendingTimer);
    state = {
      kind: 'error',
      message: 'Ask AI could not open. Try again.',
    };
    present();
    if (rendered) rendered.close();
    (returnFocus.isConnected ? returnFocus : launcher).focus({
      preventScroll: true,
    });
  }
  function opened(): void {
    if (state.kind !== 'opening') return;
    state = { kind: 'open', request: state.request };
    clearTimeout(pendingTimer);
    present();
  }
  function closed(): void {
    if (state.kind === 'error') return;
    clearTimeout(pendingTimer);
    state = { kind: 'ready' };
    present();
    const origin =
      returnFocus.isConnected && returnFocus.getClientRects().length
        ? returnFocus
        : launcher;
    origin.focus({ preventScroll: true });
  }
  function ensureReady(): Promise<KapaWidget> {
    if (rendered) return Promise.resolve(rendered);
    if (readiness) return readiness;
    readiness = new Promise<KapaWidget>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://widget.kapa.ai/kapa-widget.bundle.js';
      script.async = true;
      Object.assign(script.dataset, widgetAttributes(), layoutAttributes());
      script.onerror = () => {
        script.remove();
        reject(new Error('Widget script failed'));
      };
      function initialize(): void {
        // Loading the bundle precedes its asynchronous API initialization.
        if (!isBootstrap(window.Kapa)) {
          readinessFrame = requestAnimationFrame(initialize);
          return;
        }
        const api = window.Kapa;
        bootstrap = api;
        function rollback(error: unknown): void {
          api('onModalOpen', opened, 'remove');
          api('onModalClose', closed, 'remove');
          if ('unmount' in api && typeof api.unmount === 'function')
            api.unmount();
          reject(error);
        }
        try {
          api('onModalOpen', opened);
          api('onModalClose', closed);
          api.render({
            onRender: () => {
              const host = document.querySelector<HTMLElement>(
                '#kapa-widget-container'
              );
              if (!host || !isWidget(api)) {
                rollback(new Error('Widget container changed'));
                return;
              }
              disposeAdapter = adaptKapaSidebar(host, fail);
              rendered = api;
              resolve(api);
            },
          });
        } catch (error) {
          rollback(error);
        }
      }
      if (bootstrap) initialize();
      else {
        script.onload = initialize;
        document.head.append(script);
      }
    }).catch((error) => {
      readiness = null;
      throw error;
    });
    return readiness;
  }
  async function requestOpen(request: Request): Promise<void> {
    if (
      state.kind === 'loading' ||
      state.kind === 'opening' ||
      state.kind === 'open'
    )
      return;
    returnFocus = request.origin;
    state = { kind: 'loading', request };
    present();
    try {
      const api = await Promise.race([
        ensureReady(),
        new Promise<never>((_, reject) => {
          pendingTimer = window.setTimeout(
            () => reject(new Error('Widget readiness timed out')),
            30000
          );
        }),
      ]);
      clearTimeout(pendingTimer);
      if (state.kind !== 'loading' || state.request !== request) return;
      updateLayout(api);
      api.setSourceGroupIDs(request.groups);
      state = { kind: 'opening', request };
      present();
      pendingTimer = window.setTimeout(fail, 10000);
      api.open({ mode: 'ai', query: request.query, submit: false });
    } catch {
      fail();
    }
  }
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest<HTMLElement>(
      '[data-ask-ai-action="open"], .ask-ai-open'
    );
    if (!trigger) return;
    event.preventDefault();
    const groupIds = trigger.dataset.sourceGroupIds;
    void requestOpen({
      query: trigger.dataset.query || '',
      groups: groupIds
        ? groupIds
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
        : pageSourceGroups(),
      origin: trigger.isConnected ? trigger : launcher,
    });
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const origin =
        document.activeElement instanceof HTMLElement &&
        document.activeElement !== document.body
          ? document.activeElement
          : launcher;
      void requestOpen({
        query: '',
        groups: pageSourceGroups(),
        origin,
      });
    }
  });
  window.addEventListener('resize', () => {
    if (rendered) updateLayout(rendered);
    if (state.kind === 'open' && innerWidth < 1280) {
      const root = document.querySelector('#kapa-widget-container')?.shadowRoot;
      if (root && document.activeElement !== root.host)
        root
          .querySelector<HTMLElement>('textarea')
          ?.focus({ preventScroll: true });
    }
  });
  window.addEventListener(
    'pagehide',
    () => {
      clearTimeout(pendingTimer);
      cancelAnimationFrame(readinessFrame);
      disposeAdapter();
    },
    { once: true }
  );
  present();
}
