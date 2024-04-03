---
title: telegraf secrets
description: >
  The `telegraf secrets` command manages secrets in secret stores to use with Telegraf.
menu:
  telegraf_v1_ref:
    parent: Telegraf commands
weight: 201
---

The `telegraf secrets` command manages secrets in secret stores to use with Telegraf.

## Usage

```sh
telegraf [global-flags] secrets [subcommand] [flags]
```

## Subcommands

| Subcommand                                  | Description                                        |
| :------------------------------------------ | :------------------------------------------------- |
| [list](/telegraf/v1/commands/secrets/list/) | List known secrets and secret stores               |
| [get](/telegraf/v1/commands/secrets/get/)   | Retrieve the value of a secret from a secret store |
| [set](/telegraf/v1/commands/secrets/set/)   | Create or modify a secret in a secret store        |
| `help`, `h`                                 | Shows command help                                 |

## Flags

| Flag |          | Description       |
| :--- | :------- | :---------------- |
| `-h` | `--help` | Show command help |

{{% caption %}}
_Also see [Telegraf global flags](/telegraf/v1/commands/#telegraf-global-flags)._
{{% /caption %}}
