---
title: influxctl user invite
description: >
  The `influxctl user invite` command invites a user to your InfluxDB Clustered
  account.
menu:
  influxdb_clustered:
    parent: influxctl user
weight: 301
---

The `influxctl user invite` command invites a user to your {{< product-name >}}
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

{{% code-placeholders "(FIRST|LAST)_NAME|EMAIL" %}}
```sh
influxctl user invite FIRST_NAME LAST_NAME EMAIL
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`FIRST_NAME`{{% /code-placeholder-key %}}:
  User's first name
- {{% code-placeholder-key %}}`LAST_NAME`{{% /code-placeholder-key %}}:
  User's last name
- {{% code-placeholder-key %}}`EMAIL`{{% /code-placeholder-key %}}:
  User's email address
