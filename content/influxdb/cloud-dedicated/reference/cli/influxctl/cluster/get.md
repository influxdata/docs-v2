---
title: influxctl cluster get
description: >
  The `influxctl cluster get` command returns information about an InfluxDB
  Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl cluster
weight: 301
---

The `influxctl cluster get` command returns information about an InfluxDB
Cloud Dedicated cluster.

The `--format` option lets you print the output in other formats.
By default, the 'table' format is used, but the 'json' format is
available for programmatic parsing by other tooling.

## Usage

```sh
influxctl cluster get <CLUSTER_ID>
```

## Arguments

| Argument       | Description              |
| :------------- | :----------------------- |
| **CLUSTER_ID** | ID of the cluster to get |

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
|      | `--format` | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

##### Return information about a cluster

```sh
influxctl cluster get 000xX0Xx-00xX-XXx0-x00X-00xxX0xXX00x
```