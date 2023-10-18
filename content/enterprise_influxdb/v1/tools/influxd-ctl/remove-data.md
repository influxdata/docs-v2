---
title: influxd-ctl remove-data
description: >
  The `influxd-ctl remove-data` command removes a data node from an InfluxDB
  Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/leave/
---

The `influxd-ctl remove-data` command removes a data node from an InfluxDB
Enterprise cluster.

{{% warn %}}
#### This command is destructive

`influxd-ctl remove-data` erases all data in the specified data node.
Only use this command if you want to _permanently_ remove a data node from your
InfluxDB Enterprise cluster.
{{% /warn %}}

_This command doesn't delete metadata related to the removed data node from other
nodes in the cluster. To remove all metadata about the removed data node, use
[`influxd-ctl leave`](/enterprise_influxdb/v1/tools/influxd-ctl/leave/)._

## Usage

```sh
influxd-ctl remove-data [flags] <data-bind-address>
```

## Arguments

- **data-bind-address**: TCP bind address of the data node to remove (`host:port`)

## Flags

| Flag     | Description                                                             |
| :------- | :---------------------------------------------------------------------- |
| `-force` | Force the removal of a data node _(useful if the node is unresponsive)_ |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples

```sh
influxd-ctl remove-data data-node-03:8088
```
