---
title: telegraf plugins serializers
description: >
  The `telegraf plugins serializers` command prints available serializer plugins.
menu:
  telegraf_v1_ref:
    parent: telegraf plugins
weight: 302
---

The `telegraf plugins serializers` command prints available serializer plugins.

## Usage

```sh
telegraf [global-flags] plugins serializers [flags]
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

### List available serializer plugins

```sh
telegraf plugins serializers
```

### List deprecated serializer plugins

```sh
telegraf plugins serializers --deprecated
```
