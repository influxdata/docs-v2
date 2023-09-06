---
title: influxd inspect report-db
description: >
  The `influxd inspect report-db` command reports the cardinality for an InfluxDB bucket.
influxdb/v2.7/tags: [cardinality, inspect]
menu:
  influxdb_v2_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect report-db` command analyzes an InfluxDB bucket and reports the cardinality of data stored in the bucket.

## Usage
```sh
influxd inspect report-db [flags]
```

## Flags
| Flag |              | Description                                                                                        | Input Type |
| :--- | :----------- | :------------------------------------------------------------------------------------------------- | :--------: |
|      | `--c`        | Worker concurrency (default is `1`).                                                               |  integer   |
|      | `--db-path`  | ({{< req >}}) Path to InfluxDB data directory.                                                     |   string   |
|      | `--detailed` | Include field and tag counts in output.                                                            |            |
|      | `--exact`    | Report exact counts.                                                                               |            |
| `-h` | `--help`     | View help for the `report-db` command.                                                             |            |
|      | `--rollup`   | Rollup level: `t` (total), `b` (bucket), `r` (retention policy), or `m` (measurement) _(default)_. |   string   |

## Examples

- [Report the cardinality of measurements in all buckets](#report-the-cardinality-of-measurements-in-all-buckets)
- [Report the cardinality of measurements in a specific bucket](#report-the-cardinality-of-measurements-in-a-specific-bucket)
- [Report the cardinality of all buckets](#report-the-cardinality-of-all-buckets)
- [Report the cardinality of all retention policies](#report-the-cardinality-of-all-retention-policies)
- [Report the total cardinality of your InfluxDB instance](#report-the-total-cardinality-of-your-influxdb-instance)
- [Include tag and field counts in your cardinality summary](#include-tag-and-field-counts-in-your-cardinality-summary)

### Report the cardinality of measurements in all buckets

- Use the `--db-path` flag to provide the path to your
[InfluxDB data directory](/influxdb/v2/reference/internals/file-system-layout/#tsm-directories-and-files-layout).

```sh
# Syntax
influxd inspect report-db --db-path <influxdb-data-directory>

# Example
influxd inspect report-db --db-path ~/.influxdbv2/engine/data
```

### Report the cardinality of measurements in a specific bucket

- Use the `--db-path` flag to provide the path to the
[Bucket directory (bucket ID)](/influxdb/v2/reference/internals/file-system-layout/#tsm-directories-and-files-layout)
in your [InfluxDB data directory](/influxdb/v2/reference/internals/file-system-layout/#tsm-directories-and-files-layout).

```sh
# Syntax
influxd inspect report-db --db-path <influxdb-data-directory>/<bucket-id>

# Example
influxd inspect report-db --db-path ~/.influxdbv2/engine/data/000xX00xxXx000x0
```

### Report the cardinality of all buckets

- Use the `--db-path` flag to provide the path to your
[InfluxDB data directory](/influxdb/v2/reference/internals/file-system-layout/#tsm-directories-and-files-layout).
- Use the `--rollup` flag with the value, `b`, to return a bucket-level summary of cardinality.

```sh
# Syntax
influxd inspect report-db \
  --db-path <influxdb-data-directory> \
  --rollup b

# Example
influxd inspect report-db \
  --db-path ~/.influxdbv2/engine/data \
  --rollup b
```

### Report the cardinality of all retention policies

- Use the `--db-path` flag to provide the path to your
[InfluxDB data directory](/influxdb/v2/reference/internals/file-system-layout/#tsm-directories-and-files-layout).
- Use the `--rollup` flag with the value, `r`, to return a retention-policy-level summary of cardinality.

```sh
# Syntax
influxd inspect report-db \
  --db-path <influxdb-data-directory> \
  --rollup r

# Example
influxd inspect report-db \
  --db-path ~/.influxdbv2/engine/data \
  --rollup r
```

### Report the total cardinality of your InfluxDB instance

- Use the `--db-path` flag to provide the path to your
[InfluxDB data directory](/influxdb/v2/reference/internals/file-system-layout/#tsm-directories-and-files-layout).
- Use the `--rollup` flag with the value, `t`, to return a summary of total cardinality.

```sh
# Syntax
influxd inspect report-db \
  --db-path <influxdb-data-directory> \
  --rollup t

# Example
influxd inspect report-db \
  --db-path ~/.influxdbv2/engine/data \
  --rollup t
```

### Include tag and field counts in your cardinality summary

- Use the `--db-path` flag to provide the path to your
[InfluxDB data directory](/influxdb/v2/reference/internals/file-system-layout/#tsm-directories-and-files-layout).
- Include the `--detailed` flag to return detailed cardinality summaries with tag and field counts.

```sh
# Syntax
influxd inspect report-db \
  --db-path <influxdb-data-directory> \
  --detailed

# Example
influxd inspect report-db \
  --db-path ~/.influxdbv2/engine/data \
  --detailed
```
