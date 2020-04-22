---
title: Back up data
seotitle: Back up data in InfluxDB
description: >
  Use the `influx backup` command to back up data and metadata stored in InfluxDB.
menu:
  v2_0:
    parent: Back up & restore data
weight: 101
related:
  - /v2.0/backup-restore/restore/
  - /v2.0/reference/cli/influx/backup/
#draft: true
---

Use the [`influx backup` command](/v2.0/reference/cli/influx/backup/) to back up
data and metadata stored in InfluxDB.
InfluxDB copies all data and metadata to a set of files stored in a specified directory
on your local filesystem.

{{% warn %}}
If you set up InfluxDB using **v2.0.0-beta.1** or earlier, you cannot back up data.
Root tokens created prior to **v2.0.0-beta.2** do not have the necessary permissions.
To succesfully use the backup tool, set up a new InfluxDB instance using **v2.0.0-beta.2+**.
{{% /warn %}}

{{% cloud %}}
The `influx backup` command **cannot** back up data stored in **{{< cloud-name "short" >}}**.
{{% /cloud %}}

The `influx backup` command requires:

- The directory path for where to store the backup file set
- The **root authorization token** (the token created for the first user in the
  [InfluxDB setup process](/v2.0/get-started/)).

##### Back up data with the influx CLI
```sh
# Syntax
influx backup -p <backup-path> -t <root-token>

# Example
influx backup \
  -p path/to/backup_$(date '+%Y-%m-%d_%H-%M') \
  -t xXXXX0xXX0xxX0xx_x0XxXxXXXxxXX0XXX0XXxXxX0XxxxXX0Xx0xx==
```
