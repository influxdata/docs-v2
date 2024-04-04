---
title: telegraf plugins aggregators
description: >
  The `telegraf plugins aggregators` command prints available aggregator plugins.
menu:
  telegraf_v1_ref:
    parent: telegraf plugins
weight: 304
---

The `telegraf plugins aggregators` command prints available aggregator plugins.

## Usage

```sh
telegraf [global-flags] plugins aggregators [flags]
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

### List available aggregator plugins

```sh
telegraf plugins aggregators
```
