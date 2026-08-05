---
title: Telegraf configuration UI tools
description: >
  Use Telegraf configuration user interface tools in {{% product-name %}} to
  create, edit, and update Telegraf TOML configuration files.
  Upload or write raw TOML in the **Code Editor** or use the
  **Telegraf Builder** visual interface to manage and configure plugins.
menu:
  telegraf_controller:
    name: Configuration UI tools
    parent: Manage configurations
weight: 104
---

Use Telegraf configuration user interface tools in Telegraf Controller to
create, edit, and update Telegraf TOML configuration files.
{{% product-name %}} provides two configuration tools:

- **Code Editor**: Upload or manually write raw Telegraf configuration TOML.
- **Telegraf Builder**: Use a visual interface to manage and configure
  Telegraf plugins. _The Telegraf Builder is currently a beta feature._

## Focus mode

Use focus mode to expand the configuration editing area to fill your browser
window while you work. Focus mode applies to both the Code Editor and the
Telegraf Builder and is available when creating or editing a configuration.

- To enter focus mode, click **{{% icon "fullscreen" %}} Focus** in the upper
  right of the configuration editing area.
- To exit focus mode, click **{{% icon "fullscreen" %}} Unfocus** or press
  {{< keybind mac="Esc" other="Esc" >}}.

Focus mode does not persist between page loads. Reloading the page returns the
configuration editing area to the standard view.

{{< children hlevel="h2" >}}
