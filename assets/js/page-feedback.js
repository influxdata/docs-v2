/*
 * This file controls the interactions and life-cycles of the page feedback
 * buttons and modal.
 */

// Collect data from the page path
const pathArr = location.pathname.split('/').slice(1, -1)
const pageData = {
  host: location.hostname,
  path: location.pathname,
  product: pathArr[0],
  version: (/^v\d/.test(pathArr[1]) || pathArr[1]?.includes('cloud') ? pathArr[1].replace(/^v/, '') : "n/a"),
}

// Hijack form submission and send feedback data to be stored.
// Called by onSubmit in each feedback form.
function submitFeedbackForm(formID) {

  // Collect form data, structure as an object, and remove fname honeypot
  const formData = new FormData(document.forms[formID]);
  const formDataObj = Object.fromEntries(formData.entries());
  const {fname, ...feedbackData} = formDataObj;
  
  // Build lp fields from form data
  let fields = "";
  for (let key in feedbackData) {
    // Strip out newlines and escape double quotes if the field key is "feedback"
    if (key == "feedback-text") {
      fields += key + '="' + feedbackData[key].replace(/(\r\n|\n+|\r+)/gm, " ").replace(/(\")/gm, '\\"') + '",';
    } else {
      fields += key + "=" + feedbackData[key] + ",";
    }      
  }
  fields = fields.substring(0, fields.length -1);

  // Build lp using page data and the fields string
  const lp = `feedback,host=${pageData.host},path=${pageData.path},product=${pageData.product},version=${pageData.version} ${fields}`

  // Use a honeypot form field to detect a bot
  // If the value of the honeypot field is greater than 0, the submitter is a bot
  function isBot() {
    const honeypot = formData.get('fname');
    return (honeypot.length > 0)
  }
  
  // If the submitter is not a bot, send the feedback data
  if (!isBot()) {
    xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://j32dswat7l.execute-api.us-east-1.amazonaws.com/prod');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Access-Control-Allow-Origin', `${location.protocol}//${location.host}`);
    xhr.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(lp);
  }

  return false;
}

/////////////////////////////// Click life-cycles //////////////////////////////

// Trigger the lifecycle of page feedback (yes/no) radio select buttons
function submitLifeCycle() {
  $('.helpful .loader-wrapper').fadeIn(200);
  $('.helpful #thank-you').delay(800).fadeIn(200);
  $('.helpful .loader-wrapper').delay(1000).hide(0);
}

// Submit the feedback form and close the feedback modal window.
// Called by onclick in the page-feedback modal submit button.
function submitLifeCycleAndClose() {
  submitFeedbackForm('pagefeedbacktext');
  $('.modal #page-feedback .loader-wrapper').css('display', 'flex').hide().fadeIn(200);
  $('.modal #page-feedback #thank-you').css('display', 'flex').hide().delay(800).fadeIn(200);
  $('.modal #page-feedback textarea').css('box-shadow', 'none')
  $('.modal #page-feedback .loader-wrapper').delay(1000).hide(0);
  setTimeout(function() {toggleModal()}, 1800);
  return false;
}

//////////////////////////////// Event triggers ////////////////////////////////

// Submit page feedback (yes/no) on radio select and trigger life cycle
$('#pagefeedback input[type=radio]').change(function() {
  $('form#pagefeedback').submit();
  submitLifeCycle()
})

// Toggle the feedback modal when user selects that the page is not helpful
$('#pagefeedback #not-helpful input[type=radio]').click(function() {
  setTimeout(function() {toggleModal('#page-feedback')}, 400);
})

// Toggle the feedback modal when user selects that the page is not helpful
$('.modal #no-thanks').click(function() {
  toggleModal();
})