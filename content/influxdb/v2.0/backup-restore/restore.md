---
title: Restore data
seotitle: Restore data in InfluxDB
description: >
  Use the `influxd restore` command to restore backup data and metadata from InfluxDB.
menu:
  influxdb_2_0:
    parent: Back up & restore data
weight: 101
influxdb/v2.0/tags: [restore]
related:
  - /influxdb/v2.0/backup-restore/backup/
  - /influxdb/v2.0/reference/cli/influxd/restore/
products: [oss]
---

Use the `influx restore` command to restore backup data and metadata from InfluxDB OSS.

{{% cloud %}}
The `influx restore` command only restores data to InfluxDB OSS, **not {{< cloud-name "short" >}}**.
{{% /cloud %}}

When restoring data from a backup file set, InfluxDB temporarily moves existing
data and metadata while the restore process runs.
Once the process completes, the temporary data is deleted.
If the restore process fails, InfluxDB preserves the data in the temporary location.
_See [Recover from a failed restore](#recover-from-a-failed-restore)._

## Restore data with the influx CLI
Use the `influx restore` command and specify the path to the backup directory in the first argument.

```sh
# Syntax
influx restore <path-to-backup-directory>

# Example
influx restore ~/backups/2020-01-20_12-00/
```

_For more information about restore options and flags, see the
[`influx restore` documentation](/influxdb/v2.0/reference/cli/influx/restore/)._


## Recover from a failed restore
If the restoration process fails, InfluxDB preserves existing data in a `tmp`
directory in the [target engine path](/influxdb/v2.0/reference/cli/influx/restore/#flags)
(default is `~/.influxdbv2/engine`).

To recover from a failed restore:

1. Copy the temporary files back into the `engine` directory.
2. Remove the `.tmp` extensions from each of the copied files.
3. Restart the `influxd` server.
