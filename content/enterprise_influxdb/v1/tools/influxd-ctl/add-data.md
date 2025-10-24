---
title: influxd-ctl add-data
description: >
  The `influxd-ctl add-data` command adds a data node to an InfluxDB Enterprise v1 cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/introduction/installation/data_node_installation/
---

The `influxd-ctl add-data` command adds a data node to an InfluxDB Enterprise cluster.

By default, `influxd-ctl` adds the specified data node to the local meta node's cluster.
Use `add-data` instead of the [`join` argument](#join) when
[installing a data node](/enterprise_influxdb/v1/introduction/installation/data_node_installation/)
an InfluxDB Enterprise cluster.

## Usage

```sh
influxd-ctl add-data [flags] <tcp-bind-address>
```

## Arguments

- **tcp-bind-address**: TCP bind address of the data node to add to the cluster
  (`host:port`)

## Flags

| Flag | Description                                                                                                 |
| :--- | :---------------------------------------------------------------------------------------------------------- |
| `-p` | Add the data node as a [passive node](/enterprise_influxdb/v1/concepts/glossary/#passive-node-experimental) |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples

- [Add a data node to a cluster](#add-a-data-node-to-a-cluster)
- [Add a data node to a cluster using a remote meta node](#add-a-data-node-to-a-cluster-using-a-remote-meta-node)
- [Add a passive data node to a cluster](#add-a-passive-data-node-to-a-cluster)

### Add a data node to a cluster

```bash
influxd-ctl add-data cluster-data-node-04:8088
```

### Add a data node to a cluster using a remote meta node

```bash
influxd-ctl -bind cluster-meta-node-01:8091 add-data cluster-data-node-04:8088
```

### Add a passive data node to a cluster

```bash
influxd-ctl add-data -p cluster-data-node-04:8088
```
