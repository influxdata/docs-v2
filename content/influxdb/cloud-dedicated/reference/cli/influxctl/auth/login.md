---
title: influxctl auth login
description: >
  The `influxctl auth login` command lets a user log in to an InfluxDB cluster using
  {{< product-name omit="Clustered" >}} identity provider
menu:
  influxdb_cloud_dedicated:
    parent: influxctl auth
weight: 301
---

The `influxctl auth login` command lets a user log in to an {{< product-name omit="Clustered" >}}
cluster using InfluxData Auth0.

## Usage

```sh
influxctl auth login
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
