---
title: influxd-ctl update-data
description: >
  The `influxd-ctl update-data` command updates a data node's TCP bind address
  in the meta store.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
---

The `influxd-ctl update-data` command updates a data node's TCP bind address
in the meta store.

## Usage

```sh
influxd-ctl update-data <old-tcp-bind-addr> <new-tcp-bind-addr>
```

## Arguments

- **old-tcp-bind-addr**: Old TCP bind address of the data node
- **new-tcp-bind-addr**: New TCP bind address of the data node

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._

## Examples

```sh
influxd-ctl update-data data1:8088 influxdb-data-01:8088
```
