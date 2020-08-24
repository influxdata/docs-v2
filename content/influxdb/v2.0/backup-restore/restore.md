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
aliases:
  - /v2.0/backup-restore/restore
related:
  - /influxdb/v2.0/backup-restore/backup/
  - /influxdb/v2.0/reference/cli/influxd/restore/
products: [oss]
---

Use the `influxd restore` command to restore backup data and metadata from InfluxDB.
You must stop InfluxDB before restoring data.

{{% cloud %}}
The `influxd restore` command only restores data to InfluxDB OSS, **not {{< cloud-name "short" >}}**.
{{% /cloud %}}

When restoring data from a backup file set, InfluxDB temporarily moves existing
data and metadata while the restore process runs.
Once the process completes, the temporary data is deleted.
If the restore process fails, InfluxDB preserves the data in the temporary location.
_See [Recover from a failed restore](#recover-from-a-failed-restore)._

## Restore data with the influxd CLI
1. **Stop the `influxd` server.**
2. Use the `influxd restore` command and specify the path to the backup directory
   using the `--backup-path` flag.

    ```sh
    # Syntax
    influxd restore --backup-path <path-to-backup-directory>

    # Example
    influxd restore --backup-path ~/backups/2020-01-20_12-00/
    ```

    _For more information about restore options and flags, see the
    [`influxd restore` documentation](/v2.0/reference/cli/influxd/restore/)._

## Customize the TSI rebuild process
By default, InfluxDB rebuilds the index and [series file](/v2.0/reference/glossary/#series-file) when restoring data.
When rebuilding the Time Series Index (TSI), it uses the
[default `build-tsi` options](/v2.0/reference/cli/influxd/inspect/build-tsi/).
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
Manually rebuild the TSI index to [adjust the performance](/v2.0/reference/cli/influxd/inspect/build-tsi/#adjust-performance)
of the TSI rebuild process.
    {{% /note %}}

## Recover from a failed restore
If the restoration process fails, InfluxDB preserves existing data in a `tmp`
directory in the [target engine path](/v2.0/reference/cli/influxd/restore/#flags)
(default is `~/.influxdbv2/engine`).

To recover from a failed restore:

1. Copy the temporary files back into the `engine` directory.
2. Remove the `.tmp` extensions from each of the copied files.
3. Restart the `influxd` server.
