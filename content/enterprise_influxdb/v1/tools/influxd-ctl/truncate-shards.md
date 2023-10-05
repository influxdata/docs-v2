---
title: influxd-ctl truncate-shards
description: >
  The `influxd-ctl truncate-shards` command truncates all shards that are currently
  being written to (also known as "hot" shards) and creates new shards to write
  new data to.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/administration/manage/clusters/rebalance/
  - /enterprise_influxdb/v1/tools/influxd-ctl/show-shards/
---

The `influxd-ctl truncate-shards` command truncates all shards that are currently
being written to (also known as "hot" shards) and creates new shards to write
new data to.

## Usage

```sh
influxd-ctl truncate-shards [flags]
```

## Flags

| Flag     | Description                                              |
| :------- | :------------------------------------------------------- |
| `-delay` | Duration from now to truncate shards _(default is 1m0s)_ |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples

##### Truncate shards 3 minutes after command execution

```bash
influxd-ctl truncate-shards -delay 3m
```
