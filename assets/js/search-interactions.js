// Fade content wrapper when focusing on search input
$('#algolia-search-input').focus(function() {
  $('.content-wrapper, .group-wrapper').fadeTo(300, .35);
})

// Hide search dropdown when leaving search input
$('#algolia-search-input').blur(function() {
  $('.content-wrapper, .group-wrapper').fadeTo(200, 1);
  $('.ds-dropdown-menu').hide();
})
