const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var date = new Date()
var currentTimestamp = date.toISOString().replace(/^(.*)(\.\d+)(Z)/, '$1$3') // 2023-01-01T12:34:56Z
var currentTime = date.toISOString().replace(/(^.*T)(.*)(Z)/, '$2') + '084216' // 12:34:56.000084216

function currentDate(offset=0, trimTime=false) {
  outputDate = new Date(date)
  outputDate.setDate(outputDate.getDate() + offset)

  if (trimTime) {
    return outputDate.toISOString().replace(/T.*$/, '') // 2023-01-01
  } else {
    return outputDate.toISOString().replace(/T.*$/, 'T00:00:00Z') // 2023-01-01T00:00:00Z
  }
}

function enterpriseEOLDate() {
  var inTwoYears = date.setFullYear(date.getFullYear() + 2)
  earliestEOL = new Date(inTwoYears)
  return `${monthNames[earliestEOL.getMonth()]} ${earliestEOL.getDate()}, ${earliestEOL.getFullYear()}`
}

$('span.current-timestamp').text(currentTimestamp)
$('span.current-time').text(currentTime)
$('span.enterprise-eol-date').text(enterpriseEOLDate)
$('span.current-date').each(function() {
  var dayOffset = parseInt($(this).attr("offset"))
  var trimTime = $(this).attr("trim-time") === "true"
  $(this).text(currentDate(dayOffset, trimTime))
})
