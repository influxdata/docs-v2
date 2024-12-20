////////////////////////////////////////////////////////////////////////////////
/////////////////////// General modal window interactions //////////////////////
////////////////////////////////////////////////////////////////////////////////

import $ from 'jquery';

function handleModalClick() {
  // Open modal window on click
  $('.modal-trigger').click(function (e) {
    e.preventDefault();
    toggleModal();
  });
  
  // Close modal window on click
  $('#modal-close, .modal-overlay').click(function (e) {
    e.preventDefault();
    toggleModal();

    // Remove modal query param ('view') if it exists
    const queryParams = new URLSearchParams(window.location.search);
    const anchor = window.location.hash;

    if (queryParams.get('view') !== null) {
      queryParams.delete('view');
      window.history.replaceState({}, '', `${location.pathname}${anchor}`);
    }
  });
}

function toggleModal(modalID = '') {
  if ($('.modal').hasClass('open')) {
    $('.modal').fadeOut(200).removeClass('open');
    $('.modal-content').delay(400).hide(0);
  } else {
    $('.modal').fadeIn(200).addClass('open');
    $(`${modalID}.modal-content`).show();
  }
}

function initialize() {
  handleModalClick();
}

export { initialize, toggleModal };
