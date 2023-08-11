---
title: influxctl user invite
description: >
  The `influxctl user invite` command invites a user to your InfluxDB Cloud Dedicated
  account.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl user
weight: 301
---

The `influxctl user invite` command invites a user to your {{< cloud-name >}}
account.

## Usage

```sh
influxctl user invite [command options] <FIRST_NAME> <LAST_NAME> <EMAIL>
```

## Arguments

| Argument       | Description          |
| :------------- | :------------------- |
| **FIRST_NAME** | User's first name    |
| **LAST_NAME**  | User's last name     |
| **EMAIL**      | User's email address |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |

## Examples

```sh
influxctl user invite John Doe jdoe@example.com
```
