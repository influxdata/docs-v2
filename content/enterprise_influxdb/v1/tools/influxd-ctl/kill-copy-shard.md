---
title: influxd-ctl kill-copy-shard
description: >
  The `influxd-ctl kill-copy-shard` command aborts and in-progress copy-shard operation.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/copy-shard-status/
  - /enterprise_influxdb/v1/tools/influxd-ctl/copy-shard/
---

The `influxd-ctl kill-copy-shard` command aborts and in-progress
[copy-shard operation](/enterprise_influxdb/v1/tools/influxd-ctl/copy-shard.).

## Usage

```sh
influxd-ctl kill-copy-shard <src-tcp-address> <dest-tcp-addr> <shard-id>
```

## Arguments

- **src-tcp-address**: TCP bind address of the source data node (`host:port`)
- **dest-tcp-addr**: TCP bind address of the destination data node (`host:port`)
- **shard-id**: Shard ID

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._

## Examples

```sh
influxd-ctl kill-copy-shard data-node-02:8088 data-node-03:8088 39
```
