---
title: Configure Telegraf
description: >
  Overview of the Telegraf configuration file: generating and loading
  configuration, agent settings, plugin options, metric filtering, and
  environment variables.
aliases:
  - /telegraf/v1/administration/configuration/
menu:
  telegraf_v1:
    name: Configure Telegraf
weight: 5
related:
  - /telegraf/v1/get-started/
  - /telegraf/v1/concepts/data-pipeline/
---

Telegraf uses a [TOML](/telegraf/v1/configuration/toml/) configuration file
to define which plugins to enable and which settings to use when Telegraf
starts.
To be valid, a configuration must define at least one input plugin and at
least one output plugin.

> [!Note]
> See [Get started](/telegraf/v1/get-started/) to quickly get up and
> running with Telegraf.

The following pages cover each configuration topic in depth:

{{< children >}}

The rest of this page is a quick reference that maps the parts of a
configuration file to the pages that document them.

## Generate a configuration file

The `telegraf config` command creates a configuration file with plugins you
select:

```sh
telegraf --input-filter cpu:mem --output-filter influxdb_v3 config > telegraf.conf
```

See [Generate a configuration file](/telegraf/v1/configuration/file/#generate-a-configuration-file)
and the [telegraf config command](/telegraf/v1/commands/config/).

## Configuration file locations

Telegraf loads configuration from the path in the `--config` flag, the
`TELEGRAF_CONFIG_PATH` environment variable, or a default location for your
operating system.
Load additional files with `--config-directory`, and load remote
configuration by passing a URL to `--config`.

See [Configuration file locations](/telegraf/v1/configuration/file/#configuration-file-locations)
and [Load configuration from a URL](/telegraf/v1/configuration/file/#load-configuration-from-a-url).

## Set environment variables

Reference environment variables anywhere in the configuration file with
`${VARIABLE_NAME}` syntax.
See [Use environment variables](/telegraf/v1/configuration/environment-variables/).

## Secret stores

Keep credentials out of plain-text configuration files with secret store
plugins, and reference secrets as `@{store_id:secret_key}`.

### Secret-store secrets {id="secret-store-secrets"}

Plugin options that support secrets accept the `@{store_id:secret_key}`
syntax.
See [Store secrets](/telegraf/v1/configuration/secrets/) for configuring
secret stores, referencing secrets, and managing them with the
[telegraf secrets command](/telegraf/v1/commands/secrets/).

## Global tags

Define tags in the `[global_tags]` table in `key = "value"` format.
Telegraf applies global tags to all metrics gathered on the host.
See the [configuration file anatomy](/telegraf/v1/configuration/file/).

## Agent configuration

The `[agent]` table controls collection intervals, batching and buffering,
flushing, logging, and other agent-wide behavior.
See [Agent settings](/telegraf/v1/configuration/agent/) for every setting
with types and defaults.

### Intervals {id="intervals"}

Scheduling settings, including `interval`, `round_interval`,
`collection_jitter`, `collection_offset`, `flush_interval`, and
`flush_jitter`, control when Telegraf collects and writes metrics.
See [Collection scheduling](/telegraf/v1/configuration/agent/#collection-scheduling)
in the agent settings reference.

## Plugins {id="plugins"}

Enable a plugin by adding its TOML table to the configuration file, for
example `[[inputs.cpu]]` or `[[outputs.influxdb_v3]]`.
You can define multiple instances of any plugin.
Each plugin's specific options are documented in the
[Plugin directory](/telegraf/v1/plugins/), and all plugins share a set of
[common options](/telegraf/v1/configuration/plugin-options/) such as
`alias`, `interval`, `name_override`, and `tags`.

### Input configuration

Input plugins collect metrics.
See [Collect data with input plugins](/telegraf/v1/configure_plugins/input_plugins/)
and [input plugin options](/telegraf/v1/configuration/plugin-options/#input-plugin-options).

### Output configuration

Output plugins write metrics to destinations.
See [Write data with output plugins](/telegraf/v1/configure_plugins/output_plugins/)
and [output plugin options](/telegraf/v1/configuration/plugin-options/#output-plugin-options).

### Processor configuration

Processor plugins transform metrics as they pass through the pipeline.
See [Processors and aggregators](/telegraf/v1/configure_plugins/aggregator_processor/)
and [processor plugin options](/telegraf/v1/configuration/plugin-options/#processor-plugin-options).

### Aggregator configuration

Aggregator plugins produce windowed aggregate metrics.
See [Processors and aggregators](/telegraf/v1/configure_plugins/aggregator_processor/)
and [aggregator plugin options](/telegraf/v1/configuration/plugin-options/#aggregator-plugin-options).

## Metric filtering

Metric filters attach to any plugin and control which metrics that plugin
handles.
See [Filter metrics](/telegraf/v1/configuration/filtering/) for the full
reference and worked examples.

### Filters

#### Selectors

Selectors decide whether a plugin handles a metric: `namepass`, `namedrop`,
`tagpass`, `tagdrop`, and `metricpass`.
See [Selectors](/telegraf/v1/configuration/filtering/#selectors).

#### Modifiers

Modifiers decide which tags and fields remain on a metric: `fieldinclude`,
`fieldexclude`, `taginclude`, and `tagexclude`.
See [Modifiers](/telegraf/v1/configuration/filtering/#modifiers).

### Filtering examples

For complete worked examples of every filter option, see
[filtering examples](/telegraf/v1/configuration/filtering/#examples).

## Plugin selection via labels and selectors

Label plugin instances in the configuration file and use the `--select`
flag to enable only matching plugins at startup.
See [Labels and selectors](/telegraf/v1/configuration/labels-selectors/).
