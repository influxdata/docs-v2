var date = new Date()
var timestamp = date.toISOString().replace(/^(.*)(\.\d+)(Z)/, '$1$3')

$('span.current-time').text(timestamp)