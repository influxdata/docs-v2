---
title: influxd-ctl remove-shard
description: >
  The `influxd-ctl remove-shard` command removes a shard from a data node in
  an InfluxDB Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/show-shards/
  - /enterprise_influxdb/v1/administration/manage/clusters/rebalance/
---

The `influxd-ctl remove-shard` command removes a shard from a data node in
an InfluxDB Enterprise cluster.

{{% warn %}}
#### This command is destructive

Removing a shard from a data node is a destructive action and cannot be undone.
{{% /warn %}}

## Usage

```sh
influxd-ctl remove-shard <data-bind-address> <shard-id>
```

## Arguments

- **data-bind-address**: TCP bind address of the data node to remove the shard from
- **shard-id**: Shard ID to remove

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._

## Examples

```sh
influxd-ctl remove-shard data-node-01:8088 31
```
