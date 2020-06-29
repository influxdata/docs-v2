var defaultUrl = "http://localhost:9999"
var elementSelector = ".article--content pre:not(.preserve)"

// Retrieve the selected URL from the influxdb_url session cookie
function getUrl() {
  var currentUrl = Cookies.get('influxdb_url')
  if (typeof currentUrl == 'undefined' ) {
    return defaultUrl
  } else {
    return currentUrl
  }
}

// Retrieve the previously selected URL from the influxdb_prev_url session cookie
// This is used to update URLs whenever you switch between browser tabs
function getPrevUrl() {
  var prevUrl = Cookies.get('influxdb_prev_url')
  if (typeof prevUrl == 'undefined' ) {
    return defaultUrl
  } else {
    return prevUrl
  }
}

// Iterate through code blocks and update InfluxDB urls
function updateUrls(currentUrl, newUrl) {
  if (typeof currentUrl != newUrl) {
    $(elementSelector).each(function() {
      $(this).html($(this).html().replace(currentUrl,  newUrl));
    });
  }
}

// Append the URL selector button to each codeblock with an InfluxDB URL
function appendUrlSelector(currentUrl) {
  $(elementSelector).each(function() {
    var code = $(this).html()
    if (code.includes(currentUrl)) {
      $(this).after("<div class='select-url'><a class='url-trigger' href='#'>Cloud or OSS?</a></div>")
      $('.select-url').fadeIn(400)
    }
  });
}

// Toggle the URL selector modal window
function toggleModal() {
  $(".modal").fadeToggle(200).toggleClass("open")
}

// Set the selected URL radio button to :checked
function setRadioButton(currentUrl) {
  $('input[name="influxdb-loc"][value="' + currentUrl + '"]').prop("checked", true)
}

// Store the InfluxDB URL session cookies – influxdb_url and influxdb_prev_url
function storeUrl(newUrl, prevUrl) {
  Cookies.set('influxdb_prev_url', prevUrl)
  Cookies.set('influxdb_url', newUrl)
}

// Store custom URL session cookie – influxdb_custom_url
function storeCustomUrl(customUrl) {
  Cookies.set('influxdb_custom_url', customUrl)
  $('input#custom[type=radio]').val(customUrl)
}

// Remove custom URL session cookie – influxdb_custom_url
function removeCustomUrl() {
  Cookies.remove('influxdb_custom_url')
}

// Preserve URLs in codeblocks that come just after or are inside a div
// with the class, .keep-url
function addPreserve() {
  $('.keep-url').each(function () {
    // For code blocks with no syntax highlighting
    $(this).next('pre').addClass('preserve')
    // For code blocks with syntax highlighting
    $(this).next('.highlight').find('pre').addClass('preserve')
    // For code blocks inside .keep-url div
    // Special use case for codeblocks generated from yaml data / frontmatter
    $(this).find('pre').addClass('preserve')
  })
}

// Update URLs when selected in the modal
$('input[name="influxdb-loc"]').change(function() {
  var newUrl = $(this).val()
  updateUrls(getUrl(), newUrl)
  storeUrl(newUrl, getUrl())
})

// Add the preserve tag to code blocks that shouldn't be udpated
addPreserve()

// Update URLs on load
updateUrls(defaultUrl, getUrl())

// Append URL selector buttons to code blocks
appendUrlSelector(getUrl())

// Update URLs whenever you focus on the browser tab
$(window).focus(function() {
  updateUrls(getPrevUrl(), getUrl())
  setRadioButton(getUrl())
});

// Toggle modal window on click
$("#modal-close, .modal-overlay, .url-trigger").click(function(e) {
  e.preventDefault()
  toggleModal()
})

// Show the feature callout on page load
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

// Trigger radio button on custom URL field focus
$('input#custom-url-field').focus(function(e) {
  $('input#custom[type="radio"]').trigger('click')
})

$("#custom-url").submit(function(e) {
  e.preventDefault();
  $('#modal-close').trigger('click')
});

// Store the custom InfluxDB URL when exiting the field
$('#custom-url-field').blur(function() {
  custUrl = $(this).val()
  if (custUrl.length > 0 ) {
    storeCustomUrl(custUrl)
    updateUrls(getUrl(), custUrl)
    storeUrl(custUrl, getPrevUrl())
  } else {
    $('input#custom').val('http://example.com:8080')
    removeCustomUrl();
    $('input[name="influxdb-loc"][value="' + defaultUrl + '"]').trigger('click')
  }
})

// Populate the custom InfluxDB URL field on page load
if ( Cookies.get('influxdb_custom_url') != undefined ) {
  $('input#custom').val(Cookies.get('influxdb_custom_url'))
  $('#custom-url-field').val(Cookies.get('influxdb_custom_url'))
}

// Set active radio button on page load
setRadioButton(getUrl())
