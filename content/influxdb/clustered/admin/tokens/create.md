---
title: Create a token
description: >
  Use the [`influxctl token create` command](/influxdb/clustered/reference/cli/influxctl/token/create/)
  to create a database token for reading and writing data in your InfluxDB cluster.
  Provide a token description and permissions for databases.
menu:
  influxdb_clustered:
    parent: Manage tokens
weight: 201
list_code_example: |
  ```sh
  influxctl token create \
    --read-database DATABASE1_NAME \
    --read-database DATABASE2_NAME \
    --write-database DATABASE2_NAME \
    "Read-only on DATABASE1_NAME, Read/write on DATABASE2_NAME"
  ```
alt_engine: /influxdb/cloud-serverless/admin/tokens/create-token/
---

Use the [`influxctl token create` command](/influxdb/clustered/reference/cli/influxctl/token/create/)
to create a token that grants access to databases in your InfluxDB cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the `influxctl token create` command and provide the following:

    - Token permissions (read and write)
      - `--read-database`: Grants read permissions to the specified database. Repeatable.
      - `--write-database`: Grants write permissions to the specified database. Repeatable.
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

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% cloud-name %}} database

The command returns the token ID and the token string.
**This is the only time the token string is available in plain text.**

InfluxDB might take some time to synchronize new tokens.
If a new token doesn't immediately work for querying or writing, wait a few seconds and try again.

{{% note %}}
#### Store secure tokens in a secret store

Token strings are returned _only_ on token creation.
We recommend storing database tokens in a **secure secret store**.
For example, see how to [authenticate Telegraf using tokens in your OS secret store](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/os).
{{% /note %}}

#### Example token creation commands

##### Create a token with read and write access to a database

{{% code-placeholders "DATABASE_NAME" %}}
```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
  "Read/write token for DATABASE_NAME"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% cloud-name %}} database

##### Create a token with read-only access to a database

{{% code-placeholders "DATABASE_NAME" %}}
```sh
influxctl token create \
  --read-database DATABASE_NAME \
  "Read-only token for DATABASE_NAME"
```
{{% /code-placeholders %}}

##### Create a token with read-only access to multiple databases

{{% code-placeholders "DATABASE_NAME|DATABASE2_NAME" %}}
```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  "Read-only token for DATABASE_NAME and DATABASE2_NAME"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% cloud-name %}} database
- {{% code-placeholder-key %}}`DATABASE2_NAME`{{% /code-placeholder-key %}}: your {{% cloud-name %}} database

##### Create a token with mixed permissions to multiple databases

{{% code-placeholders "DATABASE_NAME|DATABASE2_NAME" %}}
```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  --write-database DATABASE2_NAME \
  "Read-only on DATABASE_NAME, read/write on DATABASE2_NAME"
```
{{% /code-placeholders %}}

{{% note %}}
#### Tokens cannot be updated

Once created, token permissions cannot be updated.
If you need a token with different permissions, create a new token with the
appropriate permissions.
{{% /note %}}
