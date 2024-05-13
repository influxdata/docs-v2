---
title: influxctl token create
description: >
  The `influxctl token create` command creates a database token with specified
  permissions to resources in an InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: influxctl token
weight: 301
---

The `influxctl token create` command creates a database token with specified
permissions to resources in an InfluxDB cluster and outputs
the token string.

The `--read-database` and `--write-database` flags support the `*` wildcard
which grants read or write permissions to all databases. Enclose wildcards in
single or double quotes--for example: `'*'` or `"*"`.

The `--format` flag lets you print the output in other formats.
The `json` format is available for programmatic parsing by other tooling.
Default: `table`.

## Notable behaviors

- InfluxDB might take some time--from a few seconds to a few minutes--to activate and synchronize new tokens.
If a new database token doesn't immediately work (you receive a `401 Unauthorized` error) for querying or writing, wait and then try again.
- Token strings are viewable _only_ on token creation.

{{% note %}}

#### Store secure tokens in a secret store

Token strings are viewable _only_ on token creation and aren't stored by InfluxDB.
We recommend storing database tokens in a **secure secret store**.

{{% /note %}}

## Usage

```sh
influxctl token create \
  [--read-database=<DATABASE_NAME>] \
  [--write-database=<DATABASE_NAME>] \
  <TOKEN_DESCRIPTION>
```

## Arguments

| Argument              | Description                |
| :-------------------- | :------------------------- |
| **TOKEN_DESCRIPTION** | Database token description |

## Flags

| Flag |                    | Description                                          |
| :--- | :----------------- | :--------------------------------------------------- |
|      | `--format`         | Output format (`table` _(default)_ or `json`)        |
|      | `--read-database`  | Grant read permissions to a database _(Repeatable)_  |
|      | `--write-database` | Grant write permissions to a database _(Repeatable)_ |
| `-h` | `--help`           | Output command help                                  |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Create a token with read and write access to a database](#create-a-token-with-read-and-write-access-to-a-database)
- [Create a token with read and write access to all databases](#create-a-token-with-read-and-write-access-to-all-databases)
- [Create a token with read-only access to a database](#create-a-token-with-read-only-access-to-a-database)
- [Create a token with read-only access to multiple databases](#create-a-token-with-read-only-access-to-multiple-databases)
- [Create a token with mixed permissions to multiple databases](#create-a-token-with-mixed-permissions-on-multiple-databases)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database name
- {{% code-placeholder-key %}}`DATABASE2_NAME`{{% /code-placeholder-key %}}: your second {{% product-name %}} database name
- {{% code-placeholder-key %}}`TOKEN_ID`{{% /code-placeholder-key %}}: token ID to update

### Create a token with read and write access to a database

{{% code-placeholders "DATABASE_NAME" %}}
```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
  "Read/write token for DATABASE_NAME"
```
{{% /code-placeholders %}}

### Create a token with read and write access to all databases

```sh
influxctl token create \
  --read-database "*" \
  --write-database "*" \
  "Read/write token for all databases"
```

### Create a token with read-only access to a database

{{% code-placeholders "DATABASE_NAME" %}}
```sh
influxctl token create \
  --read-database DATABASE_NAME \
  "Read-only token for DATABASE_NAME"
```
{{% /code-placeholders %}}

### Create a token with read-only access to multiple databases

{{% code-placeholders "DATABASE_NAME|DATABASE2_NAME" %}}
```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  "Read-only token for DATABASE_NAME and DATABASE2_NAME"
```
{{% /code-placeholders %}}

### Create a token with mixed permissions to multiple databases

{{% code-placeholders "DATABASE_NAME|DATABASE2_NAME" %}}
```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  --write-database DATABASE2_NAME \
  "Read-only on DATABASE_NAME, read/write on DATABASE2_NAME"
```
{{% /code-placeholders %}}
