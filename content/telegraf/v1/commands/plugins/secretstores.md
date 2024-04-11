---
title: telegraf plugins secretstores
description: >
  The `telegraf plugins secretstores` command prints available secretstore plugins.
menu:
  telegraf_v1_ref:
    parent: telegraf plugins
weight: 305
---

The `telegraf plugins secretstores` command prints available secretstore plugins.

## Usage

```sh
telegraf [global-flags] plugins secretstores [flags]
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

### List available secretstore plugins

```sh
telegraf plugins secretstores
```
