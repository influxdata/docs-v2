---
title: influxctl user delete
description: >
  The `influxctl user delete` command deletes a user from your InfluxDB Clustered account.
menu:
  influxdb_clustered:
    parent: influxctl user
weight: 301
---

The `influxctl user delete` command deletes a user from your {{< product-name >}}
account.

## Usage

```sh
influxctl user delete <USER_ID>
```

{{% warn %}}
#### Deleting a user is immediate and cannot be undone

Deleting a user is a destructive action that takes place immediately
and cannot be undone.
{{% /warn %}}

## Arguments

| Argument    | Description       |
| :---------- | :---------------- |
| **USER_ID** | User ID to delete |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |

## Examples

{{% code-placeholders "USER_ID" %}}
```sh
influxctl user delete USER_ID
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`USER_ID`{{% /code-placeholder-key %}}: user ID to delete
