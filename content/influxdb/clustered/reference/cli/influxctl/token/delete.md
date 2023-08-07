---
title: influxctl token delete
description: >
  The `influxctl token delete` command deletes a database token from an InfluxDB
  cluster and revokes all permissions associated with the token.
menu:
  influxdb_clustered:
    parent: influxctl token
weight: 302
---

The `influxctl token delete` command deletes a database token from an InfluxDB
cluster and revokes all permissions associated with the token.

## Usage

```sh
influxctl token delete <TOKEN_ID>
```

{{% warn %}}
#### Deleting a token is immediate and cannot be undone

Deleting a database token is a destructive action that takes place immediately
and cannot be undone.

#### Rotate deleted tokens

After deleting a database token, any clients using the deleted token need to be
updated with a new database token to continue to interact with your InfluxDB
cluster.
{{% /warn %}}

## Arguments

| Argument     | Description                 |
| :----------- | :-------------------------- |
| **TOKEN_ID** | Database token ID to delete |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |

## Examples

```sh
influxctl token delete 000xX0Xx00xX
```
