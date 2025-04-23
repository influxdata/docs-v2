import $ from 'jquery';

const placeholderElement = 'var.code-placeholder';
const editIcon = "<span class='code-placeholder-edit-icon cf-icon Pencil'></span>";

// When clicking a placeholder, append the edit input
function handleClick($element) {
  const $placeholder = $($element).find(placeholderElement);
  $placeholder.on('click', function() {
    var placeholderData = $(this)[0].dataset;
    var placeholderID = placeholderData.codeVarEscaped;
    var placeholderValue = placeholderData.codeVarValue;

    const placeholderInput = document.createElement('input');
    placeholderInput.setAttribute('class', 'placeholder-edit');
    placeholderInput.setAttribute('data-id', placeholderID);
    placeholderInput.setAttribute('data-code-var-escaped', placeholderID);
    placeholderInput.setAttribute('value', placeholderValue);
    placeholderInput.setAttribute('spellcheck', 'false');
    
    placeholderInput.addEventListener('blur', function() {
      submitPlaceholder($(this));
    }
    );
    placeholderInput.addEventListener('input', function() {
      updateInputWidth($(this));
    }
    );
    placeholderInput.addEventListener('keydown', function(event) {
      closeOnEnter($(this)[0], event);
    }
    );

    const placeholderInputWrapper = $('<div class="code-input-wrapper"></div>');
    $placeholder.before(placeholderInputWrapper)
    $placeholder.siblings('.code-input-wrapper').append(placeholderInput);
    $(`input[data-code-var-escaped="${placeholderID}"]`).width(`${placeholderValue.length}ch`);
    document.querySelector(`input[data-code-var-escaped="${placeholderID}"]`).focus();
    document.querySelector(`input[data-code-var-escaped="${placeholderID}"]`).select();
    $placeholder.css('opacity', 0);
  });
}

function submitPlaceholder(placeholderInput) {
  var placeholderID = placeholderInput.attr('data-code-var-escaped');
  var placeholderValue = placeholderInput[0].value;
  placeholderInput = $(`input.placeholder-edit[data-id="${placeholderID}"]`);

  $(`*[data-code-var="${placeholderID}"]`).each(function() {
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

export default function CodePlaceholder({ component }) {
  const $component = $(component);
  handleClick($component);
}