---
title: influxd-ctl entropy
description: >
  The `influxd-ctl entropy` command repairs and manages entropy in an InfluxDB
  Enterprise Cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/administration/configure/anti-entropy/
---

The `influxd-ctl entropy` command repairs and manages entropy in an InfluxDB
Enterprise Cluster.

## Usage

```sh
influxd-ctl entropy [subcommand] [flags] [arguments]
```

## Commands

| Command                                                                       | Description                                  |
| :---------------------------------------------------------------------------- | :------------------------------------------- |
| [kill-repair](/enterprise_influxdb/v1/tools/influxd-ctl/entropy/kill-repair/) | Remove a shard from the entropy repair queue |
| [repair](/enterprise_influxdb/v1/tools/influxd-ctl/entropy/repair/)           | Repair entropy found in a shard              |
| [show](/enterprise_influxdb/v1/tools/influxd-ctl/entropy/show/)               | Show shard entropy                           |

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
