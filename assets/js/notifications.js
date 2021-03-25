// Get notification cookie name
function notificationCookieName(el) {
  return "influx-" + $(el).attr('id') + "-notification-seen"
}

// Show notifications that are within scope and haven't been ssen
function showNotifications() {
  $('#docs-notifications > .notification').each(function() {

    // Check if the path includes paths defined in the data-scope attribute
    // of the notification html element
    function inScope(path, scope) {
      for(let i = 0; i < scope.length; i++){
        if (path.includes(scope[i])) {
          return true;
        };
      }
      return false;
    }

    var scope = $(this).data('scope').split(',')
    var pageInScope = inScope(window.location.pathname, scope)
    var notificationCookie = Cookies.get( notificationCookieName(this) )

    if (pageInScope && notificationCookie != 'true') {
      $(this).show().animate({right: 0, opacity: 1}, 200, 'swing')
    }
  });
}

// Hide a notification and set cookie as true
function hideNotification(el) {
  $(el).closest('.notification').animate({height: 0, opacity: 0}, 200, 'swing', function(){
    $(this).hide();
    Cookies.set(notificationCookieName(this), true);
  });
}

// Show notifications on page load
showNotifications()

// Hide a notification and set see cookie to true
$('.close-notification').click(function(e) {
  e.preventDefault();
  hideNotification(this);
})