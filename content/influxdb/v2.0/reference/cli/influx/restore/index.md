---
title: influx restore
description: The `influx restore` command restores backup data and metadata from an InfluxDB backup directory.
influxdb/v2.0/tags: [restore]
menu:
  influxdb_2_0_ref:
    parent: influx
weight: 101
alias:
  - /influxdb/v2.0/reference/cli/influxd/restore/
related:
  - /influxdb/v2.0/backup-restore/restore/
  - /influxdb/v2.0/reference/cli/influx/backup/
  - /influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.0/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx restore` command restores backup data and metadata from an InfluxDB OSS backup directory.

### The restore process
When restoring data from a backup file set, InfluxDB temporarily moves existing
data and metadata while `restore` runs.
After `restore` completes, the temporary data is deleted.
If the restore process fails, InfluxDB preserves the data in the temporary location.

_For information about recovering from a failed restore process, see
[Restore data](/influxdb/v2.0/backup-restore/restore/#recover-from-a-failed-restore)._

{{% note %}}
#### Cannot restore to existing buckets
The `influx restore` command cannot restore data to existing buckets.
Use the `--new-bucket` flag to create a bucket with a new name and restore data into it.
To restore data and retain bucket names, [delete existing buckets](/influxdb/v2.0/organizations/buckets/delete-bucket/)
and then begin the restore process.
{{% /note %}}

## Usage

```
influx restore [flags]
```

## Flags

| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config` | CLI configuration to use for command                                  |   string   |                       |
| `-b` | `--bucket`        | Name of the bucket to restore (mutually exclusive with `--bucket-id`) |   string   |                       |
|      | `--bucket-id`     | ID of the bucket to restore (mutually exclusive with `--bucket`)      |   string   |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
|      | `--full`          | Fully restore and replace all data on server                          |            |                       |
| `-h` | `--help`          | Help for the `restore` command                                        |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          |   string   |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--new-bucket`    | Name of the bucket to restore to                                      |   string   |                       |
|      | `--new-org`       | Name of the organization to restore to                                |   string   |                       |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                |   string   |                       |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     |   string   |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`         | Authentication token                                                  |   string   | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [Restore backup data](#restore-backup-data)
- [Restore backup data for a specific bucket into a new bucket](#restore-backup-data-for-a-specific-bucket-into-a-new-bucket)
- [Restore and replace all data](#restore-and-replace-all-data)

##### Restore backup data
```sh
influx restore /path/to/backup/dir/
```

##### Restore backup data for a specific bucket into a new bucket
```sh
influx restore \
  --bucket example-bucket \
  --new-bucket new-example-bucket \
  /path/to/backup/dir/
```

##### Restore and replace all data
{{% note %}}
`influx restore --full` restores all time series data _and_ InfluxDB key-value
data such as tokens, dashboards, users, etc.
{{% /note %}}

```sh
influx restore --full /path/to/backup/dir/
```
