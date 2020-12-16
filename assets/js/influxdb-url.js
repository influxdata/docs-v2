var placeholderUrls = {
  cloud: "https://cloud2.influxdata.com",
  oss: "http://localhost:8086"
}

var defaultUrls = {
  cloud: "https://us-west-2-1.aws.cloud2.influxdata.com",
  oss: "http://localhost:8086"
}

var elementSelector = ".article--content pre:not(.preserve)"

// Return the page context (cloud, oss/enterprise, other)
function context() {
  if (/\/influxdb\/cloud\//.test(window.location.pathname)) {
    return "cloud"
  } else if (/\/(enterprise_|influxdb).*\/v[1-2]\.[0-9]{1,2}\//.test(window.location.pathname)) {
    return "oss/enterprise"
  } else {
    return "other"
  }
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////// Session-management functions /////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Retrieve the user's InfluxDB preference (cloud or oss) from the influxdb_pref session cookie
// Default is cloud.
function getPreference() {
  return Cookies.get('influxdb_pref') || "cloud"
}

// Set the user's selected InfluxDB preference (cloud or oss)
function setPreference(preference) {
  Cookies.set('influxdb_pref', preference)
}

// InfluxDB URL-Related Session keys
//
// influxdb_oss_url
// influxdb_cloud_url
// influxdb_prev_oss_url
// influxdb_prev_cloud_url
// influxdb_pref (cloud | oss)
// influxdb_custom_url

// Store the InfluxDB URL session cookies – influxdb_url and influxdb_prev_url
function storeUrl(context, newUrl, prevUrl) {
  Cookies.set('influxdb_prev_' + context + '_url', prevUrl)
  Cookies.set('influxdb_' + context + '_url', newUrl)
}

// Store custom URL session cookie – influxdb_custom_url
// Used to populate the custom URL field
function storeCustomUrl(customUrl) {
  Cookies.set('influxdb_custom_url', customUrl)
  $('input#custom[type=radio]').val(customUrl)
}

// Remove custom URL session cookie – influxdb_custom_url
// Used to clear the form when custom url input is left empty
function removeCustomUrl() {
  Cookies.remove('influxdb_custom_url')
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////// InfluxDB URL utility functions ////////////////////////
////////////////////////////////////////////////////////////////////////////////

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

// Retrieve the previously selected cloud and oss URLs from the
// influxdb_cloud_url and influxdb_oss_url session cookies.
function getUrls() {
  var currentCloudUrl = Cookies.get('influxdb_cloud_url') || defaultUrls.cloud
  var currentOSSUrl = Cookies.get('influxdb_oss_url') || defaultUrls.oss
  var urls = {
    cloud: currentCloudUrl,
    oss: currentOSSUrl
  };
  return urls;
}

// Retrieve the previously selected cloud and oss URLs from the
// prev_influxdb_cloud_url and prev_influxdb_oss_url session cookies.
// This is used to update URLs whenever you switch between browser tabs.
function getPrevUrls() {
  var prevCloudUrl = Cookies.get('influxdb_prev_cloud_url') || defaultUrls.cloud
  var prevOSSUrl = Cookies.get('influxdb_prev_oss_url') || defaultUrls.oss
  var prevUrls = {
    cloud: prevCloudUrl,
    oss: prevOSSUrl
  };
  return prevUrls;
}

// Iterate through code blocks and update InfluxDB urls
// Requires objects with cloud and oss keys and url values
function updateUrls(prevUrls, newUrls) {

  var preference = getPreference()

  var cloudReplacements = [
    { replace: prevUrls.cloud, with: newUrls.cloud},
    { replace: prevUrls.oss, with: newUrls.cloud }
  ]
  var ossReplacements = [
    { replace: prevUrls.cloud, with: newUrls.cloud},
    { replace: prevUrls.oss, with: newUrls.oss }
  ]

  if (context() === "cloud") { var replacements = cloudReplacements  }
  else if (context() === "oss/enterprise") { var replacements = ossReplacements }
  else if ( preference === "cloud" ) { var replacements = cloudReplacements }
  else { var replacements = ossReplacements }

  replacements.forEach(function (o) {
    if (o.replace != o.with) {
      $(elementSelector).each(function() {
        $(this).html($(this).html().replace(RegExp(o.replace, "g"),  o.with));
      });
    }
  })
}

// Append the URL selector button to each codeblock with an InfluxDB Cloud or OSS URL
function appendUrlSelector() {

  var appendToUrls = [ placeholderUrls.cloud, placeholderUrls.oss ]

  if (context() === "cloud") {
    var selectorText = "InfluxDB Cloud Region"
  } else if (context() === "oss/enterprise") {
    var selectorText = "Change InfluxDB URL"
  } else {
    var selectorText = "InfluxDB Cloud or OSS?"
  }

  appendToUrls.forEach(function(url){
    $(elementSelector).each(function() {
      var code = $(this).html()
      if (code.includes(url)) {
        $(this).after("<div class='select-url'><a class='url-trigger' href='#'>" + selectorText + "</a></div>")
        $('.select-url').fadeIn(400)
      }
    });
  });
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Function executions //////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Add the preserve tag to code blocks that shouldn't be udpated
addPreserve()

// Append URL selector buttons to code blocks
appendUrlSelector()

// Update URLs on load
updateUrls(placeholderUrls, getUrls())

// Set active radio button on page load
setRadioButtons(getUrls())

// Update URLs whenever you focus on the browser tab
$(window).focus(function() {
  updateUrls(getPrevUrls(), getUrls())
  setRadioButtons(getUrls())
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////// Modal window interactions ///////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Toggle the URL selector modal window
function toggleModal() {
  $(".modal").fadeToggle(200).toggleClass("open")
}

// Set the selected URL radio buttons to :checked
function setRadioButtons() {
  currentUrls = getUrls()
  $('input[name="influxdb-cloud-url"][value="' + currentUrls.cloud + '"]').prop("checked", true)
  $('input[name="influxdb-oss-url"][value="' + currentUrls.oss + '"]').prop("checked", true)
}

// Toggle modal window on click
$("#modal-close, .modal-overlay, .url-trigger").click(function(e) {
  e.preventDefault()
  toggleModal()
})

// Update URLs and URL preference when selected/clicked in the modal
$('input[name="influxdb-cloud-url"]').change(function() {
  var newUrl = $(this).val()
  storeUrl("cloud", newUrl, getUrls().cloud)
  updateUrls(getPrevUrls(), getUrls())
})
$('input[name="influxdb-cloud-url"]').click(function() {setPreference("cloud")})

$('input[name="influxdb-oss-url"]').change(function() {
  var newUrl = $(this).val()
  storeUrl("oss", newUrl, getUrls().oss)
  updateUrls(getPrevUrls(), getUrls())
  setPreference("oss")
})
$('input[name="influxdb-oss-url"]').click(function() {setPreference("oss")})

// Toggle preference tabs
function togglePrefBtns(el) {
  preference = el.length ? el.attr("id").replace("pref-", "") : "cloud"
  prefUrls = $("#" + preference + "-urls")

  el.addClass("active")
  el.siblings().removeClass("active")
  prefUrls.addClass("active").removeClass("inactive")
  prefUrls.siblings().addClass("inactive").removeClass("active")
  setPreference(preference)
}

// Select preference tab on click
$('#pref-tabs .pref-tab').click(function() {
  togglePrefBtns($(this))
})

// Select preference tab from cookie
function showPreference() {
  var preference = Cookies.get("influxdb_pref")
  prefTab = $("#pref-" + preference)
  togglePrefBtns(prefTab)
}

// Toggled preferred service on load
showPreference()

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Custom URLs //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Validate custom URLs
function validateUrl(url) {
  var validProtocol = /^http(s?)/
  var invalidDomain =/[A-Z\s\!\@\#\$\%\^\&\*\(\)\_\+\=\[\]\{\}\\\|\;\'\"\,\<\>\/\?]/
  var protocol = url.match(/http(s?):\/\//) ? url.match(/http(s?):\/\//)[0] : "";
  var domain = url.replace(protocol, "")

  if (validProtocol.test(protocol) == false) {
    return {valid: false, error: "Invalid protocol, use http[s]"}
  } else if (domain.length == 0 || invalidDomain.test(domain) == true) {
    return {valid: false, error: "Invalid domain"}
  } else {
    return {valid: true, error: ""}
  }
}

// Show validation errors
function showValidationMessage(validation) {
  $('#custom-url').addClass("error")
  $('#custom-url').attr("data-message", validation.error)
}

// Hide validation messages and replace the message attr with empty string
function hideValidationMessage() {
  $('#custom-url').removeClass("error").attr("data-message", "")
}

// Set the custom URL cookie and apply the change
// If the custom URL field is empty, it defaults to the OSS default
function applyCustomUrl() {
  var custUrl = $('#custom-url-field').val()
  let urlValidation = validateUrl(custUrl)
  if (custUrl.length > 0 ) {
    if (urlValidation.valid) {
      hideValidationMessage()
      storeCustomUrl(custUrl)
      storeUrl("oss", custUrl, getUrls().oss)
      updateUrls(getPrevUrls(), getUrls())
    } else {
      showValidationMessage(urlValidation)
    }

  } else {
    removeCustomUrl();
    hideValidationMessage()
    $('input[name="influxdb-oss-url"][value="' + defaultUrls.oss + '"]').trigger('click')
  }
}

// Trigger radio button on custom URL field focus
$('input#custom-url-field').focus(function(e) {
  $('input#custom[type="radio"]').trigger('click')
})

// Update URLs and close modal when using 'enter' to exit custom URL field
$("#custom-url").submit(function(e) {
  let url = $('#custom-url-field').val() ? $('#custom-url-field').val() : ""
  let urlValidation = validateUrl(url)

  e.preventDefault();
  if (url === "" | urlValidation.valid) {
    applyCustomUrl()
    $('#modal-close').trigger('click')
  } else {
    showValidationMessage(urlValidation)
  }
});

// Store the custom InfluxDB URL when exiting the field
$('#custom-url-field').blur(function() {
  applyCustomUrl()
})

// When in erred state, revalidate custom URL on keyup
$(document).on("keyup", ".error #custom-url-field", function() {
    console.log("keyed up")
    let url = $('#custom-url-field').val()
    let urlValidation = validateUrl(url)
    if (urlValidation.valid) {
      hideValidationMessage()
    } else {
      showValidationMessage(urlValidation)
    }
})

// Populate the custom InfluxDB URL field on page load
if ( Cookies.get('influxdb_custom_url') != undefined ) {
  $('input#custom').val(Cookies.get('influxdb_custom_url'))
  $('#custom-url-field').val(Cookies.get('influxdb_custom_url'))
}

////////////////////////////////////////////////////////////////////////////////
/////////////////////////// Dynamically update URLs ////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Extract the protocol and hostname of referrer
referrerMatch = document.referrer.match(/^(?:[^\/]*\/){2}[^\/]+/g)
referrerHost = referrerMatch ? referrerMatch[0] : "";

// Check if the referrerHost is one of the cloud URLs
// cloudUrls is built dynamically in layouts/partials/footer/javascript.html
if (cloudUrls.includes(referrerHost)) {
  storeUrl("cloud", referrerHost, getUrls().cloud)
  updateUrls(getPrevUrls(), getUrls())
  setRadioButtons()
  setPreference("cloud")
  showPreference()
}