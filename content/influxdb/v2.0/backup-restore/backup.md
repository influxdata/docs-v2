---
title: Back up data
seotitle: Back up data in InfluxDB
description: >
  Use the `influx backup` command to back up data and metadata stored in InfluxDB.
menu:
  influxdb_2_0:
    parent: Back up & restore data
weight: 101
related:
  - /influxdb/v2.0/backup-restore/restore/
  - /influxdb/v2.0/reference/cli/influx/backup/
products: [oss]
---

Use the [`influx backup` command](/influxdb/v2.0/reference/cli/influx/backup/) to back up
data and metadata stored in InfluxDB.
InfluxDB copies all data and metadata to a set of files stored in a specified directory
on your local filesystem.

{{% note %}}
#### InfluxDB 1.x/2.0 compatibility
The InfluxDB 2.0 `influx backup` command is not compatible with versions of InfluxDB prior to 2.0.0.
**For information about migrating data between InfluxDB 1.x and 2.0, see:**

- [Automatically upgrade from InfluxDB 1.x to 2.0](/influxdb/v2.0/upgrade/v1-to-v2/automatic-upgrade/)
- [Manually upgrade from InfluxDB 1.x to 2.0](/influxdb/v2.0/upgrade/v1-to-v2/manual-upgrade/)
{{% /note %}}

{{% cloud %}}
The `influx backup` command **cannot** back up data stored in **{{< cloud-name "short" >}}**.
{{% /cloud %}}

The `influx backup` command requires:

- The directory path for where to store the backup file set
- The **root authorization token** (the token created for the first user in the
  [InfluxDB setup process](/influxdb/v2.0/get-started/)).

##### Back up data with the influx CLI
```sh
# Syntax
influx backup <backup-path> -t <root-token>

# Example
influx backup \
  path/to/backup_$(date '+%Y-%m-%d_%H-%M') \
  -t xXXXX0xXX0xxX0xx_x0XxXxXXXxxXX0XXX0XXxXxX0XxxxXX0Xx0xx==
```
