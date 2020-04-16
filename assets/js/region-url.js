var url = "https://us-west-2-1.aws.cloud2.influxdata.com"

// Create a way for users to select their region
// store the region url as a cookie

// set a session cookie for the url
// If the session cookie isn't defined, don't do anything

function updateUrls() {
  $(".article--content pre").each(function() {
    $(this).html($(this).html().replace("http://localhost:9999", url));
  });
}

updateUrls()
