---
title: telegraf plugins outputs
description: >
  The `telegraf plugins outputs` command prints available output plugins.
menu:
  telegraf_v1_ref:
    parent: telegraf plugins
weight: 302
---

The `telegraf plugins outputs` command prints available output plugins.

## Usage

```sh
telegraf [global-flags] plugins outputs [flags]
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

### List available output plugins

```sh
telegraf plugins outputs
```

### List deprecated output plugins

```sh
telegraf plugins outputs --deprecated
```
