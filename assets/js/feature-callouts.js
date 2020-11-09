// Show the url feature callout on page load
if ( Cookies.get('influxdb_url_selector_seen') != 'true' ) {
  $('#callout-url-selector').fadeIn(300).removeClass('start-position')
}

// Set feature cookie when the button is clicked
$('button.url-trigger, #callout-url-selector .close').click(function() {
  if ( Cookies.get('influxdb_url_selector_seen') != 'true') {
    Cookies.set('influxdb_url_selector_seen', 'true')
    $('#callout-url-selector').fadeOut(200)
  }
})