////////////////////////////////////////////////////////////////////////////////
/////////////////////// General modal window interactions //////////////////////
////////////////////////////////////////////////////////////////////////////////

// Toggle the URL selector modal window
function toggleModal(modalID="") {
  if ($(".modal").hasClass("open")) {
    $(".modal").fadeOut(200).removeClass("open");
    $(".modal-content").delay(400).hide(0);
  } else {
    $(".modal").fadeIn(200).addClass("open");
    $(`${modalID}.modal-content`).show();
  }
}

// Close modal window on click
$("#modal-close, .modal-overlay").click(function(e) {
  e.preventDefault()
  toggleModal()
})