var date = new Date()
var currentTimestamp = date.toISOString().replace(/^(.*)(\.\d+)(Z)/, '$1$3') // 2023-01-01T12:34:56Z
var currentTime = date.toISOString().replace(/(^.*T)(.*)(Z)/, '$2') + '084216' // 12:34:56.000084216
var currentDate = date.toISOString().replace(/\d{2}\:\d{2}\:\d{2}\.\d*/, '00:00:00') // 2023-01-01T00:00:00Z

$('span.current-timestamp').text(currentTimestamp)
$('span.current-time').text(currentTime)
$('span.current-date').text(currentDate)