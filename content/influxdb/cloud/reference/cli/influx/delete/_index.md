---
title: influx delete
description: The `influx delete` command deletes points from an InfluxDB bucket.
menu:
  influxdb_cloud_ref:
    name: influx delete
    parent: influx
weight: 101
influxdb/cloud/tags: [delete]
---

The `influx delete` command deletes [points](/influxdb/cloud/reference/glossary/#point)
from an InfluxDB bucket.
Identify points to delete using [delete predicate syntax](/influxdb/cloud/reference/syntax/delete-predicate).

## Usage
```
influx delete [flags]
```

{{% warn %}}
Running `influx delete` without the `-p` or `--predicate` flag deletes all data with
timestamps between the specified `--start` and `--stop` times in the specified bucket.
{{% /warn %}}

## Flags
| Flag |                  | Description                                                                                      | Input type | {{< cli/mapped >}}   |
|:---- |:---              |:-----------                                                                                      |:----------:|:------------------   |
| `-b` | `--bucket`       | Name of bucket to remove data from                                                               | string     | `INFLUX_BUCKET_NAME` |
|      | `--bucket-id`    | Bucket ID                                                                                        | string     | `INFLUX_BUCKET_ID`   |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)                            | string     |`INFLUX_CONFIGS_PATH` |
| `-h` | `--help`         | Help for the `delete` command                                                                    |            |                      |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)                                       | string     | `INFLUX_HOST`        |
| `-o` | `--org`          | Organization name                                                                                | string     | `INFLUX_ORG`         |
|      | `--org-id`       | Organization ID                                                                                  | string     | `INFLUX_ORG_ID`      |
| `-p` | `--predicate`    | InfluxQL-like predicate string (see [Delete predicate](/influxdb/cloud/reference/syntax/delete-predicate)) | string     |                      |
|      | `--skip-verify`  | Skip TLS certificate verification                                                                |            |                      |
|      | `--start`        | Start time in RFC3339 format (i.e. `2009-01-02T23:00:00Z`)                                       | string     |                      |
|      | `--stop`         | Stop time in RFC3339 format (i.e. `2009-01-02T23:00:00Z`)                                        | string     |                      |
| `-t` | `--token`        | Authentication token                                                                             | string     | `INFLUX_TOKEN`       |
