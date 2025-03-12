////////////////////////////////////////////////////////////////////////////////
/////////////////////// General modal window interactions //////////////////////
////////////////////////////////////////////////////////////////////////////////
import $ from 'jquery';

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
function closeModalOnClick() {
  $("#modal-close, .modal-overlay").on('click', (function(e) {
    e.preventDefault()
    toggleModal()
    
    // Remove modal query param ('view') if it exists
    const queryParams = new URLSearchParams(window.location.search);
    const anchor = window.location.hash;

    if (queryParams.get('view') !== null) {
      queryParams.delete('view');
      window.history.replaceState({}, '', `${location.pathname}${anchor}`);
    };
  }));
}

function Modal() {
  // Close modal window on click
  closeModalOnClick();
}

export {toggleModal, Modal};