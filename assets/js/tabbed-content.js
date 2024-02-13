//////////////////////////////// Tabbed Content ////////////////////////////////

/**
 * NOTE: Tab <a> elements are whitelisted elements that do not trigger
 * smoothscroll when clicked. The whitelist is defined in content-interactions.js.
 **/

function tabbedContent (container, tab, content) {
  // Add the active class to the first tab in each tab group,
  // in case it wasn't already set in the markup.
  $(container).each(function () {
    $(tab, this).removeClass('is-active');
    $(tab + ':first', this).addClass('is-active');
  });

  $(tab).on('click', function (e) {
    e.preventDefault();

    // Make sure the tab being clicked is marked as active, and make the rest inactive.
    $(this).addClass('is-active').siblings().removeClass('is-active');

    // Render the correct tab content based on the position of the tab being clicked.
    const activeIndex = $(tab).index(this);
    $(content).each(function (i) {
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
function getApiLibPreference () {
  return getPreference('api_lib') || '';
}

function getTabQueryParam () {
  const queryParams = new URLSearchParams(window.location.search);
  return $('<textarea />').html(queryParams.get('t')).text();
}

// Add query param to .keep-tab paginated navigation buttons to persist tab
// selection when navigating between the pages.
function updateBtnURLs (tabId, op = 'update') {
  $('a.keep-tab').each(function () {
    var link = $(this)[0].href;
    var tabStr = tabId.replace(/ /, '+');

    if (op === 'delete') {
      $(this)[0].href = link.replace(/\?t.*$/, '');
    } else {
      $(this)[0].href = link.replace(/($)|(\?t=.*$)/, `?t=${tabStr}`);
    }
  });
}

function activateTabs (selector, tab) {
  const anchor = window.location.hash;
  if (tab !== '') {
    let targetTab = $(`${selector} a:contains("${tab}")`);
    if (!targetTab.length) {
      targetTab = Array.from(document.querySelectorAll(`${selector} a`)).find(
        function (el) {
          let targetText =
            el.text && el.text.toLowerCase().replace(/[^a-z0-9]/, '');
          return targetText && tab.includes(targetText);
        }
      );
    }
    if (targetTab) {
      $(targetTab).click();
      scrollToAnchor(anchor);
    }
  }

  const queryParams = new URLSearchParams(window.location.search);
  $(`${selector} p a`).click(function () {
    if ($(this).is(':not(":first-child")')) {
      queryParams.set('t', $(this).html());
      window.history.replaceState(
        {},
        '',
        `${location.pathname}?${queryParams}${anchor}`
      );
      updateBtnURLs($(this).html());
    } else {
      queryParams.delete('t');
      window.history.replaceState({}, '', `${location.pathname}${anchor}`);
      updateBtnURLs($(this).html(), 'delete');
    }
  });
}

//////////////////// Activate Tab with Cookie or Query Param ///////////////////
/**
 * Activate code-tabs based on the cookie then override with query param.
 **/
var tab = getApiLibPreference();
['.code-tabs'].forEach(
  selector => activateTabs(selector, tab),
  updateBtnURLs(tab)
);

tab = getTabQueryParam();
['.tabs', '.code-tabs'].forEach(
  selector => activateTabs(selector, tab),
  updateBtnURLs(tab)
);
