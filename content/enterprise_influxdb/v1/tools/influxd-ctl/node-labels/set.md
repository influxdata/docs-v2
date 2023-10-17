---
title: influxd-ctl node-labels set
description: >
  The `influxd-ctl node-labels set` command adds or updates labels on an
  InfluxDB Enterprise node.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl node-labels
weight: 201
related:
  - /enterprise_influxdb/v1/administration/manage/node-labels/
  - /enterprise_influxdb/v1/tools/influxd-ctl/show/
---

The `influxd-ctl node-labels set` command adds or updates labels on an
InfluxDB Enterprise node.
Node labels appear in the output of
[`influxd-ctl show`](/enterprise_influxdb/v1/tools/influxd-ctl/show/).

## Usage

```sh
influxd-ctl node-labels set [flags]
```

## Flags

| Flag      | Description                          |
| :-------- | :----------------------------------- |
| `-labels` | JSON object of label key-value pairs |
| `-nodeid` | Node ID                              |

{{% caption %}}
_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples

```sh
influxd-ctl node-labels set -nodeid 5 -labels '{"az":"us-west","nickname":"mars"}'
```
