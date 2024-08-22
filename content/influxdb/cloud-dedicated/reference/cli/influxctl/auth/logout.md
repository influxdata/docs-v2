---
title: influxctl auth logout
description: >
  The `influxctl auth logout` command lets a user log out of an InfluxDB 
  cluster and removes the user's local authorization tokens.  
menu:
  influxdb_cloud_dedicated:
    parent: influxctl auth
weight: 301
---

The `influxctl auth logout` command lets a user log out of an {{< product-name omit="Clustered" >}} 
cluster and removes the user's local authorization tokens.

## Usage

```sh
influxctl auth logout
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
