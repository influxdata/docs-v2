---
title: influx restore
description: The `influx restore` command restores backup data and metadata from an InfluxDB backup directory.
influxdb/v2.0/tags: [restore]
menu:
  influxdb_2_0_ref:
    parent: influx
weight: 201
alias:
  - /influxdb/v2.0/reference/cli/influxd/restore/
related:
  - /influxdb/v2.0/backup-restore/restore/
---

The `influx restore` command restores backup data and metadata from an InfluxDB backup directory.

{{% warn %}}
Shut down the `influxd` server before restoring data.
{{% /warn %}}

### The restore process
When restoring data from a backup file set, InfluxDB temporarily moves existing
data and metadata while `restore` runs.
After `restore` completes, the temporary data is deleted.
If the restore process fails, InfluxDB preserves the data in the temporary location.

_For information about recovering from a failed restore process, see
[Restore data](/influxdb/v2.0/backup-restore/restore/#recover-from-a-failed-restore)._


## Usage

```
influxd restore [flags]
```

## Flags

| Flag |                | Description                                  | Input type |
|------|----------------|----------------------------------------------|------------|
|      | `--bucket-id`  | ID of the bucket to restore from             | string     |
| `-b` | `--bucket`     | Name of the bucket to restore from           | string     |
|      | `--full`       | Fully restore and replace all data on server |            |
|      | `--new-bucket` | Name of the bucket to restore to             | string     |
|      | `--new-org`    | Name of the organization to restore to       | string     |
|      | `--org-id`     | ID of the org to restore from                | string     |
| `-o` | `--org`        | Name of the org to restore from              | string     |
