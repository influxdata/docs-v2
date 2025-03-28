import $ from 'jquery';
import { toggleModal } from './modals.js';

/*
Interactions related to the Flux/InfluxDB version modal
*/

const fluxInfluxDBModal = '.modal-content#flux-influxdb-versions';

// Check for deprecated or pending versions
function keysPresent() {
  var list = $(fluxInfluxDBModal + ' .version-list');

  return {
    pending: list.find('.pending').length !== 0,
    deprecated: list.find('.deprecated').length !== 0,
    supported: list.find('.supported').length !== 0,
  };
}

function openFluxVersionModal(queryParams) {
  const anchor = window.location.hash;
  toggleModal('#flux-influxdb-versions');
  queryParams?.set('view', 'influxdb-support');
  window.history.replaceState(
    {},
    '',
    `${location.pathname}?${queryParams}${anchor}`
  );
}

export default function FluxInfluxDBVersionsTrigger({ component }) {
  const $component = $(component);

  const pageType = $(document).attr('title').includes('package')
    ? 'package'
    : 'function';

  // Only execute if the Flux/InfluxDB modal is present in the DOM
  if ($(fluxInfluxDBModal).length > 0) {
    var presentKeys = keysPresent();

    // Remove color key list items if the colors/states are present in the version list
    if (presentKeys.pending === false) {
      $(fluxInfluxDBModal + ' .color-key #pending-key').remove();
    }
    if (presentKeys.deprecated === false) {
      $(fluxInfluxDBModal + ' .color-key #deprecated-key').remove();
    }
    if (presentKeys.pending === false && presentKeys.deprecated === false) {
      $(fluxInfluxDBModal + ' .color-key').remove();
    }

    // If no versions are supported, remove and replace InfluxDB version tables
    if (Object.values(presentKeys).every((value) => !value)) {
      $(
        fluxInfluxDBModal + ' .influxdb-versions > :not(".more-info")'
      ).remove();
      $(fluxInfluxDBModal + ' .influxdb-versions').prepend(
        `<p class="no-support">No versions of InfluxDB currently support this ${pageType}.</p>`
      );
    }
  }

  // Open version modal and add query param
  const queryParams = new URLSearchParams(window.location.search);

  // // Check for the modal query param and open the modal if it exists
  if (queryParams.get('view') !== null) {
    openFluxVersionModal(queryParams);
  }

  // Open modal window on click
  $component
    .find('a[data-action="open"]:first')
    .on('click', () => openFluxVersionModal(queryParams));
}
