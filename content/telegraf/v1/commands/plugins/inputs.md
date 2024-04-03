---
title: telegraf plugins inputs
description: >
  The `telegraf plugins inputs` command prints available input plugins.
menu:
  telegraf_v1_ref:
    parent: telegraf plugins
weight: 301
---

The `telegraf plugins inputs` command prints available input plugins.

## Usage

```sh
telegraf [global-flags] plugins inputs [flags]
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

### List available input plugins

```sh
telegraf plugins inputs
```

### List deprecated input plugins

```sh
telegraf plugins inputs --deprecated
```
