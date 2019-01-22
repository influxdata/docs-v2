///////////////////////////// Make headers linkable /////////////////////////////

$(".article--content h2, \
   .article--content h3, \
   .article--content h4, \
   .article--content h5, \
   .article--content h6" ).each(function() {
  var link = "<a href=\"#" + $(this).attr("id") + "\"></a>"
  $(this).wrapInner( link );
  })

///////////////////////////////// Smooth Scroll /////////////////////////////////

var elementWhiteList = [
  ".tabs p a",
  ".code-tabs p a",
  ".truncate-toggle",
  ".children-links a"
]

$('.article a[href^="#"]:not(' + elementWhiteList + ')').click(function (e) {
  e.preventDefault();

  var target = this.hash;
  var $target = $(target);

  $('html, body').stop().animate({
    'scrollTop': ($target.offset().top)
  }, 400, 'swing', function () {
    window.location.hash = target;
  });
});

///////////////////////////// Left Nav Interactions /////////////////////////////

$(".children-toggle").click(function(e) {
	e.preventDefault()
	$(this).toggleClass('open');
	$(this).siblings('.children').toggleClass('open');
})

//////////////////////////// Mobile Contents Toggle ////////////////////////////

$('#contents-toggle-btn').click(function(e) {
  e.preventDefault();
  $(this).toggleClass('open');
  $('#nav-tree').toggleClass('open');
})

//////////////////////////////// Tabbed Content ////////////////////////////////

function tabbedContent(container, tab, content) {

	// Add the active class to the first tab in each tab group,
	// in case it wasn't already set in the markup.
	$(container).each(function () {
		$(tab, this).removeClass('is-active');
		$(tab + ':first', this).addClass('is-active');
	});

	$(tab).on('click', function(e) {
		e.preventDefault();

		// Make sure the tab being clicked is marked as active, and make the rest inactive.
		$(this).addClass('is-active').siblings().removeClass('is-active');

		// Render the correct tab content based on the position of the tab being clicked.
		const activeIndex = $(tab).index(this);
		$(content).each(function(i) {
			if (i === activeIndex) {
				$(this).show();
				$(this).siblings(content).hide();
			}
		});
	});
}

tabbedContent('.code-tabs-wrapper', '.code-tabs p a', '.code-tab-content');
tabbedContent('.tabs-wrapper', '.tabs p a', '.tab-content');

/////////////////////////////// Truncate Content ///////////////////////////////

$(".truncate-toggle").click(function(e) {
	e.preventDefault()
	$(this).closest('.truncate').toggleClass('closed');
})
