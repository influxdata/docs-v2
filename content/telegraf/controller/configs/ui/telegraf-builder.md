---
title: Use the Telegraf Builder
description: >
  Use the **Telegraf Builder** visual interface in {{% product-name %}} to
  manage and configure Telegraf plugins.
menu:
  telegraf_controller:
    name: Telegraf Builder
    parent: Configuration UI tools
weight: 202
---

The **Telegraf Builder** is a visual interface for managing and configuring
Telegraf plugins in a configuration. The builder is available when creating or
updating a configuration.

{{< img-hd src="/img/telegraf/controller-telegraf-builder.png" alt="Telegraf Builder in Telegraf Controller" />}}

The Telegraf builder is divided into two main panes:

- [Plugin Library pane](#plugin-library-pane): Search for and add supported plugins
- [Configuration pane](#configuration-pane): Manage agent and plugin settings

## Plugin Library pane

The **Plugin Library** pane provides a list of all Telegraf plugins supported in
in the builder grouped by plugin type.

> [!Important]
> #### The Telegraf Builder does not support all Telegraf plugins
> 
> We are in the process of adding support for more Telegraf plugins in the
> Telegraf Builder. You can use plugins that are not currently supported by the
> builder, but you must add and edit them with the Code Editor.

- **Search plugins**: Use the search bar in the Plugin Library pane to search
  for Telegraf plugins. Search by plugin name, identifier, or description.
- **Add plugins to your configuration**: Click **{{% icon "plus" %}}** next to the
  plugin to add it to your configuration.

## Configuration pane

The **Configuration** pane lets you manage agent and plugin-specific settings.
Configuration options and plugins are each represented by "cards".
Click on a card or expand or hide its contents.

Each configuration has at least two cards: [Agent Settings](#agent-settings)
and [Global Tags](#global-tags).

### Agent settings

Agent settings are those that specify how the agent runs rather than
plugin-specific settings. Agent settings only need to be included in a
configuration when they vary from the
[default Telegraf agent settings](/telegraf/v1/configuration/#agent-configuration).

**To include agent settings in your configuration:**

1.  On the **Agent Settings** card, enable the
    **{{% icon "toggle" %}} Include in config** toggle.
2.  Define custom settings for any of the available Telegraf agent settings.

### Global tags

Telegraf applies global tags to all metrics that it emits. Global tags are not
required and only need to be included in a configuration when set.

**To include global tags in your configuration:**

1.  On the **Global Tags** card, enable the
    **{{% icon "toggle" %}} Include in config** toggle.
2.  Click **{{% icon "plus" %}} Add Global Tag**.
3.  Provide a key and a value for the global tag.
4.  Repeat steps 2-3 for additional global tags.

### Plugin cards

The Telegraf Builder represents each Telegraf plugin as a card. Plugin cards
have three tabs:

- [Plugin](#plugin): Plugin-specific settings
- [Customize](#customize): Plugin customization options
- [Filter](#filter): Plugin metric filters

#### Plugin

The **Plugin** tab in a plugin card lets you customize settings specific
to that plugin.

> [!Note]
> You can use [dynamic values](/telegraf/controller/configs/dynamic-values/)
> when defining plugin settings in the Telegraf Builder.

#### Customize

The **Customize** tab in a plugin card lets you apply plugin customizations
including the following:

- **Add a plugin alias**: Aliases help to identify plugins in your
  configuration. They are especially helpful when you have more than one of the
  same plugin. When you define a plugin alias, the builder uses the alias as the
  plugin name on the plugin card.

- **Add configuration labels**: Telegraf configuration labels let you label and
  select what plugins to run when starting Telegraf. For more information about
  using labels and selectors, see
  [Plugin selection via labels and selectors](/telegraf/v1/configuration/#plugin-selection-via-labels-and-selectors)

- **Other customizations specific to the plugin type**

#### Filter

The **Filter** tab on a plugin card lets you add metric filters to the plugin.
These filters include `namepass`, `namedrop`, `tagpass`, `tagdrop`, and others.

For more information about using Telegraf plugin filters, see
[Metric filtering](/telegraf/v1/configuration/#metric-filtering).

#### Remove a plugin from the configuration

To remove a plugin from the configuration, click the **{{% icon "trash" %}}**
icon on the plugin card.
