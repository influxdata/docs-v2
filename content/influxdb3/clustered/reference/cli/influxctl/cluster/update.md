---
title: influxctl cluster update
description: >
  The `influxctl cluster update` command updates an InfluxDB cluster.
menu:
  influxdb3_clustered:
    parent: influxctl cluster
weight: 301
draft: true
---

The `influxctl cluster update` command updates an {{% product-name omit=" Clustered" %}} cluster.

> [!Warning]
> This command is not supported by InfluxDB Clustered.

## Usage

```sh
influxctl cluster update [flags] <CLUSTER_ID>
```

## Arguments

| Argument       | Description              |
| :------------- | :----------------------- |
| **CLUSTER_ID** | ID of the cluster to get |

## Flags

| Flag |                           | Description                                                                                   |
| :--- | ------------------------- | :-------------------------------------------------------------------------------------------- |
|      | `--state`                 | {{< req >}}: Cluster state (`ready` or `deleted`)                                             |
|      | `--category`              | {{< req >}}: Cluster category (`contract`, `internal`, `unpaid_poc`, `paid_poc`, or `system`) |
|      | `--ingestor-units`        | Ingestor units _(default is 0)_                                                               |
|      | `--ingestor-granularity`  | Ingestor granularity _(default is 0)_                                                         |
|      | `--compactor-units`       | Compactor units _(default is 0)_                                                              |
|      | `--compactor-granularity` | Compactor granularity _(default is 0)_                                                        |
|      | `--query-units`           | Query units _(default is 0)_                                                                  |
|      | `--query-granularity`     | Query granularity _(default is 0)_                                                            |
| `-h` | `--help`                  | Output command help                                                                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

##### Update an InfluxDB cluster

```sh
influxctl cluster update \
  --state ready \
  --category contract \
  --ingestor-units 3 \
  --compactor-units 1 \
  --query-units 1 \
```
