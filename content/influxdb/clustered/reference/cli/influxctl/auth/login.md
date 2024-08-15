---
title: influxctl auth login
description: >
  The `influxctl auth login` command logins with InfluxData Auth0 or InfluxDB
  Clustered identity provider
  The `influxctl auth login` command lets a user log in to an InfluxDB cluster using
  the cluster's configured identity provider.
  influxdb_clustered:
    parent: influxctl auth
weight: 301
---

The `influxctl auth login` command logins with InfluxData Auth0 or InfluxDB
Clustered identity provider
The `influxctl auth login` command lets a user log in to an
{{< product-name omit="Clustered" >}} cluster using the cluster's configured
identity provider.  
## Usage

```sh
influxctl auth login
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
