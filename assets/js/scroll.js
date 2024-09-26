import $ from 'jquery';

export function scrollToAnchor(target) {
  var $target = $(target);
  if($target && $target.length > 0) {
    $('html, body').stop().animate({
      'scrollTop': ($target.offset().top)
    }, 400, 'swing', function () {
      window.location.hash = target;
    });

    // Unique accordion functionality
    // If the target is an accordion element, open the accordion after scrolling
    if ($target.hasClass('expand')) {
      if ($(target + ' .expand-label .expand-toggle').hasClass('open')) {}
      else {
        $(target + '> .expand-label').trigger('click');
      };
    };
  }
}