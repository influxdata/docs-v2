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
We recommend storing database tokens in a secure secret store.
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
|      | `--read-database`  | Grant read permissions to a database  |
|      | `--write-database` | Grant write permissions to a database |

## Examples

- [Create a token with read and write access to a database](#create-a-token-with-read-and-write-access-to-a-database)
- [Create a token with read-only access to a database](#create-a-token-with-read-only-access-to-a-database)
- [Create a token with read-only access to multiple database](#create-a-token-with-read-only-access-to-multiple-database)
- [Create a token with mixed permissions on multiple database](#create-a-token-with-mixed-permissions-on-multiple-database)

##### Create a token with read and write access to a database

```sh
influxctl token create \
  --read-database mydb \
  --write-database mydb \
  "Read/write token for mydb"
```

##### Create a token with read-only access to a database

```sh
influxctl token create \
  --read-database mydb \
  "Read-only token for mydb"
```

##### Create a token with read-only access to multiple database

```sh
influxctl token create \
  --read-database mydb1 \
  --read-database mydb2 \
  "Read-only token for mydb1 and mydb2"
```

##### Create a token with mixed permissions on multiple database

```sh
influxctl token create \
  --read-database mydb1 \
  --read-database mydb2 \
  --write-database mydb2 \
  "Read-only on mydb1, Read/write on mydb2"
```
