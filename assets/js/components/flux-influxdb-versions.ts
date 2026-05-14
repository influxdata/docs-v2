/**
 * Flux InfluxDB Versions Trigger
 *
 * Wires the "InfluxDB support" page-action button on Flux stdlib pages
 * to the InfluxDB versions modal (`#flux-influxdb-versions`).
 *
 * USAGE:
 *   <button data-component="flux-influxdb-versions-trigger"
 *           data-action="open">InfluxDB support</button>
 *
 * Behavior:
 *   - Click: toggles the modal and pushes `?view=influxdb-support` into
 *     the URL (preserves any hash).
 *   - On load: if `?view=...` is present, opens the modal automatically.
 *   - At init: trims unused color-key list items and replaces the
 *     version tables with a "no support" message when no InfluxDB
 *     version supports the current Flux package/function.
 *
 * The color-key + empty-state logic operates on the modal DOM, which
 * still uses jQuery selectors elsewhere in the codebase. Keeping that
 * dependency here is intentional and out of scope for the trigger port.
 */

import { toggleModal } from '../modals.js';

// jQuery is loaded globally by main.js and exposed as window.$. Declare
// it here so TypeScript can resolve `$` calls without requiring @types/jquery
// (which is excluded from the repo's .gitignore as a generated .d.ts).
declare const $: (selector: string) => {
  length: number;
  find: (selector: string) => { length: number };
  remove: () => void;
  prepend: (content: string) => void;
};

interface ComponentOptions {
  component: HTMLElement;
}

const FLUX_MODAL_SELECTOR = '.modal-content#flux-influxdb-versions';
const FLUX_MODAL_ID = '#flux-influxdb-versions';

interface PresentKeys {
  pending: boolean;
  deprecated: boolean;
  supported: boolean;
}

function keysPresent(): PresentKeys {
  const list = $(`${FLUX_MODAL_SELECTOR} .version-list`);
  return {
    pending: list.find('.pending').length !== 0,
    deprecated: list.find('.deprecated').length !== 0,
    supported: list.find('.supported').length !== 0,
  };
}

function openFluxVersionModal(queryParams: URLSearchParams): void {
  const anchor = window.location.hash;
  toggleModal(FLUX_MODAL_ID);
  queryParams.set('view', 'influxdb-support');
  window.history.replaceState(
    {},
    '',
    `${location.pathname}?${queryParams}${anchor}`
  );
}

export default function FluxInfluxDBVersionsTrigger({
  component,
}: ComponentOptions) {
  const pageType = document.title.includes('package') ? 'package' : 'function';

  // Trim color-key list items + render empty state. Modal-DOM logic
  // preserved verbatim from the JS predecessor (still jQuery-based).
  if ($(FLUX_MODAL_SELECTOR).length > 0) {
    const presentKeys = keysPresent();

    if (!presentKeys.pending) {
      $(`${FLUX_MODAL_SELECTOR} .color-key #pending-key`).remove();
    }
    if (!presentKeys.deprecated) {
      $(`${FLUX_MODAL_SELECTOR} .color-key #deprecated-key`).remove();
    }
    if (!presentKeys.pending && !presentKeys.deprecated) {
      $(`${FLUX_MODAL_SELECTOR} .color-key`).remove();
    }

    if (Object.values(presentKeys).every((v) => !v)) {
      $(
        `${FLUX_MODAL_SELECTOR} .influxdb-versions > :not(".more-info")`
      ).remove();
      $(`${FLUX_MODAL_SELECTOR} .influxdb-versions`).prepend(
        `<p class="no-support">No versions of InfluxDB currently support this ${pageType}.</p>`
      );
    }
  }

  const queryParams = new URLSearchParams(window.location.search);

  // Auto-open if URL carries a `view` param (any value triggers,
  // matching the JS predecessor's `!== null` guard).
  if (queryParams.get('view') !== null) {
    openFluxVersionModal(queryParams);
  }

  // Element-agnostic click target: the trigger is either the component
  // element itself (when it carries data-action="open") or a child
  // that does.
  const trigger =
    component.dataset.action === 'open'
      ? component
      : component.querySelector<HTMLElement>('[data-action="open"]');

  trigger?.addEventListener('click', () => openFluxVersionModal(queryParams));
}
