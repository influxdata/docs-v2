---
title: Create a database token
description: >
  Use the [`influxctl token create` command](/influxdb/clustered/reference/cli/influxctl/token/create/)
  to create a database token for reading and writing data in your InfluxDB cluster.
  Provide a token description and permissions for databases.
menu:
  influxdb_clustered:
    parent: Database tokens
weight: 201
list_code_example: |
  ```sh
  influxctl token create \
    --read-database DATABASE1_NAME \
    --read-database DATABASE2_NAME \
    --write-database DATABASE2_NAME \
    "Read-only on DATABASE1_NAME, Read/write on DATABASE2_NAME"
  ```
aliases:
  - /influxdb/clustered/admin/tokens/create/
alt_links:
  cloud: /influxdb/cloud/admin/tokens/create-token/
  cloud-serverless: /influxdb/cloud-serverless/admin/tokens/create-token/
---

Use the [`influxctl token create` command](/influxdb/clustered/reference/cli/influxctl/token/create/)
to create a token that grants access to databases in your {{% product-name omit=" Clustered" %}} cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  In your terminal, run the `influxctl token create` command and provide the following:
    - Token permissions (read and write)
      - `--read-database`: Grants read permissions to the specified database. Repeatable.
      - `--write-database`: Grants write permissions to the specified database. Repeatable.

      Both of these flags support the `*` wildcard which grants read or write
      permissions to all databases. Enclose wildcards in single or double
      quotes--for example: `'*'` or `"*"`.

    - Token description

{{% code-placeholders "DATABASE_NAME|TOKEN_DESCRIPTION" %}}

```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
    "Read/write token for DATABASE_NAME"
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} [database](/influxdb/clustered/admin/databases/)

The output is the token ID and the token string.
**This is the only time the token string is available in plain text.**

## Notable behaviors

- InfluxDB might take some time--from a few seconds to a few minutes--to activate and synchronize new tokens.
If a new database token doesn't immediately work (you receive a `401 Unauthorized` error) for querying or writing, wait and then try again.
- Token strings are viewable _only_ on token creation.

{{% note %}}

#### Store secure tokens in a secret store

Token strings are viewable _only_ on token creation and aren't stored by InfluxDB.
We recommend storing database tokens in a **secure secret store**.
For example, see how to [authenticate Telegraf using tokens in your OS secret store](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/os).

If you lose a token, [delete the token from InfluxDB](/influxdb/clustered/admin/tokens/database/delete/) and create a new one.

{{% /note %}}

## Output format

The `influxctl token create` command supports the `--format json` option.
By default, the command outputs the token string.
For token details and easier programmatic access to the command output, include `--format json`
with your command to format the output as JSON.

## Examples

- [Create a token with read and write access to a database](#create-a-token-with-read-and-write-access-to-a-database)
- [Create a token with read and write access to all databases](#create-a-token-with-read-and-write-access-to-all-databases)
- [Create a token with read-only access to a database](#create-a-token-with-read-only-access-to-a-database)
- [Create a token with read-only access to multiple databases](#create-a-token-with-read-only-access-to-multiple-databases)
- [Create a token with mixed permissions to multiple databases](#create-a-token-with-mixed-permissions-to-multiple-databases)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{< product-name >}} database
- {{% code-placeholder-key %}}`DATABASE2_NAME`{{% /code-placeholder-key %}}: your {{< product-name >}} database

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
