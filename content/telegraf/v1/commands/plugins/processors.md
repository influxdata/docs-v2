---
title: telegraf plugins processors
description: >
  The `telegraf plugins processors` command prints available processor plugins.
menu:
  telegraf_v1_ref:
    parent: telegraf plugins
weight: 303
---

The `telegraf plugins processors` command prints available processor plugins.

## Usage

```sh
telegraf [global-flags] plugins processors [flags]
```

## Flags

| Flag |                | Description                   |
| :--- | :------------- | :---------------------------- |
|      | `--deprecated` | Print only deprecated plugins |
| `-h` | `--help`       | Show command help             |

{{% caption %}}
_Also see [Telegraf global flags](/telegraf/v1/commands/#telegraf-global-flags)._
{{% /caption %}}

## Examples

### List available processor plugins

```sh
telegraf plugins processors
```
