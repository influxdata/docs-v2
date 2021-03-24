---
title: influxd inspect export-lp
description: >
  The `influxd inspect export-lp` command exports all time series data in a bucket
  as line protocol.
influxdb/v2.0/tags: [inspect]
menu:
  influxdb_2_0_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect export-lp` command exports all time-structured merge tree (TSM)
data in a bucket to [line protocol](/influxdb/v2.0/reference/syntax/line-protocol/).

## Usage
```sh
influxd inspect export-lp [flags]
```

## Flags
| Flag |                 | Description                                            | Input type |
|:---- |:---             |:-----------                                            |:----------:|
|      | `--bucket-id`   | ({{< req >}}) Bucket ID                                | string     |
|      | `--compress`    | Compress output with GZIP                              |            |
|      | `--end`         | End time to export (RFC3339 format)                    | string     |
|      | `--engine-path` | ({{< req >}}) Path to persistent InfluxDB engine files | string     |
| `-h` | `--help`        | Help for the `export-lp` command.                      |            |
|      | `--log-level`   | Log-level (`debug`, `info` _(default)_, or `error`)    | string     |
|      | `--measurement` | Measurement name(s) to export                          | strings    |
|      | `--output-path` | ({{< req >}}) Output file path                         | string     |
|      | `--start`       | Start time to export (RFC3339 format)                  | string     |

## Examples

- [Export all data in a bucket as line protocol](#export-all-data-in-a-bucket-as-line-protocol)
- [Export data in measurements as line protocol](#export-data-in-measurements-as-line-protocol)
- [Export data in specified time range as line protocol](#export-data-in-specified-time-range-as-line-protocol)
- [Export data as line protocol to stdout](#export-data-as-line-protocol-to-stdout)

##### Export all data in a bucket as line protocol
```sh
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --output-path path/to/export.lp
```

##### Export data in measurements as line protocol
```sh
# Export a single measurement
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --measurement example-measurement \
  --output-path path/to/export.lp

# Export multiple measurements
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --measurement example-measurement-1 example-measurement-2 \
  --output-path path/to/export.lp
```

##### Export data in specified time range as line protocol
```sh
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --start 2021-01-01T00:00:00Z \
  --end 2021-01-31T23:59:59Z \
  --output-path path/to/export.lp
```

##### Export data as line protocol to stdout
```sh
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --output-path -
```
