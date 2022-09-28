///////////////////////////// Make headers linkable /////////////////////////////

var headingWhiteList = $("\
  .article--content h2, \
  .article--content h3, \
  .article--content h4, \
  .article--content h5, \
  .article--content h6 \
");

var headingBlackList = ("\
  .influxdbu-banner h4 \
");

headingElements = headingWhiteList.not(headingBlackList);

headingElements.each(function() {
    function getLink(element) {
      return ((element.attr('href') === undefined ) ? $(element).attr("id") : element.attr('href'))
    }
    var link = "<a href=\"#" + getLink($(this)) + "\"></a>"
    $(this).wrapInner( link );
  })

///////////////////////////////// Smooth Scroll /////////////////////////////////

var elementWhiteList = [
  ".tabs p a",
  ".code-tabs p a",
  ".truncate-toggle",
  ".children-links a",
  ".list-links a",
  "a.url-trigger",
  "a.fullscreen-close"
]

function scrollToAnchor(target) {
  var $target = $(target);
  if($target && $target.length > 0) {
    $('html, body').stop().animate({
      'scrollTop': ($target.offset().top)
    }, 400, 'swing', function () {
      window.location.hash = target;
    });

    // Unique accordion functionality
    // If the target is an accordion element, open the accordion after scrolling
    if ($target.hasClass('expand')) {
      if ($(target + ' .expand-label .expand-toggle').hasClass('open')) {}
      else {
        $(target + '> .expand-label').trigger('click');
      };
    };
  }
}

$('.article a[href^="#"]:not(' + elementWhiteList + ')').click(function (e) {
  e.preventDefault();
  scrollToAnchor(this.hash);
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

// Retrieve the user's programming language (client library) preference.
function getApiLibPreference() {
  return Cookies.get('influx-docs-api-lib') || '';
}

function getTabQueryParam() {
  const queryParams = new URLSearchParams(window.location.search);
  return $('<textarea />').html(queryParams.get('t')).text();
}

function activateTabs(selector, tab) {
  const anchor = window.location.hash;
  if (tab !== "") {
    let targetTab = $(`${selector} a:contains("${tab}")`);
    if(!targetTab.length) {
      targetTab = Array.from(document.querySelectorAll(`${selector} a`))
                  .find(function(el) {
                    let targetText = el.text &&
                      el.text.toLowerCase().replace(/[^a-z0-9]/, '')
                    return targetText && tab.includes(targetText);
                  })
    }
    if(targetTab) {
      $(targetTab).click();
      scrollToAnchor(anchor);
    }
  }

  const queryParams = new URLSearchParams(window.location.search);
  $(`${selector} p a`).click(function() {
    if ($(this).is(':not(":first-child")')) {
      queryParams.set('t', $(this).html())
      window.history.replaceState({}, '', `${location.pathname}?${queryParams}${anchor}`);
    } else {
      queryParams.delete('t')
      window.history.replaceState({}, '', `${location.pathname}${anchor}`);
    }
  })
};

//////////////////// Activate Tab with Cookie or Query Param ///////////////////
/**
  * Activate code-tabs based on the cookie then override with query param.
**/
var tab = getApiLibPreference();
(['.code-tabs']).forEach(selector => activateTabs(selector, tab));
tab = getTabQueryParam();
(['.tabs', '.code-tabs']).forEach(selector => activateTabs(selector, tab));

/////////////////////////////// Truncate Content ///////////////////////////////

$(".truncate-toggle").click(function(e) {
  e.preventDefault()
  $(this).closest('.truncate').toggleClass('closed');
})

////////////////////////////// Expand Accordions ///////////////////////////////

$('.expand-label').click(function() {
  $(this).children('.expand-toggle').toggleClass('open')
  $(this).next('.expand-content').slideToggle(200)
})

// Expand accordions on load based on URL anchor
function openAccordionByHash() {
  var anchor = window.location.hash;

  function expandElement() {
    if ($(anchor).parents('.expand').length > 0) {
      return $(anchor).closest('.expand').children('.expand-label');
    } else if ($(anchor).hasClass('expand')){
      return $(anchor).children('.expand-label');
    }
  };

  if (expandElement() != null) {
    if (expandElement().children('.expand-toggle').hasClass('open')) {}
    else {
      expandElement().children('.expand-toggle').trigger('click');
    };
  };
};

// Open accordions by hash on page load.
openAccordionByHash()

////////////////////////// Inject tooltips on load //////////////////////////////

$('.tooltip').each( function(){
  $toolTipText = $('<div/>').addClass('tooltip-text').text($(this).attr('data-tooltip-text'));
  $toolTipElement = $('<div/>').addClass('tooltip-container').append($toolTipText);
  $(this).prepend($toolTipElement);
});

//////////////////// Style time cells in tables to not wrap ////////////////////

$('.article--content table').each(function() {
  var table = $(this);

  table.find('td').each(function() {
    let cellContent = $(this)[0].innerText

    if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(cellContent)) {
      $(this).addClass('nowrap')
    }
  })
})
