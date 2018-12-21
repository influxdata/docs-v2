// Expand the menu on click
$(".version-selector").click(function () {
  $(this).toggleClass("open")
})

//  Close the version dropdown by clicking anywhere else
$(document).click(function(e) {
  if ( $(e.target).closest('.version-selector').length === 0 ) {
    $(".version-selector").removeClass("open");
  }
});
