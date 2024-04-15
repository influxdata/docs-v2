---
title: telegraf secrets list
description: >
  The `telegraf secrets list` command lists known secrets and secret stores.
menu:
  telegraf_v1_ref:
    parent: telegraf secrets
weight: 301
---

The `telegraf secrets list` command lists known secrets and secret stores.

{{% note %}}
This command requires your configuration file that contains the secret store
definitions you want to access. If the `--config` or `--config-directory` flags
are not included in the command, Telegraf checks the
[default configuration file location](/telegraf/v1/configuration/#configuration-file-locations).
{{% /note %}}

If you haven't configured a secret store, use
[`telegraf plugins secretstores`](/telegraf/v1/commands/plugins/secretstores/)
to list available secret store plugins.
View secret store plugin configuration documentation in the
[Telegraf GitHub repository](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores).

## Usage

```sh
telegraf [global-flags] secrets list [flags] [SECRET_STORE_ID[ ...[SECRET_STORE_ID]]]
```

## Arguments

| Argument            | Description                                                                                                                                                             |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SECRET_STORE_ID** | ID of the secret store to list secrets from. You can include multiple, space-delimited IDs. If no ID(s) are provided, the command lists secrets from all secret stores. |

## Flags

| Flag |                   | Description         |
| :--- | :---------------- | :------------------ |
|      | `--reveal-secret` | Print secret values |
| `-h` | `--help`          | Show command help   |

{{% caption %}}
_Also see [Telegraf global flags](/telegraf/v1/commands/#telegraf-global-flags)._
{{% /caption %}}

## Examples

- [List secrets and secret stores using the default configuration location](#list-secrets-and-secret-stores-using-the-default-configuration-location)
- [List secrets and secret stores using a non-default configuration location](#list-secrets-and-secret-stores-using-a-non-default-configuration-location)
- [List secrets from a specific secret store](#list-secrets-from-a-specific-secret-store)
- [Show secret values when listing secrets and secret stores](#show-secret-values-when-listing-secrets-and-secret-stores)

### List secrets and secret stores using the default configuration location

The following example assumes the Telegraf configuration file that contains the
secret store definition is at the [default location](/telegraf/v1/configuration/#configuration-file-locations).

```sh
telegraf secrets list
```

### List secrets and secret stores using a non-default configuration location

{{% code-placeholders "CUSTOM_CONFIG_PATH" %}}
```sh
telegraf --config CUSTOM_CONFIG_PATH secrets list
```
{{% /code-placeholders %}}

- Replace {{% code-placeholder-key %}}`CUSTOM_CONFIG_PATH`{{% /code-placeholder-key %}}
  with the non-default filepath to your Telegraf configuration file containing
  your secret store definitions.


### List secrets from a specific secret store

{{% code-placeholders "SECRET_STORE_ID" %}}
```sh
telegraf secrets list SECRET_STORE_ID
```
{{% /code-placeholders %}}

- Replace {{% code-placeholder-key %}}`SECRET_STORE_ID`{{% /code-placeholder-key %}}
  with the ID of the secret store to retrieve the secret from.

### Show secret values when listing secrets and secret stores

To print secret values with listing secrets and secret stores, include the
`--reveal-secret` flag:

```sh
telegraf secrets list --reveal-secret
```
