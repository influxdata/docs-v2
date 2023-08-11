---
title: influxctl token delete
description: >
  The `influxctl token delete` command deletes a database token from an InfluxDB
  Cloud Dedicated cluster and revokes all permissions associated with the token.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl token
weight: 301
---

The `influxctl token delete` command deletes a database token from an InfluxDB
Cloud Dedicated cluster and revokes all permissions associated with the token.

## Usage

```sh
influxctl token delete <TOKEN_ID> [<TOKEN_ID_N>...]
```

{{% warn %}}
#### Deleting a token is immediate and cannot be undone

Deleting a database token is a destructive action that takes place immediately
and cannot be undone.

#### Rotate deleted tokens

After deleting a database token, any clients using the deleted token need to be
updated with a new database token to continue to interact with your InfluxDB
Cloud Dedicated cluster.
{{% /warn %}}

## Arguments

| Argument     | Description                 |
| :----------- | :-------------------------- |
| **TOKEN_ID** | Database token ID to delete |

## Flags

| Flag |           | Description                                                 |
| :--- | :-------- | :---------------------------------------------------------- |
|      | `--force` | Do not prompt for confirmation to delete (default is false) |
| `-h` | `--help`  | Output command help                                         |

## Examples

- [Delete a database token](#delete-a-database-token)
- [Delete multiple database tokens](#delete-multiple-database-tokens)

### Delete a database token

```sh
influxctl token delete 000xX0Xx00xX
```

### Delete multiple database tokens

```sh
influxctl token delete 000xX0Xx00xX-1 00x00xXxxX00-2
```
