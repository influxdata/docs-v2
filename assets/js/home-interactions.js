$('.exp-btn').click(function() {
  var targetBtnElement = $(this).parent()
  $('.exp-btn > p', targetBtnElement).fadeOut(100);
  setTimeout(function() {
    $('.exp-btn-links', targetBtnElement).fadeIn(200)
    $('.exp-btn', targetBtnElement).addClass('open');
    $('.close-btn', targetBtnElement).fadeIn(200);
  }, 100);
})

$('.close-btn').click(function() {
  var targetBtnElement = $(this).parent().parent()
  $('.exp-btn-links', targetBtnElement).fadeOut(100)
  $('.exp-btn', targetBtnElement).removeClass('open');
  $(this).fadeOut(100);
  setTimeout(function() {
    $('p', targetBtnElement).fadeIn(100);
  }, 100);
})

/////////////////////////////// EXPANDING BUTTONS //////////////////////////////

