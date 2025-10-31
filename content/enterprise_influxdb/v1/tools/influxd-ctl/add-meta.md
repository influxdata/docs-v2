---
title: influxd-ctl add-meta
description: >
  The `influxd-ctl add-meta` command adds a meta node to an InfluxDB Enterprise v1 cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/introduction/installation/data_node_installation/
---

The `influxd-ctl add-meta` command adds a meta node to an InfluxDB Enterprise cluster.

By default, `influxd-ctl` adds the specified meta node to the local meta node's cluster.
Use `add-meta` instead of the [`join` argument](#join) when
[installing a meta node](/enterprise_influxdb/v1/introduction/installation/meta_node_installation/)
an InfluxDB Enterprise cluster.

## Usage

```sh
influxd-ctl [flags] add-meta <http-bind-address>
```

## Arguments

- **http-bind-address**: HTTP bind address of the meta node to add to the cluster
  (`host:port`)

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._

## Examples

- [Add a meta node to a cluster](#add-a-meta-node-to-a-cluster)
- [Add a meta node to a cluster using a remote meta node](#add-a-meta-node-to-a-cluster-using-a-remote-meta-node)

### Add a meta node to a cluster

```bash
influxd-ctl add-meta cluster-meta-node-03:8091
```

### Add a meta node to a cluster using a remote meta node

```bash
influxd-ctl -bind cluster-meta-node-01:8091 add-meta cluster-meta-node-03:8091
```