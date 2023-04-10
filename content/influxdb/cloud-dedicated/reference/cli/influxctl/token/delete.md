---
title: influxctl token delete
description: >
  The `influxctl token delete` command deletes a database token from an InfluxDB
  Cloud Dedicated cluster and revokes all permissions associated with the token.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl token
weight: 302
---

The `influxctl token delete` command deletes a database token from an InfluxDB
Cloud Dedicated cluster and revokes all permissions associated with the token.

## Usage

```sh
influxctl token delete {token-id}
```

{{% warn %}}
#### Cannot be undone

Deleting a database token is a destructive action that cannot be undone.

#### Rotate delete tokens

After deleting a database token, any clients using the deleted token need to be
updated with a new database token to continue to interact with your InfluxDB
Cloud Dedicated cluster.
{{% /warn %}}

## Arguments

| Argument     | Description                 |
| :----------- | :-------------------------- |
| **token-id** | Database token ID to delete |

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |

## Examples

```sh
influxctl token delete 000xX0Xx00xX
```
