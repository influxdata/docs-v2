/*
  This feature is designed to callout new features added to the documentation
  CSS is required for the callout bubble to determine look and position, but the
  element must have the `callout` class and a unique id.
  Callouts are treated as notifications and use the notification cookie API in
  assets/js/cookies.js.
*/

import $ from 'jquery';
import * as LocalStorageAPI from './local-storage.js';

// Get notification ID
function getCalloutID(el) {
  return $(el).attr('id');
}

// Hide a callout and update the cookie with the viewed callout
function hideCallout(calloutID) {
  if (!LocalStorageAPI.notificationIsRead(calloutID)) {
    LocalStorageAPI.setNotificationAsRead(calloutID, 'callout');
    $(`#${calloutID}`).fadeOut(200);
  }
}

// Show the url feature callouts on page load
export default function FeatureCallout({ component }) {
  const calloutID = getCalloutID($(component));

  if (LocalStorageAPI.notificationIsRead(calloutID, 'callout')) {
    $(`#${calloutID}.feature-callout`)
      .fadeIn(300)
      .removeClass('start-position');
  }
}
