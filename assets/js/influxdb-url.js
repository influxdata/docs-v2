var defaultUrl = "http://localhost:9999"

function getUrl() {
  var currentUrl = Cookies.get('influxdb_url')
  if (typeof currentUrl == 'undefined' ) {
    return defaultUrl
  } else {
    return currentUrl
  }
}

function updateUrls(currentUrl, newUrl) {
  if (typeof currentUrl != newUrl) {
    $(".article--content pre").each(function() {
      $(this).html($(this).html().replace(currentUrl,  newUrl));
    });
  }
}

function appendUrlSelector(currentUrl) {
  $(".article--content pre").each(function() {
    var code = $(this).html()
    if (code.includes(currentUrl)) {
      $(this).after("<div class='select-url'><a class='url-trigger' href='#'>InfluxDB URL</a></div>")
      $('.select-url').fadeIn(400)
    }
  });
}

function toggleModal() {
  $(".modal").fadeToggle(200).toggleClass("open")
}

function setRadioButton(currentUrl) {
  $('input[name="influxdb-loc"][value="' + currentUrl + '"]').prop("checked", true)
}

function storeUrl(newUrl) {
  Cookies.set('influxdb_url', newUrl)
}

$('input[name="influxdb-loc"]').change(function() {
  var newUrl = $(this).val()
  updateUrls(getUrl(), newUrl)
  storeUrl(newUrl)
})

// Update URLs on load
updateUrls(defaultUrl, getUrl())

// Append URL selector buttons to code blocks
appendUrlSelector(getUrl())

// Set active radio button on page load
setRadioButton(getUrl())

// Open and close modal window
$("#modal-close, .modal-overlay, .url-trigger").click(function(e) {
  e.preventDefault()
  toggleModal()
})
