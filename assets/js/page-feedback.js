// Submit page feedback (yes/no) on radio select
$('#pagefeedback input[type=radio]').change(function() {
  $('form#pagefeedback').submit()
})

// Hijack form submission
function submitFormData() {
  var formData = new FormData(document.forms.pagefeedback);

  var honeypotName = formData.get('name')
  var product = formData.get('product')
  var path = formData.get('path')
  var helpful = formData.get('helpful')
  var lp = `feedback,product=${product},path=${path} helpful=${helpful}`

  // Use a honeypot form field to detect a bot
  // If the value of the honeypot field is greater than 0, the submitter is a bot
  function isBot() {
    return (honeypotName.length > 0)
  }
  
  // If the submitter is not a bot, do something
  if (!isBot()) {console.log(lp);}

  return false;
}