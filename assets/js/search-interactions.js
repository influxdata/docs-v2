$('#algolia-search-input').focus(function() {
  $('.content-wrapper').fadeTo(400, .35);
})

$('#algolia-search-input').blur(function() {
  $('.content-wrapper').fadeTo(200, 1);
  $('.ds-dropdown-menu').hide();
})
