// Expand the menu on click
$(".dropdown").click(function () {
  $(this).toggleClass("open")
})

//  Close the version dropdown by clicking anywhere else
$(document).click(function(e) {
  if ( $(e.target).closest('.dropdown').length === 0 ) {
    $(".dropdown").removeClass("open");
  }
});
