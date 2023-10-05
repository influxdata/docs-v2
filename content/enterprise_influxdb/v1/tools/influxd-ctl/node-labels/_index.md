---
title: influxd-ctl node-labels
description: >
  The `influxd-ctl node-labels` command and subcommands manage node labels   in
  an InfluxDB Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/administration/manage/node-labels/
  - /enterprise_influxdb/v1/tools/influxd-ctl/show/
---

The `influxd-ctl node-labels` command and subcommands manage node labels in an
InfluxDB Enterprise cluster.
**Node labels** are user-defined key-value pairs assigned to nodes in your
cluster that act as metadata for each node.
Node labels appear in the output of
[`influxd-ctl show`](/enterprise_influxdb/v1/tools/influxd-ctl/show/).

## Usage

```sh
influxd-ctl node-labels [flags]
```

## Subcommands

| Subcommand                                                              | Description                           |
| :---------------------------------------------------------------------- | :------------------------------------ |
| [delete](/enterprise_influxdb/v1/tools/influxd-ctl/node-labels/delete/) | Delete one or more labels from a node |
| [set](/enterprise_influxdb/v1/tools/influxd-ctl/node-labels/set/)       | Set one or more labels on for a node  |

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
