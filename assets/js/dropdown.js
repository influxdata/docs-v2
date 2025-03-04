import $ from 'jquery';

export default function Dropdown() {

  // Expand the menu on click
  $('.dropdown').on('click', function (e) {
    $(this).toggleClass('open');
    $('.dropdown').not(this).removeClass('open');
  });

  //  Close all dropdowns by clicking anywhere else
  $(document).on('click', function (e) {
    if ($(e.target).closest('.dropdown').length === 0) {
      $('.dropdown').removeClass('open');
    }
  });
}
