---
title: influxd-ctl copy-shard-status
description: >
  The `influxd-ctl copy-shard-status` command returns information about all in-progress
  copy shard operations.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/administration/manage/clusters/rebalance/
  - /enterprise_influxdb/v1/tools/influxd-ctl/copy-shard/
  - /enterprise_influxdb/v1/tools/influxd-ctl/kill-copy-shard/
---

The `influxd-ctl copy-shard-status` command returns information about all in-progress
[copy shard](/enterprise_influxdb/v1/tools/influxd-ctl/copy-shard/) operations.

## Usage

```sh
influxd-ctl copy-shard-status
```

Output includes the following:

- Source node
- Destination node
- Database
- Retention policy
- Shard ID
- Total size
- Current size
- Operation start time

{{< expand-wrapper >}}
{{% expand "View example ouput" %}}
```sh
Source                     Dest                       Database  Policy   ShardID  TotalSize  CurrentSize  StartedAt
cluster-data-node-02:8088  cluster-data-node-03:8088  telegraf  autogen  34       119624324  119624324    2023-06-22 23:45:09.470696179 +0000 UTC
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
