---
title: telegraf config
description: >
  The `telegraf config` command generates and migrations Telegraf configuration files.
menu:
  telegraf_v1_ref:
    parent: Telegraf commands
weight: 201
---

The `telegraf config` command generates and migrations Telegraf configuration files.

## Usage

```sh
telegraf [global-flags] config [subcommand] [flags]
```

## Subcommands

| Subcommand                                                                     | Description                                     |
| :----------------------------------------------------------------------------- | :---------------------------------------------- |
| [create](/telegraf/v1/commands/config/create/) <em class="op50">(default)</em> | Create and output a Telegraf configuration      |
| [migrate](/telegraf/v1/commands/config/migrate/)                               | Migrate deprecated plugins to supported plugins |
| help, h                                                                        | Show command help                               |

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
telegraf config
```

### Create a full configuration as save it to a file

```sh
telegraf config > telegraf.conf
```

### Create a configuration with specific sections and plugins

To print a configuration containing only a Modbus input plugin and an
InfluxDB v2 output plugin, run the following:

```sh
telegraf config \
  --section-filter "inputs:outputs" \
  --input-filter "modbus" \
  --output-filter "influxdb_v2"
```
