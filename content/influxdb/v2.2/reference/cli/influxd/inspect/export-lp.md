---
title: influxd inspect export-lp
description: >
  The `influxd inspect export-lp` command exports all time series data in a bucket
  as line protocol.
influxdb/v2.2/tags: [inspect, export]
menu:
  influxdb_2_2_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect export-lp` command exports all time-structured merge tree (TSM)
data in a bucket to [line protocol](/influxdb/v2.2/reference/syntax/line-protocol/).

## Usage
```sh
influxd inspect export-lp [flags]
```

## Flags
| Flag |                 | Description                                             | Input type |
|:---- |:---             |:-----------                                             |:----------:|
|      | `--bucket-id`   | ({{< req >}}) Bucket ID                                 | string     |
|      | `--compress`    | Compress output with GZIP                               |            |
|      | `--end`         | End time to export (RFC3339 format)                     | string     |
|      | `--engine-path` | ({{< req >}}) Path to persistent InfluxDB engine files  | string     |
| `-h` | `--help`        | Help for the `export-lp` command.                       |            |
|      | `--log-level`   | Log-level (`debug`, `info` _(default)_, or `error`)     | string     |
|      | `--measurement` | Measurement name(s) to export                           | strings    |
|      | `--output-path` | ({{< req >}}) Output path (file path or stdout _(`-`)_) | string     |
|      | `--start`       | Start time to export (RFC3339 format)                   | string     |

## Examples

- [Export all data in a bucket as line protocol](#export-all-data-in-a-bucket-as-line-protocol)
- [Export data in measurements as line protocol](#export-data-in-measurements-as-line-protocol)
- [Export data in specified time range as line protocol](#export-data-in-specified-time-range-as-line-protocol)

##### Export all data in a bucket as line protocol
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[To a file](#)
[To stdout](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --output-path path/to/export.lp
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --output-path -
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

##### Export data in measurements as line protocol

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[To a file](#)
[To stdout](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
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
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
# Export a single measurement
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --measurement example-measurement \
  --output-path -

# Export multiple measurements
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --measurement example-measurement-1 example-measurement-2 \
  --output-path -
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

##### Export data in specified time range as line protocol
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[To a file](#)
[To stdout](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --start 2021-01-01T00:00:00Z \
  --end 2021-01-31T23:59:59Z \
  --output-path path/to/export.lp
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --start 2021-01-01T00:00:00Z \
  --end 2021-01-31T23:59:59Z \
  --output-path -
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
