---
title: influxctl user invite
description: >
  The `influxctl user invite` command invites a user to an InfluxDB Cloud Dedicated
  account.
menu:
  influxdb3_cloud_dedicated:
    parent: influxctl user
weight: 301
draft: true
---

> [!Warning]
> #### InfluxData internal use only
> 
> This command is for InfluxData internal use only and won't work when run by
> a user account.

The `influxctl user invite` command invites a user to an {{< product-name >}}
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

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

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
