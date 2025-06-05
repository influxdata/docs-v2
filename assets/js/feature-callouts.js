/*
  This feature is designed to callout new features added to the documentation
  CSS is required for the callout bubble to determine look and position, but the
  element must have the `callout` class and a unique id.
  Callouts are treated as notifications and use the notification cookie API in
  assets/js/cookies.js.
*/

// Get notification ID
function getCalloutID (el) {
  return $(el).attr('id');
}

// Hide a callout and update the cookie with the viewed callout
function hideCallout (calloutID) {
  if (!window.LocalStorageAPI.notificationIsRead(calloutID)) {
    window.LocalStorageAPI.setNotificationAsRead(calloutID, 'callout');
    $(`#${calloutID}`).fadeOut(200);
  }
}

// Show the url feature callouts on page load
$(document).ready(function () {
  $('.feature-callout').each(function () {
    const calloutID = getCalloutID($(this));

    if (!window.LocalStorageAPI.notificationIsRead(calloutID, 'callout')) {
      $(`#${calloutID}.feature-callout`)
        .fadeIn(300)
        .removeClass('start-position');
    }
  });
});

// Hide the InfluxDB URL selector callout
// $('button.url-trigger, #influxdb-url-selector .close').click(function () {
//   hideCallout('influxdb-url-selector');
// });
