---
title: Restore data
seotitle: Restore data in InfluxDB
description: >
  Use the `influxd restore` command to restore data and metadata from an InfluxDB
  backup file set.
menu:
  v2_0:
    parent: Back up & restore data
weight: 101
v2.0/tags: [restore]
related:
  - /v2.0/backup-restore/backup/
  - /v2.0/reference/cli/influxd/restore/
draft: true
---

Use the `influxd restore` command to restore data and metadata from an InfluxDB backup file set.
InfluxDB only supports "offline" data restoration, meaning InfluxDB must be stopped
to safely and successfully restore data.

{{% cloud-msg %}}
The `influxd restore` command only restores data to InfluxDB OSS, **not {{< cloud-name "short" >}}**.
{{% /cloud-msg %}}

When restoring data from a backup file set, InfluxDB temporarily moves existing
data and metadata while the restore process runs.
After the process completes, the temporary data is deleted.

To restore a backup:

1. **Stop the `influxd` server.**
2. Use the `influxd restore` command and specify the path to the backup directory
   using the `--backup-path` flag.

    ##### Restore data with the influxd CLI
    ```sh
    # Syntax
    influxd restore --backup-path <path-to-backup-directory>

    # Example
    influxd restore --backup-path ~/backups/2020-01-20_12-00/
    ```

    _For more information about restore options and flags, see the
    [`influxd restore` documentation](/v2.0/reference/cli/influxd/restore/)._

## Customize the TSI rebuild process
By default, InfluxDB rebuilds the index and series file when restoring data.
It uses the default options for [`influxd inspect build-tsi`](/v2.0/reference/cli/influxd/inspect/build-tsi/).
To customize the Time Series Index (TSI) rebuild process:

1. Disable rebuilding the index and series files when restoring data:

    ```sh
    influxd restore --rebuild-index false
    ```

2. Manually run `influxd inspect build-tsi` with any
   [custom options](/v2.0/reference/cli/influxd/inspect/build-tsi/#flags).

    ```sh
    influxd inspect build-tsi \
      --max-log-file-size=1048576 \
      --max-cache-size=1073741824
    ```

    {{% note %}}
Use this method to [adjust the performance](/v2.0/reference/cli/influxd/inspect/build-tsi/#adjust-performance)
of the TSI rebuild process.
    {{% /note %}}
