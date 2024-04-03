---
title: telegraf plugins
description: >
  The `telegraf plugins` command prints available Telegraf plugins.
menu:
  telegraf_v1_ref:
    parent: Telegraf commands
weight: 201
---

The `telegraf plugins` command prints available Telegraf plugins.

## Usage

```sh
telegraf [global-flags] plugins [subcommand] [flags]
```

## Subcommands

| Subcommand                                                  | Description                         |
| :---------------------------------------------------------- | :---------------------------------- |
| [inputs](/telegraf/v1/commands/plugins/inputs/)             | Print available input plugins       |
| [outputs](/telegraf/v1/commands/plugins/outputs/)           | Print available output plugins      |
| [processors](/telegraf/v1/commands/plugins/processors/)     | Print available processor plugins   |
| [aggregators](/telegraf/v1/commands/plugins/aggregators/)   | Print available aggregator plugins  |
| [secretstores](/telegraf/v1/commands/plugins/secretstores/) | Print available secretstore plugins |
| help, h                                                     | Shows command help                  |

## Flags

| Flag |                | Description                   |
| :--- | :------------- | :---------------------------- |
|      | `--deprecated` | Print only deprecated plugins |
| `-h` | `--help`       | Show command help             |

{{% caption %}}
_Also see [Telegraf global flags](/telegraf/v1/commands/#telegraf-global-flags)._
{{% /caption %}}

## Examples

