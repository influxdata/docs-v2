///////////////////////////// Make headers linkable /////////////////////////////
import $ from 'jquery';
import { scrollToAnchor } from './scroll.js';

// Expand accordions on load based on URL anchor
function openAccordionByHash() {
  var anchor = window.location.hash;

  function expandElement() {
    if ($(anchor).parents('.expand').length > 0) {
      return $(anchor).closest('.expand').children('.expand-label');
    } else if ($(anchor).hasClass('expand')) {
      return $(anchor).children('.expand-label');
    }
  }

  if (expandElement() != null) {
    if (expandElement().children('.expand-toggle').hasClass('open')) {
    } else {
      expandElement().children('.expand-toggle').trigger('click');
    }
  }
}

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

var elementWhiteList = [
  '.tabs p a',
  '.code-tabs p a',
  '.children-links a',
  '.list-links a',
  'a.url-trigger',
  'a.fullscreen-close',
];

const headingElements = headingWhiteList.not(headingBlackList);

function contentInteractions() {

  headingElements.each(function () {
    function getLink(element) {
      return element.attr('href') === undefined
        ? $(element).attr('id')
        : element.attr('href');
    }
    var link = '<a href="#' + getLink($(this)) + '"></a>';
    $(this).wrapInner(link);
  });

  /////////  Smooth Scroll //////// 
  $('.article a[href^="#"]:not(' + elementWhiteList + ')').click(function (e) {
    e.preventDefault();
    scrollToAnchor(this.hash);
  });

  //////// Left Nav Interactions  /////// 
  $('.children-toggle').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('open');
    $(this).siblings('.children').toggleClass('open');
  });

    //////// Mobile Contents Toggl  ////////
  $('#contents-toggle-btn').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('open');
    $('#nav-tree').toggleClass('open');
  });

    //////// Truncate Content ////////
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

  ////////////////////////////// Expand Accordions ///////////////////////////////

  $('.expand-label').click(function () {
    $(this).children('.expand-toggle').toggleClass('open');
    $(this).next('.expand-content').slideToggle(200);
  });

  // Open accordions by hash on page load.
  openAccordionByHash();

  ////////////////////////// Inject tooltips on load //////////////////////////////

  $('.tooltip').each(function () {
    $toolTipText = $('<div/>')
      .addClass('tooltip-text')
      .text($(this).attr('data-tooltip-text'));
    $toolTipElement = $('<div/>')
      .addClass('tooltip-container')
      .append($toolTipText);
    $(this).prepend($toolTipElement);
  });

  //////////////////// Style time cells in tables to not wrap ////////////////////

  $('.article--content table').each(function () {
    var table = $(this);

    table.find('td').each(function () {
      let cellContent = $(this)[0].innerText;

      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(cellContent)) {
        $(this).addClass('nowrap');
      }
    });
  });

  /////////////////////// Open external links in a new tab ///////////////////////

  $('.article--content a').each(function () {
    var currentHost = location.host;

    if (!$(this)[0].href.includes(currentHost)) {
      $(this).attr('target', '_blank');
    }
  });
}

export default function ContentInteractions() {
  contentInteractions();
}
