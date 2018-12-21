// Make headers linkable
$("h2,h3,h4,h5,h6").each(function() {
  var link = "<a href=\"#" + $(this).attr("id") + "\"></a>"
  $(this).wrapInner( link );
  })

// Smooth Scroll
var topBuffer = 0;
  $('a[href^="#"]').on('click',function (e) {
    e.preventDefault();

    var target = this.hash;
    var $target = $(target);

    $('html, body').stop().animate({
      'scrollTop': ($target.offset().top - topBuffer)
    }, 400, 'swing', function () {
      window.location.hash = target;
    });
  });
