import $ from 'jquery';

const placeholderWrapper = '.code-placeholder-wrapper';
const placeholderElement = 'var.code-placeholder';
const editIcon = "<span class='code-placeholder-edit-icon cf-icon Pencil'></span>";

// When clicking a placeholder, append the edit input
function handleClick(element) {
  $(element).on('click', function() {
    var placeholderData = $(this)[0].dataset;
    var placeholderID = placeholderData.codeVar;
    var placeholderValue = placeholderData.codeVarValue;
    var placeholderInputWrapper = $('<div class="code-input-wrapper"></div>');
    var placeholderInput = `<input class="placeholder-edit" id="${placeholderID}" value="${placeholderValue}" spellcheck=false onblur="submitPlaceholder($(this))" oninput="updateInputWidth($(this))" onkeydown="closeOnEnter($(this)[0], event)"></input>`;

    $(this).before(placeholderInputWrapper)
    $(this).siblings('.code-input-wrapper').append(placeholderInput);
    $(`input#${placeholderID}`).width(`${placeholderValue.length}ch`);
    $(`input#${placeholderID}`).focus().select();
    $(this).css('opacity', 0);
  });
}

function submitPlaceholder(placeholderInput) {
  var placeholderID = placeholderInput.attr('id');
  var placeholderValue = placeholderInput[0].value;
  var placeholderInput = $(`input.placeholder-edit#${placeholderID}`);

  $(`*[data-code-var='${placeholderID}']`).each(function() {
    $(this).attr('data-code-var-value', placeholderValue);
    $(this).html(placeholderValue + editIcon);
    $(this).css('opacity', 1);
  })
  placeholderInput.parent().remove();
}

function updateInputWidth(placeholderInput) {
  var placeholderLength = placeholderInput[0].value.length

  placeholderInput.width(`${placeholderLength}ch`)
}

function closeOnEnter(input, event) {
  if (event.which == 13) {
    input.blur();
  }
}

function CodePlaceholder({element}) {
  handleClick(element);
}

$(function() {
  const codePlaceholders = $(placeholderElement);
  codePlaceholders.each(function() {
    CodePlaceholder({element: this});
  });
});