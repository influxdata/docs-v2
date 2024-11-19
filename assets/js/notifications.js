/*
  Notification messages appear in the top right of the docs site.
  When a user closes a notification, it adds the notification ID to the
  messages array in the influxdata_docs_notifications cookie.
  IDs in the messages array are considered read and no longer appear to the user.
*/
import $ from 'jquery';

import $ from 'jquery';

// Get notification ID
function notificationID(el) {
  return $(el).attr('id');
}

// Show notifications that are within scope and haven't been read
function showNotifications() {
  $('#docs-notifications > .notification').each(function () {
    // Check if the path includes paths defined in the data-scope attribute
    // of the notification html element
    function inScope(path, scope) {
      for (let i = 0; i < scope.length; i++) {
        if (path.includes(scope[i])) {
          return true;
        }
      }
      return false;
    }

    function excludePage(path, exclude) {
      if (exclude[0].length > 0) {
        for (let i = 0; i < exclude.length; i++) {
          if (path.includes(exclude[i])) {
            return true;
          }
        }
      }
      return false;
    }

    var scope = $(this).data('scope').split(',');
    var exclude = $(this).data('exclude').split(',');
    var pageInScope = inScope(window.location.pathname, scope);
    var pageExcluded = excludePage(window.location.pathname, exclude);
    var notificationRead = window.LocalStorageAPI.notificationIsRead(
      notificationID(this),
      'message'
    );

    if (pageInScope && !pageExcluded && !notificationRead) {
      $(this).show().animate({ right: 0, opacity: 1 }, 200, 'swing');
    }
  });
}

// Hide a notification and set the notification as read
function hideNotification(el) {
  $(el)
    .closest('.notification')
    .animate({ height: 0, opacity: 0 }, 200, 'swing', function () {
      $(this).hide();
      window.LocalStorageAPI.setNotificationAsRead(
        notificationID(this),
        'message'
      );
    });
}

function initialize() {
  // Show notifications on page load
  showNotifications();

  // Hide a notification and set the notification as read
  $('.close-notification').click(function (e) {
    e.preventDefault();
    hideNotification(this);
  });

  $('.notification .show').click(function () {
    $(this).closest('.notification').toggleClass('min');
  });

  // Notification element scroll position
  const notificationsInitialPosition = parseInt(
    $('#docs-notifications').css('top'),
    10
  );
  $(window).scroll(function () {
    var notificationPosition =
      notificationsInitialPosition - scrollY > 10
        ? notificationsInitialPosition - scrollY
        : 10;
    $('#docs-notifications').css('top', notificationPosition);
  });
}

export {
  initialize,
  showNotifications,
  hideNotification,
}