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

function addOSClass(osClass, { $component }) {
  $component.addClass(osClass)
}

function updateKeyBindings({ $component }) {
    var osx = $component.data("osx")
    var linux = $component.data("linux")
    var win = $component.data("win")

    if (platform === "other") {
      if (win != linux) {
        var keybind = '<code class="osx">' + osx + '</code> for macOS, <code>' + linux + '</code> for Linux, and <code>' + win + '</code> for Windows';
      } else {
        var keybind = '<code>' + linux + '</code> for Linux and Windows and <code class="osx">' + osx + '</code> for macOS';
      }
    } else {
      var keybind = '<code>' + $component.data(platform) + '</code>'
    }

    $component.html(keybind)
}

export default function KeyBinding({ component }) {
  // Initialize keybindings
  const platform = getPlatform();
  const $component = $(component);
  addOSClass(platform, { $component });
  updateKeyBindings({ $component });
}
