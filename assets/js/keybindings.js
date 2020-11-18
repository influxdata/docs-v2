// Dynamically update keybindings or hotkeys
function getPlatform() {
  if (/Mac/.test(navigator.platform)) {
    return "osx"
  } else if (/Win/.test(navigator.platform)) {
    return "win"
  } else if (/Linux/.test(navigator.platform)) {
    return "linux"
  } else {
    return "other"
  }
}

const platform = getPlatform()

function addOSClass(osClass) {
  $('.keybinding').addClass(osClass)
}

function updateKeyBindings() {
  $('.keybinding').each(function() {
    var osx = $(this).data("osx")
    var linux = $(this).data("linux")
    var win = $(this).data("win")

    if (platform === "other") {
      if (win != linux) {
        var keybind = '<code class="osx">' + osx + '</code> for macOS, <code>' + linux + '</code> for Linux, and <code>' + win + '</code> for Windows';
      } else {
        var keybind = '<code>' + linux + '</code> for Linux and Windows and <code class="osx">' + osx + '</code> for macOS';
      }
    } else {
      var keybind = '<code>' + $(this).data(platform) + '</code>'
    }

    $(this).html(keybind)
  })
}

addOSClass(platform)
updateKeyBindings()
