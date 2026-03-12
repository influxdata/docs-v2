---
title: Use the Code Editor
description: >
  Use the {{% product-name %}} **Code Editor** to upload, write, or edit raw
  Telegraf configuration TOML.
menu:
  telegraf_controller:
    name: Code Editor 
    parent: Configuration UI tools
weight: 201
related:
  - /telegraf/controller/configs/dynamic-values/
---

Use the {{% product-name %}} **Code Editor** to upload, write, or edit raw
Telegraf configuration TOML.

{{< img-hd src="/img/telegraf/controller-code-editor.png" alt="Telegraf Controller Code Editor" />}}

The Code Editor is the default view when managing a configuration. If it is not
displayed, click the **Code Editor** tab.

> [!Important]
> #### Switching from the Code Editor to the Telegraf Builder
> 
> Switching from the Code Editor to the Telegraf Builder will reformat the TOML.
> When reformatting, Telegraf Builder does **not** preserve the following:
>
> - Comments
> - Indentation
> - Plugin Order

## Upload TOML

To upload a Telegraf configuration file to {{% product-name %}}, click
**Upload files** to open a file selection dialogue box or drag and drop your
configuration file into the Code Editor.

{{% product-name %}} supports TOML-formatted files with the following extensions:

- `.toml`
- `.conf`
- `.txt`

> [!Important]
> Uploaded configuration files fully replace any existing configuration TOML.

## Manually write or edit TOML

The Code Editor is a feature-rich, browser-based editor that lets you write
code using keyboard shortcuts similar to those in popular editors and IDEs.

### Keymaps

The Code Editor uses CodeMirror's default keymaps.
The following bindings come from the reference keymaps.

- {{< keybind mac="←" other="ArrowLeft" >}}: Move left one character (Shift selects)
- {{< keybind mac="→" other="ArrowRight" >}}: Move right one character (Shift selects)
- {{< keybind mac="↑" other="ArrowUp" >}}: Move up one line (Shift selects)
- {{< keybind mac="↓" other="ArrowDown" >}}: Move down one line (Shift selects)
- {{< keybind mac="⌥←" other="Ctrl+ArrowLeft" >}}: Move left by word group (Shift selects)
- {{< keybind mac="⌥→" other="Ctrl+ArrowRight" >}}: Move right by word group (Shift selects)
- {{< keybind mac="⌃←" other="Alt+ArrowLeft" >}}: Move left by syntax unit (Shift selects)
- {{< keybind mac="⌃→" other="Alt+ArrowRight" >}}: Move right by syntax unit (Shift selects)
- {{< keybind all="⌘←" >}} (macOS only): Move to line start (Shift selects)
- {{< keybind all="⌘→" >}} (macOS only): Move to line end (Shift selects)
- {{< keybind mac="⌥↑" other="Alt+ArrowUp" >}}: Move line up
- {{< keybind mac="⌥↓" other="Alt+ArrowDown" >}}: Move line down
- {{< keybind mac="⇧⌥↑" other="Shift+Alt+ArrowUp" >}}: Copy line up
- {{< keybind mac="⇧⌥↓" other="Shift+Alt+ArrowDown" >}}: Copy line down
- {{< keybind mac="⌘⌥↑" other="Ctrl+Alt+ArrowUp" >}}: Add cursor above
- {{< keybind mac="⌘⌥↓" other="Ctrl+Alt+ArrowDown" >}}: Add cursor below
- {{< keybind all="⌘↑" >}} (macOS only) or {{< keybind mac="⌘Home" other="Ctrl+Home" >}}: Move to document start (Shift selects)
- {{< keybind all="⌘↓" >}} (macOS only) or {{< keybind mac="⌘Home" other="Ctrl+End" >}}: Move to document end (Shift selects)
- {{< keybind all="⌃↑" >}} (macOS only) or {{< keybind mac="PageUp" other="PageUp" >}}: Page up (Shift selects)
- {{< keybind all="⌃↓" >}} (macOS only) or {{< keybind mac="PageDown" other="PageDown" >}}: Page down (Shift selects)
- {{< keybind mac="Home" other="Home" >}}: Move to line boundary backward (Shift selects)
- {{< keybind mac="End" other="End" >}}: Move to line boundary forward (Shift selects)
- {{< keybind mac="↩" other="Enter" >}} and {{< keybind mac="⇧↩" other="Shift+Enter" >}}: Insert newline and indent
- {{< keybind mac="⌘↩" other="Ctrl+Enter" >}}: Insert blank line
- {{< keybind mac="⌘A" other="Ctrl+A" >}}: Select all
- {{< keybind mac="⌃L" other="Alt+L" >}}: Select line
- {{< keybind mac="⌘I" other="Ctrl+I" >}}: Select parent syntax
- {{< keybind mac="Esc" other="Esc" >}}: Simplify selection
- {{< keybind mac="⌘[" other="Ctrl+[" >}}: Indent less
- {{< keybind mac="⌘]" other="Ctrl+]" >}}: Indent more
- {{< keybind mac="⇧⌘K" other="Shift+Ctrl+K" >}}: Delete line
- {{< keybind mac="⇧⌘&bsol;" other="Shift+Ctrl+&bsol;" >}}: Jump to matching bracket
- {{< keybind mac="⌘/" other="Ctrl+/" >}}: Toggle line comment
- {{< keybind mac="⇧⌥A" other="Shift+Alt+A" >}}: Toggle block comment
- {{< keybind mac="⌫" other="Backspace" >}}: Delete character backward
- {{< keybind mac="fn⌫" other="Delete" >}}: Delete character forward
- {{< keybind mac="⌥⌫" other="Ctrl+Backspace" >}}: Delete word group backward
- {{< keybind mac="⌥ fn⌫" other="Ctrl+Delete" >}}: Delete word group forward
- {{< keybind all="⌘⌫" >}} (macOS only): Delete to line start
- {{< keybind all="⌘ fn⌫" >}} (macOS only): Delete to line end

### Dynamic value syntax highlighting

The {{% product-name %}} Code Editor automatically applies special syntax
highlighting to dynamic values (parameters, environment variables, and secrets)
in your configuration TOML to make them more visible.

For more information about using dynamic values, see
[Use dynamic values](/telegraf/controller/configs/dynamic-values/).
