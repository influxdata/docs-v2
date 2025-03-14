---
title: influxctl token update
description: >
  The `influxctl token update` command updates a database token with specified
  permissions to resources in an InfluxDB Cloud Dedicated cluster.
menu:
  influxdb3_cloud_dedicated:
    parent: influxctl token
weight: 301
---

The `influxctl token update` command updates a database token with specified
permissions to resources in an InfluxDB Cloud Dedicated cluster.

The `--read-database` and `--write-database` flags support the `*` wildcard
which grants read or write permissions to all databases. Enclose wildcards in
single or double quotes--for example: `'*'` or `"*"`.

## Usage

```sh
influxctl token update \
  [--read-database=<DATABASE_NAME>] \
  [--write-database=<DATABASE_NAME>] \
  <TOKEN_ID>
```

> [!Note]
> #### Existing permissions are replaced on update
> 
> When updating token permissions, the existing permissions are replaced by the
> new permissions specified in the update command.
> To retain existing permissions, include them in the update command.

## Arguments

| Argument     | Description                 |
| :----------- | :-------------------------- |
| **TOKEN_ID** | Database token ID to update |

## Flags

| Flag |                    | Description                                          |
| :--- | :----------------- | :--------------------------------------------------- |
|      | `--read-database`  | Grant read permissions to a database _(Repeatable)_  |
|      | `--write-database` | Grant write permissions to a database _(Repeatable)_ |
| `-h` | `--help`           | Output command help                                  |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Update a token's permissions](#update-a-tokens-permissions)
- [Update a token with read and write access to all databases](#update-a-token-with-read-and-write-access-to-all-databases)
- [Update a token with read-only access to multiple databases](#update-a-token-with-read-only-access-to-multiple-databases)
- [Update a token with mixed permissions to multiple databases](#update-a-token-with-mixed-permissions-to-multiple-databases)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE2_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`TOKEN_ID`{{% /code-placeholder-key %}}: token ID to update

### Update a token's permissions

{{% code-placeholders "DATABASE_NAME|TOKEN_ID" %}}
```sh
influxctl token update \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
  TOKEN_ID
```
{{% /code-placeholders %}}

### Update a token with read and write access to all databases

{{% code-placeholders "TOKEN_ID" %}}
```sh
influxctl token update \
  --read-database "*" \
  --write-database "*" \
  TOKEN_ID
```
{{% /code-placeholders %}}

### Update a token with read-only access to multiple databases

{{% code-placeholders "DATABASE_NAME|DATABASE2_NAME|TOKEN_ID" %}}
```sh
influxctl token update \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  TOKEN_ID
```
{{% /code-placeholders %}}

### Update a token with mixed permissions to multiple databases

{{% code-placeholders "DATABASE_NAME|DATABASE2_NAME|TOKEN_ID" %}}
```sh
influxctl token update \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  --write-database DATABASE2_NAME \
  TOKEN_ID
```
{{% /code-placeholders %}}
