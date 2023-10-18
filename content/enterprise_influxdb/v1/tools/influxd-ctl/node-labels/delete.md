---
title: influxd-ctl node-labels delete
description: >
  The `influxd-ctl node-labels delete` command deletes labels from an InfluxDB
  Enterprise node.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl node-labels
weight: 201
related:
  - /enterprise_influxdb/v1/administration/manage/node-labels/
---

The `influxd-ctl node-labels delete` command deletes labels from an InfluxDB
Enterprise node.

## Usage

```sh
influxd-ctl node-labels delete [flags]
```

## Flags

| Flag      | Description                        |
| :-------- | :--------------------------------- |
| `-labels` | JSON array of label keys to delete |
| `-nodeid` | Node ID                            |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples

```sh
influxd-ctl node-labels delete -nodeid 5 -labels '["hello"]'
```
