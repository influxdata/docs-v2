import $ from 'jquery';
import { debugBreak } from './utils/debug-helpers.js';

function initialize() {
  var codeBlockSelector = '.article--content pre';
  var $codeBlocks = $(codeBlockSelector);

  var appendHTML = `
<div class="code-controls">
  <span class="code-controls-toggle"><span class='cf-icon More'></span></span>
  <ul class="code-control-options">
    <li class='copy-code'><span class='cf-icon Duplicate_New'></span> <span class="message">Copy</span></li>
    <li class='fullscreen-toggle'><span class='cf-icon ExpandB'></span> Fill window</li>
  </ul>
</div>
`;

  // Wrap all codeblocks with a new 'codeblock' div
  $codeBlocks.each(function () {
    $(this).wrap("<div class='codeblock'></div>");
  });

  // Append code controls to all codeblock divs
  $('.codeblock').append(appendHTML);

  //////////////////////////// CODE CONTROLS TOGGLING ////////////////////////////

  // Click outside of the code-controls to close them
  $(document).click(function () {
    $('.code-controls').removeClass('open');
  });

  // Click the code controls toggle to open code controls
  $('.code-controls-toggle').click(function () {
    $(this).parent('.code-controls').toggleClass('open');
  });

  // Stop event propagation for clicks inside of the code-controls div
  $('.code-controls').click(function (e) {
    e.stopPropagation();
  });

  /////////////////////////////// COPY TO CLIPBOARD //////////////////////////////

  // Update button text during lifecycles
  function updateText(element, currentText, newText) {
    let inner = element[0].innerHTML;
    inner = inner.replace(currentText, newText);

    element[0].innerHTML = inner;
  }

  // Trigger copy success state lifecycle
  function copyLifeCycle(element, state) {
    let stateData =
      state === 'success'
        ? { state: 'success', message: 'Copied!' }
        : { state: 'failed', message: 'Copy failed!' };

    updateText(element, 'Copy', stateData.message);
    element.addClass(stateData.state);

    setTimeout(function () {
      updateText(element, stateData.message, 'Copy');
      element.removeClass(stateData.state);
    }, 2500);
  }

  // Trigger copy failure state lifecycle

  $('.copy-code').click(function () {
    let text = $(this)
      .closest('.code-controls')
      .prevAll('pre:has(code)')[0].innerText;

    const copyContent = async () => {
      try {
        await navigator.clipboard.writeText(text);
        copyLifeCycle($(this), 'success');
      } catch {
        copyLifeCycle($(this), 'failed');
      }
    };

    copyContent();
  });

  /////////////////////////////// FULL WINDOW CODE ///////////////////////////////

  /*
On click, open the fullscreen code modal and append a clone of the selected codeblock.
Disable scrolling on the body.
Disable user selection on everything but the fullscreen codeblock.
*/
  $('.fullscreen-toggle').click(function () {
    var code = $(this)
      .closest('.code-controls')
      .prevAll('pre:has(code)')
      .clone();

    $('#fullscreen-code-placeholder').replaceWith(code[0]);
    $('body').css('overflow', 'hidden');
    $('body > div:not(.fullscreen-code)').css('user-select', 'none');
    $('.fullscreen-code').fadeIn();
  });

  /*
On click, close the fullscreen code block.
Reenable scrolling on the body.
Reenable user selection on everything.
Close the modal and replace the code block with the placeholder element.
*/
  $('.fullscreen-close').click(function () {
    $('body').css('overflow', 'auto');
    $('body > div:not(.fullscreen-code)').css('user-select', '');
    $('.fullscreen-code').fadeOut();
    $('.fullscreen-code pre').replaceWith(
      '<div id="fullscreen-code-placeholder"></div>'
    );
  });
}

export { initialize };
