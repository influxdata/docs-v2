---
title: Back up data
seotitle: Back up data in InfluxDB
description: >
  Use `influx` command line interface (CLI) to backup data and metadata stored in InfluxDB.
menu:
  v2_0:
    parent: Back up & restore data
weight: 101
---

Use `influx` command line interface (CLI) to backup data and metadata stored in InfluxDB.

{{% cloud-msg %}}
The `influx backup` command cannot back up data stored in **{{< cloud-name "short" >}}**.
{{% /cloud-msg %}}

- Backups are stored as a file set on your local filesystem.

Use the [`influx backup` command](/v2.0/reference/cli/influx/backup/)
to create a backup of all data and metadata stored in InfluxDB.

- Directory path for where to store the backup file set
- [Authorization token](/v2.0/security/tokens/create-token/) with all-access permissions

##### Back up data with the influx CLI
```sh
# Syntax
influx backup -p <backup-path> -t <token>

# Example
influx backup -p path/to/backup_$(date '+%Y-%m-%dT%H:%M:%SZ')
```

When prompted, enter and confirm the new password.
