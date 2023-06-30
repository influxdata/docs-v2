---
title: influxctl token create
description: >
  The `influxctl token create` command creates a database token with specified
  permissions to resources in an InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl token
weight: 301
---

The `influxctl token create` command creates a database token with specified
permissions to resources in an InfluxDB Cloud Dedicated cluster and outputs
the token string.

{{% note %}}
#### Store secure tokens in a secret store

Token strings are returned _only_ on token creation.
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

| Flag |                    | Description                           |
| :--- | :----------------- | :------------------------------------ |
| `-h` | `--help`           | Output command help                   |
|      | `--read-database`  | Grant read permissions to a database. Repeatable.  |
|      | `--write-database` | Grant write permissions to a database. Repeatable. |

## Examples

- [Create a token with read and write access to a database](#create-a-token-with-read-and-write-access-to-a-database)
- [Create a token with read-only access to a database](#create-a-token-with-read-only-access-to-a-database)
- [Create a token with read-only access to multiple databases](#create-a-token-with-read-only-access-to-multiple-databases)
- [Create a token with mixed permissions to multiple databases](#create-a-token-with-mixed-permissions-on-multiple-databases)

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
