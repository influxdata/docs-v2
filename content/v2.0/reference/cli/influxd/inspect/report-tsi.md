---
title: influxd inspect report-tsi
description: >
  The `influxd inspect report-tsi` command analyzes Time Series Index (TSI) files
  in a storage directory and reports the cardinality of data stored in the files.
v2.0/tags: [tsi, cardinality, inspect]
menu:
  v2_0_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect report-tsi` command analyzes Time Series Index (TSI) files
in a storage directory and reports the cardinality of data stored in the files.
The report is divided into organization and bucket cardinalities.

## Output details
`influxd inspect report-tsi` outputs the following:

- All organizations and buckets in the index.
- The series cardinality within each organization and bucket.
- The time taken to read the index.

When the `--measurements` flag is included, series cardinality is segmented in
the following ways:

- Series cardinality for each organization.
- Series cardinality for each bucket.
- Series cardinality for each measurement.

## Usage
```sh
influxd inspect report-tsi [flags]
```

## Flags
| Flag                   | Description                                                                   | Input Type |
|:----                   |:-----------                                                                   |:----------:|
| `--bucket-id`          | Process only data belonging to bucket ID. _Requires `org-id` flag to be set._ | string     |
| `-h`, `--help`         | Help for `report-tsi`.                                                        |            |
| `-m`, `--measurements` | Segment cardinality by measurements.                                          |            |
| `-o`, `--org-id`       | Process only data belonging to organization ID.                               | string     |
| `--path`               | Path to index. Defaults to `~/.influxdbv2/engine/index`.                      | string     |
| `--series-file`        | Path to series file. Defaults to `~/.influxdbv2/engine/_series`.              | string     |
| `-t`, `-top`           | Limit results to the top n.                                                   | integer    |
