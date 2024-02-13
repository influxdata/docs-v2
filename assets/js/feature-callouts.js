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
  if (notificationIsRead(calloutID) != true) {
    setNotificationAsRead(calloutID, 'callout');
    $(`#${calloutID}`).fadeOut(200);
  }
}

// Show the url feature callouts on page load
$('.feature-callout').each(function () {
  calloutID = calloutID($(this));

  if (notificationIsRead(calloutID, 'callout') != true) {
    $(`#${calloutID}.feature-callout`)
      .fadeIn(300)
      .removeClass('start-position');
  }
});

// Hide the InfluxDB URL selector callout
$('button.url-trigger, #influxdb-url-selector .close').click(function () {
  hideCallout('influxdb-url-selector');
});
