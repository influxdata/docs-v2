---
title: influxctl cluster create
description: >
  The `influxctl cluster create` command creates an InfluxDB cluster.
menu:
  influxdb3_clustered:
    parent: influxctl cluster
weight: 301
draft: true
---

The `influxctl cluster create` command creates an {{% product-name omit=" Clustered" %}} cluster.

> [!Warning]
> This command is not supported by InfluxDB Clustered.
> For information about create an InfluxDB Cluster, see
> [Install InfluxDB Clustered](/influxdb3/clustered/install/).

## Usage

```sh
influxctl cluster create [flags]
```

## Flags

| Flag |                           | Description                                                                                   |
| :--- | ------------------------- | :-------------------------------------------------------------------------------------------- |
|      | `--region`                | {{< req >}}: Region to create cluster in                                                      |
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

##### Create an InfluxDB cluster

```sh
influxctl cluster create \
  --region us-west-2 \
  --category internal \
  --ingestor-units 3 \
  --compactor-units 1 \
  --query-units 1 \
  example-cluster-name
```
