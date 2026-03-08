import $ from 'jquery';

///////////////////////////// Make headers linkable /////////////////////////////

function makeHeadersLinkable() {
  var headingWhiteList = $(
    '\
  .article--content h2, \
  .article--content h3, \
  .article--content h4, \
  .article--content h5, \
  .article--content h6 \
'
  );

  var headingBlackList =
    '\
  .influxdbu-banner h4 \
';

  const headingElements = headingWhiteList.not(headingBlackList);

  headingElements.each(function () {
    function getLink(element) {
      return element.attr('href') === undefined
        ? $(element).attr('id')
        : element.attr('href');
    }
    var link = '<a href="#' + getLink($(this)) + '"></a>';
    $(this).wrapInner(link);
  });
}

///////////////////////////////// Smooth Scroll /////////////////////////////////

function smoothScroll() {
  var elementWhiteList = [
    '.tabs p a',
    '.code-tabs p a',
    '.children-links a',
    '.list-links a',
    'a.url-trigger',
    'a.fullscreen-close',
  ];

  $('.article a[href^="#"]:not(' + elementWhiteList + ')').click(function (e) {
    e.preventDefault();
    scrollToAnchor(this.hash);
  });
}

function scrollToAnchor(target) {
  var $target = $(target);
  if ($target && $target.length > 0) {
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop: $target.offset().top,
        },
        400,
        'swing',
        function () {
          window.location.hash = target;
        }
      );

    // Unique accordion functionality
    // If the target is an accordion element, open the accordion after scrolling
    if ($target.hasClass('expand')) {
      if ($(target + ' .expand-label .expand-toggle').hasClass('open')) {
        // Do nothing?
      } else {
        $(target + '> .expand-label').trigger('click');
      }
    }
  }
}

///////////////////////////// Left Nav Interactions /////////////////////////////

function leftNavInteractions() {
  $('.children-toggle').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('open');
    $(this).siblings('.children').toggleClass('open');
  });
}
//////////////////////////// Mobile Contents Toggle ////////////////////////////

function mobileContentsToggle() {
  $('#contents-toggle-btn').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('open');
    $('#nav-tree').toggleClass('open');
  });
}
/////////////////////////////// Truncate Content ///////////////////////////////

function truncateContent() {
  $('.truncate-toggle').click(function (e) {
    e.preventDefault();
    var truncateParent = $(this).closest('.truncate');
    var truncateParentID = $(this).closest('.truncate')[0].id;

    if (truncateParent.hasClass('closed')) {
      $(this)[0].href = `#${truncateParentID}`;
    } else {
      $(this)[0].href = '#';
    }

    truncateParent.toggleClass('closed');
    truncateParent.find('.truncate-content').toggleClass('closed');
  });
}
////////////////////////////// Expand Accordions ///////////////////////////////
function expandAccordions() {
  $('.expand-label').click(function () {
    $(this).children('.expand-toggle').toggleClass('open');
    $(this).next('.expand-content').slideToggle(200);
  });

  // Expand accordions on load based on URL anchor
  function openAccordionByHash() {
    var hash = window.location.hash;
    if (!hash || hash.length <= 1) return;

    // Use native DOM method to handle special characters in IDs (like /)
    var id = hash.substring(1); // Remove leading #
    var anchorElement = document.getElementById(id);
    if (!anchorElement) return;

    var $anchor = $(anchorElement);

    function expandElement() {
      if ($anchor.parents('.expand').length > 0) {
        return $anchor.closest('.expand').children('.expand-label');
      } else if ($anchor.hasClass('expand')) {
        return $anchor.children('.expand-label');
      }
      return null;
    }

    var $expandLabel = expandElement();
    if ($expandLabel != null) {
      if (!$expandLabel.children('.expand-toggle').hasClass('open')) {
        $expandLabel.children('.expand-toggle').trigger('click');
      }
    }
  }

  // Open accordions by hash on page load.
  openAccordionByHash();
}
////////////////////////// Inject tooltips on load //////////////////////////////

function injectTooltips() {
  $('.tooltip').each(function () {
    const $toolTipText = $('<div/>')
      .addClass('tooltip-text')
      .text($(this).attr('data-tooltip-text'));
    const $toolTipElement = $('<div/>')
      .addClass('tooltip-container')
      .append($toolTipText);
    $(this).prepend($toolTipElement);
  });
}
//////////////////// Style time cells in tables to not wrap ////////////////////

function styleTimeCells() {
  $('.article--content table').each(function () {
    var table = $(this);

    table.find('td').each(function () {
      let cellContent = $(this)[0].innerText;

      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(cellContent)) {
        $(this).addClass('nowrap');
      }
    });
  });
}
/////////////////////// Open external links in a new tab ///////////////////////

function openExternalLinks() {
  $('.article--content a').each(function () {
    var currentHost = location.host;

    if (!$(this)[0].href.includes(currentHost)) {
      $(this).attr('target', '_blank');
    }
  });
}

/////////////////////// Initialize all functions //////////////////////////////
function initialize() {
  makeHeadersLinkable();
  smoothScroll();
  leftNavInteractions();
  mobileContentsToggle();
  truncateContent();
  expandAccordions();
  injectTooltips();
  styleTimeCells();
  openExternalLinks();
}

export { initialize, scrollToAnchor };
