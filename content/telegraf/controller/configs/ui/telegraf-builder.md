---
title: Use the Telegraf Builder
description: >
  Use the **Telegraf Builder** visual interface in {{% product-name %}} to
  manage and configure Telegraf plugins. The Telegraf Builder is a beta
  feature; for a generally available alternative, use the Code Editor.
menu:
  telegraf_controller:
    name: Telegraf Builder
    parent: Configuration UI tools
    params:
      state: beta
weight: 202
---

The **Telegraf Builder** is a visual interface for managing and configuring
Telegraf plugins in a configuration. The builder is available when creating or
updating a configuration.

To expand the builder to fill your browser window while you work, use
[focus mode](/telegraf/controller/configs/ui/#focus-mode).

> [!Important]
> #### The Telegraf Builder is a beta feature
>
> The Telegraf Builder is in beta. Some plugins or options may be missing or
> incomplete. For a generally available alternative, use the
> [Code Editor](/telegraf/controller/configs/ui/code-editor/) to upload, write,
> or edit raw Telegraf configuration TOML.

{{< img-hd src="/img/telegraf/controller-telegraf-builder.png" alt="Telegraf Builder in Telegraf Controller" />}}

The Telegraf builder is divided into two main panes:

- [Plugin Library pane](#plugin-library-pane): Search for and add supported plugins
- [Configuration pane](#configuration-pane): Manage agent and plugin settings

## Plugin Library pane

The **Plugin Library** pane provides a list of all Telegraf plugins supported
in the builder grouped by plugin type.

The Plugin Library includes every input, output, processor, aggregator, and
secret store plugin in Telegraf v1.40.
Plugin settings are labeled with their Telegraf option names, such as
`access_key_id`, so you can look them up in the
[Telegraf plugin documentation](/telegraf/v1/plugins/).

> [!Note]
> #### Plugins removed from Telegraf
>
> Telegraf 1.40 removed the Aerospike input plugin (`inputs.aerospike`) and
> refuses to load a configuration that contains it.
> The Plugin Library no longer offers the plugin, and the Builder shows a
> warning on configurations that still contain it.
> Use `inputs.prometheus` with the Aerospike Prometheus Exporter instead.

- **Search plugins**: Use the search bar in the Plugin Library pane to search
  for Telegraf plugins. Search by plugin name, identifier, or description.
- **Add plugins to your configuration**: Click **{{% lucide "plus" %}}** next to the
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
2.  Click **{{% lucide "plus" %}} Add Global Tag**.
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
> You can [substitute values](/telegraf/controller/configs/substitute-values/)
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

To remove a plugin from the configuration, click the **{{% lucide "trash-2" %}}**
icon on the plugin card.

### Settings kept from TOML

A configuration written by hand or uploaded in the Code Editor can contain
plugin settings that the Builder's form can't edit: an option the form doesn't
model, or a value in a shape the Builder can't read.
The Builder keeps those settings exactly as written and writes them back when
you save, so nothing in the configuration is lost.

The plugin card shows the chip
**N settings kept from TOML as written (not loaded into this form)**.
Hover over the chip to list the settings.
To change a kept setting, use the
[Code Editor](/telegraf/controller/configs/ui/code-editor/).

- If you edit a setting in the form that was kept from TOML, the form's value
  replaces the kept one.
- Nested tables are kept whole.
  For example, one option the Builder can't read inside an
  `[[inputs.file.json_v2]]` table keeps the entire table as written.
- Changing a plugin's `data_format` removes the kept settings that belong to
  the previous format.

If the Builder can't read a plugin at all, a notice lists the plugin as kept
as written when you open the configuration, and the plugin isn't shown in the
Builder.
Fix the plugin in the Code Editor to edit it in the Builder.

### Data format options

Telegraf plugins that read or write a data format show a **data_format**
setting.
After you choose a format, a **Data Format Options** panel shows the options
Telegraf defines for that format.
See [Telegraf data formats](/telegraf/v1/data_formats/).

Only plugins that Telegraf gives a parser or a serializer have the setting.
A data format on any other plugin, such as `inputs.cpu` or
`outputs.influxdb_v2`, makes Telegraf reject the configuration.

{{< expand-wrapper >}}
{{% expand "Plugins with a data format setting" %}}

Input plugins (parsers): `inputs.amqp_consumer`, `inputs.cloud_pubsub`,
`inputs.cloud_pubsub_push`, `inputs.directory_monitor`,
`inputs.eventhub_consumer`, `inputs.exec`, `inputs.execd`, `inputs.file`,
`inputs.firehose`, `inputs.google_cloud_storage`, `inputs.http`,
`inputs.http_listener_v2`, `inputs.kafka_consumer`, `inputs.kinesis_consumer`,
`inputs.mqtt_consumer`, `inputs.nats_consumer`, `inputs.nsq_consumer`,
`inputs.socket_listener`, and `inputs.tail`.

Output plugins (serializers): `outputs.amqp`, `outputs.cloud_pubsub`,
`outputs.event_hubs`, `outputs.exec`, `outputs.execd`, `outputs.file`,
`outputs.http`, `outputs.inlong`, `outputs.kafka`, `outputs.kinesis`,
`outputs.mqtt`, `outputs.nats`, `outputs.nsq`, `outputs.remotefile`,
`outputs.socket_writer`, `outputs.stomp`, `outputs.sumologic`, and
`outputs.websocket`.

Processor plugins: `processors.parser` (parser) and `processors.execd`
(parser and serializer).

{{% /expand %}}
{{< /expand-wrapper >}}

`processors.execd` uses one `data_format` for both the data it sends to the
external program and the data it reads back, so its card shows a
**Parser Options** panel and a **Serializer Options** panel for the same
format.

Changing `data_format` clears the options of the previous format.

### Secret values

Settings that hold secrets, such as passwords, tokens, and keys, are masked
while you type.
Click {{% lucide "eye" %}} to show a value and {{% lucide "eye-off" %}} to hide
it again.
The value is written to the configuration in plain text either way.
To keep secrets out of the configuration, use a
[secret store plugin](/telegraf/v1/secretstore-plugins/) or
[substitute values](/telegraf/controller/configs/substitute-values/).
