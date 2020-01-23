---
title: Back up data
seotitle: Back up data in InfluxDB
description: >
  Use the `influx backup` command to back up all data and metadata stored in InfluxDB.
menu:
  v2_0:
    parent: Back up & restore data
weight: 101
related:
  - /v2.0/backup-restore/restore/
  - /v2.0/reference/cli/influx/backup/
draft: true
---

Use the [`influx backup` command](/v2.0/reference/cli/influx/backup/) to back up
all data and metadata stored in InfluxDB.
InfluxDB copies all data and metadata to a file set stored in a specified location
on your local filesystem.

{{% warn %}}
If your InfluxDB instance was set up using a version of InfluxDB **v2.0.0-beta.2**,
you will not be able to successfully back up data.
Root tokens created prior to v2.0.0-beta.2 do not have the necessary permissions.
{{% /warn %}}

{{% cloud-msg %}}
The `influx backup` command **cannot** back up data stored in **{{< cloud-name "short" >}}**.
{{% /cloud-msg %}}

The `influx backup` command requires:

- The directory path for where to store the backup file set
- The **root authorization token** created when InfluxDB was initially set up

##### Back up data with the influx CLI
```sh
# Syntax
influx backup -p <backup-path> -t <root-token>

# Example
influx backup \
  -p path/to/backup_$(date '+%Y-%m-%d_%H-%M') \
  -t xXXXX0xXX0xxX0xx_x0XxXxXXXxxXX0XXX0XXxXxX0XxxxXX0Xx0xx==
```
