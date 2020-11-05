---
title: influx backup
description: The `influx backup` command backs up data stored in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx backup
    parent: influx
weight: 101
influxdb/v2.0/tags: [backup]
related:
  - /influxdb/v2.0/backup-restore/backup/
---

The `influx backup` command backs up data stored in InfluxDB.

## Usage
```
influx backup [flags]
```

## Flags
| Flag |               | Description                        | Input type |
|------|---------------|------------------------------------|------------|
|      | `--bucket-id` | ID of the bucket to restore from   |            |
| b    | `--bucket`    | Name of the bucket to restore from |            |
