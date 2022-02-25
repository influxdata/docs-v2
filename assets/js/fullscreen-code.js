var codeBlockSelector = ".article--content pre";
var codeBlocks = $(codeBlockSelector);

// Check if codeblock content requires scrolling (overflow)
function hasOverflow(element) {
  if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
    return true
  } else {
    return false
  }
}

// Wrap codeblocks that overflow with a new 'codeblock' div
$(codeBlocks).each(function() {
  if (hasOverflow( $(this)[0] )) {
    $(this).wrap("<div class='codeblock'></div>");
  } else {}
});

// Append a clickable fullscreen toggle button to all codeblock divs
$('.codeblock').append("<a class='fullscreen-toggle'><span class='cf-icon expand-new'></span></a>");

/*
On click, open the fullscreen code modal and append a clone of the selected codeblock.
Disable scrolling on the body.
Disable user selection on everything but the fullscreen codeblock.
*/
$('.fullscreen-toggle').click(function() {
  var code = $(this).prev('pre').clone();
  
  $('#fullscreen-code-placeholder').replaceWith(code[0]);
  $('body').css('overflow', 'hidden');
  $('body > div:not(.fullscreen-code)').css('user-select', 'none');
  $('.fullscreen-code').fadeIn();
})

/*
On click, close the fullscreen code block.
Reenable scrolling on the body.
Reenable user selection on everything.
Close the modal and replace the code block with the placeholder element.
*/
$('.fullscreen-close').click(function() {
  $('body').css('overflow', 'auto');
  $('body > div:not(.fullscreen-code)').css('user-select', '');
  $('.fullscreen-code').fadeOut();
  $('.fullscreen-code pre').replaceWith('<div id="fullscreen-code-placeholder"></div>')
});
