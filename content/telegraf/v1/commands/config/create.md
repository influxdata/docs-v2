---
title: telegraf config create
description: >
  The `telegraf config create` command returns a full Telegraf configuration
  containing all plugins as an example. You can also apply section or plugin
  filters to reduce the output to the plugins you need.
menu:
  telegraf_v1_ref:
    parent: telegraf config
weight: 301
---

The `telegraf config create` command returns a full Telegraf configuration
containing all plugins as an example. You can also apply section or plugin
filters to reduce the output to the plugins you need.

## Usage

```sh
telegraf [global-flags] config create [flags]
```

## Flags

| Flag |                        | Description                                                                                                                              |
| :--- | :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
|      | `--section-filter`     | Filter sections to print separated by `:` (Valid values are `agent`, `global_tags`, `outputs`, `processors`, `aggregators` and `inputs`) |
|      | `--input-filter`       | Filter inputs to enable separated by `:`                                                                                                 |
|      | `--output-filter`      | Filter outputs to enable separated by `:`                                                                                                |
|      | `--aggregator-filter`  | Filter aggregators to enable separated by `:`                                                                                            |
|      | `--processor-filter`   | Filter processors to enable separated by `:`                                                                                             |
|      | `--secretstore-filter` | Filter secret-stores to enable separated by `:`                                                                                          |
| `-h` | `--help`               | Show command help                                                                                                                        |

{{% caption %}}
_Also see [Telegraf global flags](/telegraf/v1/commands/#telegraf-global-flags)._
{{% /caption %}}

## Examples

- [Create a full configuration](#create-a-full-configuration)
- [Create a full configuration as save it to a file](#create-a-full-configuration-as-save-it-to-a-file)
- [Create a configuration with specific sections and plugins](#create-a-configuration-with-specific-sections-and-plugins)

### Create a full configuration

```sh
telegraf config create
```

### Create a full configuration as save it to a file

```sh
telegraf config create > telegraf.conf
```

### Create a configuration with specific sections and plugins

To print a configuration containing only a Modbus input plugin and an
InfluxDB v2 output plugin, run the following:

```sh
telegraf config create \
  --section-filter "inputs:outputs" \
  --input-filter "modbus" \
  --output-filter "influxdb_v2"
```
