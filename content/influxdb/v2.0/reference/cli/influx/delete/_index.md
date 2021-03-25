---
title: influx delete
description: The `influx delete` command deletes points from an InfluxDB bucket.
menu:
  influxdb_2_0_ref:
    name: influx delete
    parent: influx
weight: 101
influxdb/v2.0/tags: [delete]
related:
  - /influxdb/v2.0/write-data/delete-data
  - /influxdb/v2.0/reference/syntax/delete-predicate
  - /influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.0/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx delete` command deletes [points](/influxdb/v2.0/reference/glossary/#point)
from an InfluxDB bucket in a specified time range.
Select points to delete within the specified time range using [delete predicate syntax](/influxdb/v2.0/reference/syntax/delete-predicate).

{{% warn %}}
Running `influx delete` without the `-p` or `--predicate` flag deletes all data with timestamps between the specified
`--start` and `--stop` times in the specified bucket.
{{% /warn %}}

## Flags
| Flag |                   | Description                                                                                               | Input type | {{< cli/mapped >}}   |
|:---- |:---               |:-----------                                                                                               |:----------:|:------------------   |
| `-c` | `--active-config` | CLI configuration to use for command                                                                      | string     |                      |
|      | `--bucket`        | Name of bucket to remove data from (mutually exclusive with `--bucket-id`)                                | string     | `INFLUX_BUCKET_NAME` |
|      | `--bucket-id`     | Bucket ID (mutually exclusive with `--bucket`)                                                            | string     | `INFLUX_BUCKET_ID`   |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)                                     | string     |`INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `delete` command                                                                             |            |                      |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)                                                | string     | `INFLUX_HOST`        |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                                                    | string     | `INFLUX_ORG`         |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                                                         | string     | `INFLUX_ORG_ID`      |
| `-p` | `--predicate`     | InfluxQL-like predicate string (see [Delete predicate](/influxdb/v2.0/reference/syntax/delete-predicate)) | string     |                      |
|      | `--skip-verify`   | Skip TLS certificate verification                                                                         |            |                      |
|      | `--start`         | ({{< req >}}) Start time in RFC3339 format (i.e. `2009-01-02T23:00:00Z`)                                  | string     |                      |
|      | `--stop`          | ({{< req >}}) Stop time in RFC3339 format (i.e. `2009-01-02T23:00:00Z`)                                   | string     |                      |
| `-t` | `--token`         | Authentication token                                                                                      | string     | `INFLUX_TOKEN`       |

## Examples

{{< cli/influx-creds-note >}}

- [Delete all points in a measurement](#delete-all-points-in-a-measurement)
- [Delete points in a measurement with a specific tag value](#delete-points-in-a-measurement-with-a-specific-tag-value)
- [Delete all points within a specified time frame](#delete-all-points-within-a-specified-time-frame)

##### Delete all points in a measurement
```sh
influx delete \
  --bucket example-bucket \
  --start 1970-01-01T00:00:00Z \
  --stop $(date +"%Y-%m-%dT%H:%M:%SZ") \
  --predicate '_measurement="example-measurement"'
```

##### Delete points in a measurement with a specific tag value
```sh
influx delete \
  --bucket example-bucket \
  --start 1970-01-01T00:00:00Z \
  --stop $(date +"%Y-%m-%dT%H:%M:%SZ") \
  --predicate '_measurement="example-measurement" AND host="old-host"'
```

##### Delete all points within a specified time frame
```sh
influx delete \
  --bucket example-bucket \
  --start 2020-03-01T00:00:00Z \
  --stop 2020-11-14T00:00:00Z
```