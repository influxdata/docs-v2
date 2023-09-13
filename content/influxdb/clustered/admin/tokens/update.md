---
title: Update a token
description: >
  Use the [`influxctl token update` command](/influxdb/clustered/reference/cli/influxctl/token/update/)
  to update a database token's permissions in your InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: Manage tokens
weight: 201
list_code_example: |
  ```sh
  influxctl token update \
    --read-database <DATABASE1_NAME> \
    --read-database <DATABASE2_NAME> \
    --write-database <DATABASE2_NAME> \
    <TOKEN_ID>
  ```
alt_links:
  cloud-serverless: /influxdb/cloud-serverless/admin/tokens/update-tokens/
---

Use the [`influxctl token update` command](/influxdb/clustered/reference/cli/influxctl/token/update/)
to update a database token's permissions in your {{< product-name omit=" Clustered" >}} cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the `influxctl token create` command and provide the following:

    - Token permissions (read and write)
      - `--read-database`: Grants read permissions to the specified database. Repeatable.
      - `--write-database`: Grants write permissions to the specified database. Repeatable.
    - Token ID

{{% code-placeholders "DATABASE_NAME|TOKEN_ID" %}}
```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
  TOKEN_ID
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{< product-name >}} database
- {{% code-placeholder-key %}}`TOKEN ID`{{% /code-placeholder-key %}}: ID of the token to update

{{% note %}}
#### Existing permissions are replaced on update

When updating token permissions, the existing permissions are replaced by the
new permissions specified in the update command.
To retain existing permissions, include them in the update command.
{{% /note %}}

### Examples

- [Update a token with read and write access to a database](#update-a-token-with-read-and-write-access-to-a-database)
- [Update a token with read-only access to a database](#update-a-token-with-read-only-access-to-a-database)
- [Update a token with read-only access to multiple databases](#update-a-token-with-read-only-access-to-multiple-databases)
- [Update a token with mixed permissions to multiple databases](#update-a-token-with-mixed-permissions-to-multiple-databases)

In the examples below, Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{< product-name >}} database
- {{% code-placeholder-key %}}`DATABASE2_NAME`{{% /code-placeholder-key %}}: your {{< product-name >}} database
- {{% code-placeholder-key %}}`TOKEN ID`{{% /code-placeholder-key %}}: ID of the token to update

#### Update a token with read and write access to a database

{{% code-placeholders "DATABASE_NAME|TOKEN_ID" %}}
```sh
influxctl token update \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
  TOKEN_ID
```
{{% /code-placeholders %}}

#### Update a token with read-only access to a database

{{% code-placeholders "DATABASE_NAME|TOKEN_ID" %}}
```sh
influxctl token update \
  --read-database DATABASE_NAME \
  TOKEN_ID
```
{{% /code-placeholders %}}

#### Update a token with read-only access to multiple databases

{{% code-placeholders "DATABASE_NAME|DATABASE2_NAME|TOKEN_ID" %}}
```sh
influxctl token update \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  TOKEN_ID
```
{{% /code-placeholders %}}

#### Update a token with mixed permissions to multiple databases

{{% code-placeholders "DATABASE_NAME|DATABASE2_NAME|TOKEN_ID" %}}
```sh
influxctl token update \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  --write-database DATABASE2_NAME \
  TOKEN_ID
```
{{% /code-placeholders %}}
