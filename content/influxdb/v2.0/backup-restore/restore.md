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

- [Restore data with the influx CLI](#restore-data-with-the-influx-cli)
- [Recover from a failed restore](#recover-from-a-failed-restore)

When restoring data from a backup file set, InfluxDB temporarily moves existing data and metadata.
Once the process completes, InfluxDB deletes the temporary data.
If the restore process fails, InfluxDB preserves the data in the temporary location.
_See [Recover from a failed restore](#recover-from-a-failed-restore)._

{{% note %}}
#### Cannot restore to existing buckets
The `influx restore` command cannot restore data to existing buckets.
Use the `--new-bucket` flag to specify the new bucket to restore data to.
To restore data and retain bucket names, [delete existing buckets](/influxdb/v2.0/organizations/buckets/delete-bucket/)
and then begin the restore process.
{{% /note %}}

## Restore data with the influx CLI
Use the `influx restore` command and specify the path to the backup directory.

_For more information about restore options and flags, see the
[`influx restore` documentation](/influxdb/v2.0/reference/cli/influx/restore/)._

- [Restore all time series data](#restore-all-time-series-data)
- [Restore data from a specific bucket](#restore-data-from-a-specific-bucket)
- [Restore and replace all InfluxDB data](#restore-and-replace-all-influxdb-data)

### Restore all time series data
To restore all time series data from a bucket directory into buckets with the
same name as the backup source buckets, provide the following:

- backup directory path

```sh
influx restore \
  --input /backups/2020-01-20_12-00/
```

### Restore data from a specific bucket
To restore data from a specific bucket in a backup directory, provide the following:

- backup directory path
- bucket name or ID

```sh
influx restore \
  --input /backups/2020-01-20_12-00/ \
  --bucket example-bucket

# OR

influx restore \
  --input /backups/2020-01-20_12-00/ \
  --bucket-id 000000000000
```

If a bucket with the same name as the backed up bucket already exists, use the
`--new-bucket` flag to specify a new bucket to restore the data to.

```sh
influx restore \
  --input /backups/2020-01-20_12-00/ \
  --bucket example-bucket \
  --new-bucket new-example-bucket
```

### Restore and replace all InfluxDB data
To restore and replace all time series data _and_ InfluxDB key-value data such as
tokens, users, dashboards, etc., include the following:

- `--full` flag
- backup directory path

```sh
influx restore \
  --input /backups/2020-01-20_12-00/ \
  --full
```

{{% note %}}
#### Restore to a brand new InfluxDB server
If using a backup to populate a new InfluxDB server:

1. Retrieve the [admin token](/influxdb/v2.0/security/tokens/#admin-token) from your source InfluxDB instance.
2. Set up your new InfluxDB instance, but use the `-t`, `--token` flag to use the
   **admin token** from your source instance as the admin token on your new instance.

    ```sh
    influx setup --token My5uP3rSecR37t0keN
    ```
3. Restore the backup to the new server.

    ```sh
    influx restore \
      --input /backups/2020-01-20_12-00/ \
      --full
    ```
{{% /note %}}


## Recover from a failed restore
If the restoration process fails, InfluxDB preserves existing data in a `tmp`
directory in the [target engine path](/influxdb/v2.0/reference/cli/influx/restore/#flags)
(default is `~/.influxdbv2/engine`).

To recover from a failed restore:

1. Copy the temporary files back into the `engine` directory.
2. Remove the `.tmp` extensions from each of the copied files.
3. Restart the `influxd` server.
