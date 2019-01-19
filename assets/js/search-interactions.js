$('#algolia-search-input').focus(function() {
  $('.article--content').fadeTo(400, .25);
})

$('#algolia-search-input').blur(function() {
  $('.article--content').fadeTo(200, 1);
  $('.ds-dropdown-menu').hide();
})
