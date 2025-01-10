---
title: influxctl token delete
description: >
  The `influxctl token delete` command deletes a database token from an InfluxDB
  Cloud Dedicated cluster and revokes all permissions associated with the token.
menu:
  influxdb3_cloud_dedicated:
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

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Delete a database token](#delete-a-database-token)
- [Delete multiple database tokens](#delete-multiple-database-tokens)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`TOKEN_ID`{{% /code-placeholder-key %}}: token ID to delete

### Delete a database token

{{% code-placeholders "TOKEN_ID" %}}
```sh
influxctl token delete TOKEN_ID
```
{{% /code-placeholders %}}

### Delete multiple database tokens

{{% code-placeholders "TOKEN_ID_\d{1}" %}}
```sh
influxctl token delete TOKEN_ID_1 TOKEN_ID_2
```
{{% /code-placeholders %}}
