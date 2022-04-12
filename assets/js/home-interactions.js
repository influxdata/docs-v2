$('.api-btn-wrapper').click(function() {
  $('#api-btn p').fadeOut(100);
  setTimeout(function() {
    $('.api-links').fadeIn(200).addClass('open');
    $('#close-btn').fadeIn(200);
  }, 100);
})

$('#close-btn').click(function() {
  $('.api-links').fadeOut(100).removeClass('open');
  $('#close-btn').fadeOut(100);
  setTimeout(function() {
    $('#api-btn p').fadeIn(200);
  }, 100);
})