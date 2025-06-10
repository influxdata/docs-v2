import { CLOUD_URLS } from './influxdb-url.js';
import * as localStorage from './services/local-storage.js';
import {
  context,
  host,
  hostname,
  path,
  protocol,
  referrer,
  referrerHost,
} from './page-context.js';

/**
 * Builds a referrer whitelist array that includes the current page host and all
 * values from the cloudUrls array defined in layouts/partials/footer/javascript.html
 */
const cloudUrls = CLOUD_URLS || [];
var referrerWhitelist = cloudUrls.concat(host);

// v3-wayfinding preference cookie name
var wayfindingPrefCookie = 'v3_wayfinding_show';

// Toggle the v3-wayfinding modal
function toggleWayfinding() {
  // Define v3-wayfinding elements
  var wayfindingModal = document.getElementById('v3-wayfinding-modal');
  wayfindingModal.classList.toggle('open');
}

// Toggle wayfinding modal preference cookie
function toggleWayfindingPreference() {
  if (localStorage.getPreference(wayfindingPrefCookie) === true) {
    localStorage.setPreference(wayfindingPrefCookie, false);
  } else {
    localStorage.setPreference(wayfindingPrefCookie, true);
  }
}

// Define the slideDown and slideUp animations
function slideDown(elem) {
  elem.style.height = `${elem.scrollHeight}px`;
  elem.style.opacity = 1;
}

function slideUp(elem) {
  elem.style.height = 0;
  elem.style.opacity = 0;
}

/**
 * Check to see if the v3-wayfinding modal should be opened:
 *  - Is the user coming from a non-whitelisted external referrer?
 *  - Has the user opted out of the wayfinding modal?
 */
function shouldOpenWayfinding() {
  // Extract the protocol and hostname of referrer
  const isExternalReferrer = !referrerWhitelist.includes(referrerHost);
  const preferToShow = localStorage.getPreference(wayfindingPrefCookie);

  // Only return true if all conditions are true
  return isExternalReferrer && preferToShow;
}

/**
 * Function that checks the wayfindingPrefCookie and sets the state of the
 * wayfinding checkbox input.
 */
function setWayfindingInputState() {
  const preferToShow = localStorage.getPreference(wayfindingPrefCookie);
  const wayfindingOptOutInput = document.getElementById(
    'v3-wayfinding-opt-out-input'
  );

  if (preferToShow === false) {
    wayfindingOptOutInput.checked = true;
  }
}

function submitWayfindingData(engine, action) {
  // Build lp using page data and engine data
  const lp = `ioxwayfinding,host=${hostname},path=${path},referrer=${referrer},engine=${engine} action="${action}"`;

  // Send the wayfinding data
  const xhr = new XMLHttpRequest();
  xhr.open(
    'POST',
    'https://j32dswat7l.execute-api.us-east-1.amazonaws.com/prod/wayfinding'
  );
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Access-Control-Allow-Origin', `${protocol}//${host}`);
  xhr.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send(lp);

  return false;
}

function initialize() {
  const wayfindingVersions = ['serverless', 'cloud'];
  if (!wayfindingVersions.includes(context)) {
    return;
  }

  // When the user clicks on the stay button, close modal, submit data, and stay on the page.
  var wayfindingStay = document.getElementById('v3-wayfinding-stay');
  wayfindingStay.onclick = function (event) {
    var engine = wayfindingStay.dataset.engine;
    var action = 'stay';

    event.preventDefault();
    submitWayfindingData(engine, action);
    toggleWayfinding();
  };

  // When the user clicks on the switch button, submit data and follow link.
  var wayfindingSwitch = document.getElementById('v3-wayfinding-switch');
  wayfindingSwitch.onclick = function () {
    var engine = wayfindingSwitch.dataset.engine;
    var action = 'switch';

    submitWayfindingData(engine, action);
  };

  // When the user clicks on the "X" wayfinding close element, close the modal
  var wayfindingClose = document.getElementById('v3-wayfinding-close');
  wayfindingClose.onclick = function () {
    toggleWayfinding();
  };

  var wayfindingOptOut = document.getElementById('v3-wayfinding-opt-out');
  wayfindingOptOut.onclick = function () {
    toggleWayfindingPreference();
  };

  // Toggle instructions for finding out which storage engine you're using
  var wayfindingFindOutToggle = document.getElementById('find-out-toggle');
  wayfindingFindOutToggle.onclick = function (event) {
    event.preventDefault();
    var wayfindingFindOutInstructions = document.getElementById(
      'find-out-instructions'
    );
    if (wayfindingFindOutInstructions.classList.contains('open')) {
      slideUp(wayfindingFindOutInstructions);
      wayfindingFindOutInstructions.classList.remove('open');
    } else {
      slideDown(wayfindingFindOutInstructions);
      wayfindingFindOutInstructions.classList.add('open');
    }
  };

  // Set the state of the show wayfinding input checkbox
  setWayfindingInputState();

  /**
   * Check to see if the referrer is in the referrer whitelist, otherwise trigger
   * the v3-wayfinding modal.
   */
  if (shouldOpenWayfinding()) {
    toggleWayfinding();
  }
}

export { initialize };
