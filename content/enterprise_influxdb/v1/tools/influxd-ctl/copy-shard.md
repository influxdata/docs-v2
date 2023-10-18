---
title: influxd-ctl copy-shard
description: >
  The `influxd-ctl copy-shard` command copies a shard from one data node to another.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/administration/manage/clusters/rebalance/
  - /enterprise_influxdb/v1/tools/influxd-ctl/show-shards/
  - /enterprise_influxdb/v1/tools/influxd-ctl/copy-shard-status/
  - /enterprise_influxdb/v1/tools/influxd-ctl/kill-copy-shard/
---

The `influxd-ctl copy-shard` command copies a shard from one data node to another.

## Usage

```sh
influxd-ctl copy-shard <source-tcp-address> <destination-tcp-address> <shard-id>
```

## Arguments

- **source-tcp-address**: TCP address of the source data node (`host:port`) 
- **destination-tcp-address**: TCP address of the destination data node (`host:port`)
- **shard-id**: Shard ID to copy

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._


## Examples

```bash
influxd-ctl copy-shard cluster-data-node-01:8088 cluster-data-node-02:8088 22
```
