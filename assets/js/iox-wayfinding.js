// Store the host value for the current page
currentPageHost = window.location.href.match(/^(?:[^\/]*\/){2}[^\/]+/g)[0]

// Define iox-wayfinding elements
var wayfindingModal = document.getElementById('iox-wayfinding-modal');
var wayfindingClose = document.getElementById('iox-wayfinding-close');
var wayfindingStay = document.getElementById('iox-wayfinding-stay');
var wayfindingSwitch = document.getElementById('iox-wayfinding-switch');
var wayfindingOptOut = document.getElementById('iox-wayfinding-opt-out');
var wayfindingOptOutInput = document.getElementById('iox-wayfinding-opt-out-input');
var wayfindingFindOutToggle = document.getElementById('find-out-toggle');
var wayfindingFindOutInstructions = document.getElementById('find-out-instructions');

/**
 * Builds a referrer whitelist array that includes the current page host and all
 * values from the cloudUrls array defined in layouts/partials/footer/javascript.html
*/
var referrerWhitelist = cloudUrls.concat(currentPageHost);

// iox-wayfinding preference cookie name
var wayfindingPrefCookie = 'influx-iox-show-wayfinding'

// Toggle the iox-wayfinding modal
function toggleWayfinding() {
  wayfindingModal.classList.toggle("open");
}

// Toggle wayfinding modal preference cookie
function toggleWayfindingPreference() {
  if (Cookies.get(wayfindingPrefCookie) === 'true') {
    Cookies.set(wayfindingPrefCookie, 'false')
  } else {
    Cookies.set(wayfindingPrefCookie, 'true')
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
 * Check to see if the iox-wayfinding modal should be opened:
 *  - Is the user coming from a non-whitelisted external referrer?
 *  - Has the user opted out of the wayfinding modal?
*/ 
function shouldOpenWayfinding() {
  var isExternalReferrer = !referrerWhitelist.includes(referrerHost);
  var wayfindingOptedOut = Cookies.get(wayfindingPrefCookie) !== 'false';

  // Only return true if all conditions are true
  return isExternalReferrer && wayfindingOptedOut;
}

/**
 * Function that checks the wayfindingPrefCookie and sets the state of the
 * wayfinding checkbox input.
 */
function setWayfindingInputState() {
  var currentPreference = Cookies.get(wayfindingPrefCookie);

  if (currentPreference === 'false') {
    wayfindingOptOutInput.checked = true;
  }
}

function submitWayfindingData(engine, action) {
  
  const pageData = {
    host: location.hostname,
    path: location.pathname,
    referrer: (document.referrer === '') ? 'direct' : document.referrer,
  }

  // Build lp using page data and engine data
  const lp = `ioxwayfinding,host=${pageData.host},path=${pageData.path},referrer=${pageData.referrer},engine=${engine} action="${action}"`
  
  // Send the wayfinding data  
  xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://j32dswat7l.execute-api.us-east-1.amazonaws.com/prod/wayfinding');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Access-Control-Allow-Origin', `${location.protocol}//${location.host}`);
  xhr.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send(lp);

  return false;
}

// When the user clicks on the stay button, close modal, submit data, and stay on the page.
wayfindingStay.onclick = function(event) {
  var engine = wayfindingStay.dataset.engine;
  var action = 'stay';

  event.preventDefault();
  submitWayfindingData(engine, action)
  toggleWayfinding();
}

// When the user clicks on the switch button, submit data and follow link.
wayfindingSwitch.onclick = function(event) {
  var engine = wayfindingSwitch.dataset.engine;
  var action = 'switch';
  
  submitWayfindingData(engine, action)
}

// When the user clicks on the "X" wayfinding close element, close the modal
wayfindingClose.onclick = function(event) {
  toggleWayfinding();
}

wayfindingOptOut.onclick = function(event) {
  toggleWayfindingPreference();
}

// Toggle instructions for finding out which storage engine you're using
wayfindingFindOutToggle.onclick = function(event) {
  event.preventDefault();
  if (wayfindingFindOutInstructions.classList.contains('open')) {
    slideUp(wayfindingFindOutInstructions);
    wayfindingFindOutInstructions.classList.remove('open');
  } else {
    slideDown(wayfindingFindOutInstructions);
    wayfindingFindOutInstructions.classList.add('open');
  }
}

/** 
 * Check to see if the referrer is in the referrer whitelist, otherwise trigger
 * the iox-wayfinding modal.
 * This reuses the referrerHost variable defined in assets/js/influxdb-url.js
*/
if (shouldOpenWayfinding()) {
  toggleWayfinding();
}

// Set the state of the show wayfinding input checkbox
setWayfindingInputState();
