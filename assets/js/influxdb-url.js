var placeholderUrls = {
  cloud: "https://cloud2.influxdata.com",
  oss: "http://localhost:8086",
  dedicated: "cluster-id.influxdb.io"
}

var defaultUrls = {
  cloud: "https://us-west-2-1.aws.cloud2.influxdata.com",
  oss: "http://localhost:8086",
  dedicated: "cluster-id.influxdb.io"
}

var elementSelector = ".article--content pre:not(.preserve)"

// Return the page context (cloud, oss/enterprise, other)
function context() {
  if (/\/influxdb\/cloud(?:-iox)/.test(window.location.pathname)) {
    return "cloud"
  } else if (/\/influxdb\/cloud-dedicated/.test(window.location.pathname)) {
    return "dedicated"
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

// Set the user's programming language (client library) preference.
function setApiLibPreference(preference) {
  Cookies.set('influx-docs-api-lib', preference)
}

// InfluxDB URL-Related Session keys
//
// influxdb_oss_url
// influxdb_cloud_url
// influxdb_dedicated_url
// influxdb_prev_oss_url
// influxdb_prev_cloud_url
// influxdb_prev_dedicated_url
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

// Store dedicated URL session cookie – influxdb_dedicated_url
// Used to populate the custom URL field
function storeDedicatedUrl(dedicatedUrl) {
  Cookies.set('influxdb_dedicated_url', dedicatedUrl)
  $('input#dedicated-url-field').val(dedicatedUrl)
}

// Remove dedicated URL session cookie – influxdb_dedicated_url
// Used to clear the form when dedicated url input is left empty
function removeDedicatedUrl() {
  Cookies.remove('influxdb_dedicated_url')
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
    // For code blocks with no syntax highlighting inside of a link (API endpoint blocks)
    $(this).next('a').find('pre').addClass('preserve')
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
  var currentDedicatedUrl = Cookies.get('influxdb_dedicated_url') || defaultUrls.dedicated
  var urls = {
    cloud: currentCloudUrl,
    oss: currentOSSUrl,
    dedicated: currentDedicatedUrl
  };
  return urls;
}

// Retrieve the previously selected cloud and oss URLs from the
// prev_influxdb_cloud_url and prev_influxdb_oss_url session cookies.
// This is used to update URLs whenever you switch between browser tabs.
function getPrevUrls() {
  var prevCloudUrl = Cookies.get('influxdb_prev_cloud_url') || defaultUrls.cloud
  var prevOSSUrl = Cookies.get('influxdb_prev_oss_url') || defaultUrls.oss
  var prevDedicatedUrl = Cookies.get('influxdb_prev_dedicated_url') || defaultUrls.dedicated
  var prevUrls = {
    cloud: prevCloudUrl,
    oss: prevOSSUrl,
    dedicated: prevDedicatedUrl
  };
  return prevUrls;
}

////////////////////////////////////////////////////////////////////////////////
///////////////// Preferred Client Library programming language  ///////////////
////////////////////////////////////////////////////////////////////////////////

function getVisitedApiLib() {
  const path = window.location.pathname.match(/client-libraries\/([a-zA-Z0-9]*)/)
  return path && path.length && path[1]
}

var selectedApiLib = getVisitedApiLib()
Cookies.set('influx-docs-api-lib', selectedApiLib)
  //selectedApiLib && setApiLibPreference(selectedApiLib);

// Iterate through code blocks and update InfluxDB urls
// Requires objects with cloud and oss keys and url values
function updateUrls(prevUrls, newUrls) {
  var preference = getPreference()
  var prevUrlsParsed = {
    cloud: {},
    oss: {},
    dedicated: {}
  }

  var newUrlsParsed = {
    cloud: {},
    oss: {},
    dedicated: {}
  }

  Object.keys(prevUrls).forEach(function(k) {
    try {
      prevUrlsParsed[k] = new URL(prevUrls[k])
    } catch {
      prevUrlsParsed[k] = { origin: prevUrls[k], host: prevUrls[k] }
    }
  })

  Object.keys(newUrls).forEach(function(k) {
    try {
      newUrlsParsed[k] = new URL(newUrls[k])
    } catch {
      newUrlsParsed[k] = { origin: newUrls[k], host: newUrls[k] }
    }
  })

  /**
    * Match and replace <prev> host with <new> host
    * then replace <prev> URL with <new> URL.
  **/
  var cloudReplacements = [
    { replace: prevUrlsParsed.cloud, with: newUrlsParsed.cloud },
    { replace: prevUrlsParsed.oss, with: newUrlsParsed.cloud },
  ]
  var ossReplacements = [
    { replace: prevUrlsParsed.cloud, with: newUrlsParsed.cloud },
    { replace: prevUrlsParsed.oss, with: newUrlsParsed.oss },
  ]
  var dedicatedReplacements = [
    { replace: prevUrlsParsed.dedicated, with: newUrlsParsed.dedicated },
  ]

  if (context() === "cloud") { var replacements = cloudReplacements  }
  else if (context() === "dedicated") { var replacements = dedicatedReplacements  }
  else if (context() === "oss/enterprise") { var replacements = ossReplacements }
  else if ( preference === "cloud" ) { var replacements = cloudReplacements }
  else { var replacements = ossReplacements }

  replacements.forEach(function (o) {
    if (o.replace.origin != o.with.origin) {
      var fuzzyOrigin = new RegExp(o.replace.origin + "(:(^443)|[0-9]+)?", "g");
      $(elementSelector).each(function() {
        $(this).html(
          $(this).html().replace(fuzzyOrigin, function(m){
            return o.with.origin || m;
          })
        );
      })
    }
  });

  function replaceWholename(startStr, endStr, replacement) {
    var startsWithSeparator = new RegExp('[/.]');
    var endsWithSeparator = new RegExp('[-.:]');
    if(!startsWithSeparator.test(startStr) && !endsWithSeparator.test(endStr)) {
      var newHost = startStr + replacement + endStr
      return newHost;
    }
  }

  replacements
  .map(function(o) {
     return {replace: o.replace.host, with: o.with.host}
   })
  .forEach(function (o) {
    if (o.replace != o.with) {
        var fuzzyHost = new RegExp("(.?)" + o.replace + "(.?)", "g");
       $(elementSelector).each(function() {
        $(this).html(
          $(this).html().replace(fuzzyHost, function(m, p1, p2) {
            var r = replaceWholename(p1, p2, o.with) || m;
            return r
          })
        );
      })
    }
  });
}

// Append the URL selector button to each codeblock with an InfluxDB Cloud or OSS URL
function appendUrlSelector() {

  var appendToUrls = [ placeholderUrls.cloud, placeholderUrls.oss, placeholderUrls.dedicated ]

  if (context() === "cloud") {
    var selectorText = "InfluxDB Cloud Region"
  } else if (context() === "dedicated") {
    var selectorText = "Set dedicated cluster URL"
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

// Add the preserve tag to code blocks that shouldn't be updated
addPreserve()

// Append URL selector buttons to code blocks
appendUrlSelector()

// Update URLs on load
updateUrls(placeholderUrls, getUrls())

// Set active radio button on page load
setRadioButtons(getUrls())

////////////////////////////////////////////////////////////////////////////////
////////////////////////// Modal window interactions ///////////////////////////
////////////////////////////////////////////////////////////////////////////////

// General modal window interactions are controlled in modals.js

// Open the InfluxDB URL selector modal
$(".url-trigger").click(function(e) {
  e.preventDefault()
  toggleModal('#influxdb-url-list')
})

// Set the selected URL radio buttons to :checked
function setRadioButtons() {
  currentUrls = getUrls()
  $('input[name="influxdb-cloud-url"][value="' + currentUrls.cloud + '"]').prop("checked", true)
  $('input[name="influxdb-oss-url"][value="' + currentUrls.oss + '"]').prop("checked", true)
}


// Add checked to fake-radio if cluster is selected on page load
if ($("ul.clusters label input").is(":checked")) {
  var group = $("ul.clusters label input:checked").parent().parent().parent().siblings();
  $(".fake-radio", group).addClass("checked");
};

// Select first cluster when region is clicked
$("p.region").click(function () {
  if (!$(".fake-radio", this).hasClass("checked")) {
    $(".fake-radio", this).addClass("checked");
    $("+ ul.clusters li:first label", this).trigger("click");
  };
});

// Remove checked class from fake-radio when another region is selected
$(".region-group").click(function () {
  if (!$(".fake-radio", this).hasClass("checked")) {
    $(".fake-radio", !this).removeClass("checked");
    $(".fake-radio", this).addClass("checked");
  }
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

$('input[name="influxdb-dedicated-url"]').change(function() {
  var newUrl = $(this).val()
  storeUrl("dedicated", newUrl, getUrls().dedicated)
  updateUrls(getPrevUrls(), getUrls())
})

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
  /** validDomain = (Named host | IPv6 host | IPvFuture host)(:Port)? **/
  var validDomain = new RegExp(`([a-z0-9\-._~%]+`
  + `|\[[a-f0-9:.]+\]`
  + `|\[v[a-f0-9][a-z0-9\-._~%!$&'()*+,;=:]+\])`
  + `(:[0-9]+)?`);

  if (context() !== 'dedicated') {
    // Validation for non-dedicated custom InfluxDB URLs
    try {
      new URL(url);
      return {valid: true, error: ""}
    } catch(e) {
      var validProtocol = /^http(s?)/
      var protocol = url.match(/http(s?):\/\//) ? url.match(/http(s?):\/\//)[0] : "";
      var domain = url.replace(protocol, "")

      if (validProtocol.test(protocol) == false) {
        return {valid: false, error: "Invalid protocol, use http[s]"}
      } else if (validDomain.test(domain) == false) {
        return {valid: false, error: "Invalid domain"}
      } else if (e) {
        return {valid: false, error: "Invalid URL"}
      }
    }
  } else {
    // Validation for dedicated URLs
    var includesProtocol = /^.*:\/\//
    var protocol = url.match(/^.*:\/\//) ? url.match(/^.*:\/\//)[0] : "";
    var domain = url.replace(protocol, "")    

    if (url.length === 0) {
      return {valid: true, error: ""}
    } else if (includesProtocol.test(protocol) == true) {
      return {valid: false, error: "Do not include the protocol"}
    } else if (validDomain.test(domain) == false) {
      return {valid: false, error: "Invalid domain"}
    } else {
      return {valid: true, error: ""}
    }
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

// Set the dedicated URL cookie and apply the change
// If the dedicated URL field is empty, it defaults to the dedicated default
function applyDedicatedUrl() {
  var dedicatedUrl = $('#dedicated-url-field').val()
  let urlValidation = validateUrl(dedicatedUrl)
  if (dedicatedUrl.length > 0 ) {
    if (urlValidation.valid) {
      hideValidationMessage()
      storeDedicatedUrl(dedicatedUrl)
      getUrls("dedicated", dedicatedUrl, getUrls().dedicated)
      updateUrls(getPrevUrls(), getUrls())
    } else {
      showValidationMessage(urlValidation)
    }
  } else {
    removeDedicatedUrl();
    hideValidationMessage();
  }
}

// Trigger radio button on custom URL field focus
$('input#custom-url-field').focus(function(e) {
  $('input#custom[type="radio"]').trigger('click')
})

// Update URLs and close modal when using 'enter' to exit custom URL field
$("#custom-url").submit(function(e) {
  let url = $('#custom-url-field').val() ? $('#custom-url-field').val() : ""
  if (context() === 'dedicated') {
    url = $('#dedicated-url-field').val() ? $('#dedicated-url-field').val() : ""
  }
  let urlValidation = validateUrl(url)

  e.preventDefault();
  if (url === "" | urlValidation.valid) {
    (context() !== 'dedicated') ? applyCustomUrl() : applyDedicatedUrl();
    $('#modal-close').trigger('click')
  } else {
    showValidationMessage(urlValidation)
  }
});

// Store the custom InfluxDB URL or dedicated URL when exiting the field
$('#custom-url-field, #dedicated-url-field').blur(function() {
  (context() !== 'dedicated') ? applyCustomUrl() : applyDedicatedUrl();
})

/** Delay execution of a function `fn` for a number of milliseconds `ms`
  * e.g., delay a validation handler to avoid annoying the user.
  */
function delay(fn, ms) {
  let timer = 0
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(fn.bind(this, ...args), ms || 0)
  }
}

function handleUrlValidation() {
  let url = $('#custom-url-field, #dedicated-url-field').val()
  let urlValidation = validateUrl(url)
  if (urlValidation.valid) {
    hideValidationMessage()
  } else {
    showValidationMessage(urlValidation)
  }
}
// When in erred state, revalidate custom URL on keyup
$(document).on("keyup", "#custom-url-field, #dedicated-url-field", delay(handleUrlValidation, 500));

// Populate the custom InfluxDB URL field on page load
if ( Cookies.get('influxdb_custom_url') != undefined ) {
  $('input#custom').val(Cookies.get('influxdb_custom_url'))
  $('#custom-url-field').val(Cookies.get('influxdb_custom_url'))
}

// Populate the dedicated URL field on page load
if ( Cookies.get('influxdb_dedicated_url') != undefined ) {
  $('input#dedicated-url-field').val(Cookies.get('influxdb_dedicated_url'))
  $('#dedicated-url-field').val(Cookies.get('influxdb_dedicated_url'))
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
