---
title: telegraf secrets set
description: >
  The `telegraf secrets set` command creates or modify a secret in a specified
  secret store.
menu:
  telegraf_v1_ref:
    parent: telegraf secrets
weight: 301
---

The `telegraf secrets set` command creates or modify a secret in a specified secret store.

{{% note %}}
This command requires your configuration file that contains the secret store
definitions you want to access. If the `--config` or `--config-directory` flags
are not included in the command, Telegraf checks the
[default configuration file location](/telegraf/v1/configuration/#configuration-file-locations).
{{% /note %}}

Use [`telegraf secrets list`](/telegraf/v1/commands/secrets/list/) to get the
IDs of available secret stores and the available secret keys.

If you haven't configured a secret store, use
[`telegraf plugins secretstores`](/telegraf/v1/commands/plugins/secretstores/)
to list available secret store plugins.
View secret store plugin configuration documentation in the
[Telegraf GitHub repository](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores).

## Usage

```sh
telegraf [global-flags] secrets set [flags] <SECRET_STORE_ID> <SECRET_KEY> <SECRET_VALUE>
```

## Arguments

| Argument            | Description                                 |
| :------------------ | :------------------------------------------ |
| **SECRET_STORE_ID** | ID of the secret store to set the secret in |
| **SECRET_KEY**      | Key of the secret to set                    |
| **SECRET_VALUE**    | Value of the secret to set                  |

## Flags

| Flag |          | Description       |
| :--- | :------- | :---------------- |
| `-h` | `--help` | Show command help |

{{% caption %}}
_Also see [Telegraf global flags](/telegraf/v1/commands/#telegraf-global-flags)._
{{% /caption %}}

## Examples

- [Set a secret using the default configuration location](#set-a-secret-using-the-default-configuration-location)
- [Set a secret using a non-default configuration location](#set-a-secret-using-a-non-default-configuration-location)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`SECRET_STORE_ID`{{% /code-placeholder-key %}}:
  The ID of the secret store to store the secret in.
- {{% code-placeholder-key %}}`SECRET_KEY`{{% /code-placeholder-key %}}:
  The key of the secret to set.
- {{% code-placeholder-key %}}`SECRET_VALUE`{{% /code-placeholder-key %}}:
  The value of the secret to set.
- {{% code-placeholder-key %}}`CUSTOM_CONFIG_PATH`{{% /code-placeholder-key %}}:
  The non-default filepath to your Telegraf configuration file containing your
  secret store definitions.

### Set a secret using the default configuration location

The following example assumes the Telegraf configuration file that contains the
secret store definition is at the [default location](/telegraf/v1/configuration/#configuration-file-locations).

{{% code-placeholders "SECRET_(STORE_ID|KEY|VALUE)" %}}
```sh
telegraf secrets set SECRET_STORE_ID SECRET_KEY SECRET_VALUE
```
{{% /code-placeholders %}}

### Set a secret using a non-default configuration location

{{% code-placeholders "CUSTOM_CONFIG_PATH|SECRET_(STORE_ID|KEY|VALUE)" %}}
```sh
telegraf \
  --config CUSTOM_CONFIG_PATH \
  secrets set \
  SECRET_STORE_ID \
  SECRET_KEY \
  SECRET_VALUE
```
{{% /code-placeholders %}}
