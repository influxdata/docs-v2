/*
Interactions related to the Flux/InfluxDB version modal
*/

const fluxInfluxDBModal = '.modal-content#flux-influxdb-versions'

// Check for deprecated or pending versions
function keysPresent() {
  var list = $(fluxInfluxDBModal + ' .version-list')

  return {
    pending: list.find('.pending').length !== 0,
    deprecated: list.find('.deprecated').length !== 0,
  }
}

// Only execute if the Flux/InfluxDB modal is present in the DOM
if ($(fluxInfluxDBModal).length > 0) {
  var presentKeys = keysPresent()

  // Remove color key list items if the colors/states are present in the version list
  if (presentKeys.pending === false) { $(fluxInfluxDBModal + ' .color-key #pending-key' ).remove() }
  if (presentKeys.deprecated === false) { $(fluxInfluxDBModal + ' .color-key #deprecated-key' ).remove() }
  if (presentKeys.pending === false && presentKeys.deprecated === false) { $(fluxInfluxDBModal + ' .color-key' ).remove() }
}


// Open version modal and add query param
const queryParams = new URLSearchParams(window.location.search);

function openFluxVersionModal() {
  const anchor = window.location.hash;

  toggleModal('#flux-influxdb-versions');
  queryParams.set('view', 'influxdb-support');
  window.history.replaceState({}, '', `${location.pathname}?${queryParams}${anchor}`);
};

// Check for the modal query param and open the modal if it exists
if (queryParams.get('view') !== null) {
  openFluxVersionModal();
};
