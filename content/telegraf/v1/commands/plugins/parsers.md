---
title: telegraf plugins parsers
description: >
  The `telegraf plugins parsers` command prints available parser plugins.
menu:
  telegraf_v1_ref:
    parent: telegraf plugins
weight: 302
---

The `telegraf plugins parsers` command prints available parser plugins.

## Usage

```sh
telegraf [global-flags] plugins parsers [flags]
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

### List available parser plugins

```sh
telegraf plugins parsers
```

### List deprecated parser plugins

```sh
telegraf plugins parsers --deprecated
```
