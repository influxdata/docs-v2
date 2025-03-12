---
title: influxctl user delete
description: >
  The `influxctl user delete` command deletes a user from your InfluxDB Cloud Dedicated account.
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

The `influxctl user delete` command deletes a user from your {{< product-name >}}
account.

## Usage

```sh
influxctl user delete <USER_ID>
```

> [!Warning]
> #### Deleting a user is immediate and cannot be undone
> 
> Deleting a user is a destructive action that takes place immediately
> and cannot be undone.

## Arguments

| Argument    | Description       |
| :---------- | :---------------- |
| **USER_ID** | User ID to delete |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

{{% code-placeholders "USER_ID" %}}
```sh
influxctl user delete USER_ID
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`USER_ID`{{% /code-placeholder-key %}}: user ID to delete
