---
title: influxd inspect report-tsi
description: >
  The `influxd inspect report-tsi` command analyzes Time Series Index (TSI) files
  in a storage directory and reports the cardinality of data stored in the files.
influxdb/v2.1/tags: [tsi, cardinality, inspect]
menu:
  influxdb_2_1_ref:
    parent: influxd inspect
weight: 301
draft: true
---

The `influxd inspect report-tsi` command analyzes Time Series Index (TSI) files
in a storage directory and reports the cardinality of data stored in the files
by organization and bucket.

## Output details
`influxd inspect report-tsi` outputs the following:

- All organizations and buckets in the index.
- The series cardinality within each organization and bucket.
- Time to read the index.

When the `--measurements` flag is included, series cardinality is grouped by:

- organization
- bucket
- measurement

## Usage
```sh
influxd inspect report-tsi [flags]
```

## Flags
| Flag |                  | Description                                                               | Input Type |
|:---- |:---              |:-----------                                                               |:----------:|
|      | `--bucket-id`    | Process data for specified bucket ID. _Requires `org-id` flag to be set._ | string     |
| `-h` | `--help`         | View Help for the `report-tsi` command.                                   |            |
| `-m` | `--measurements` | Group cardinality by measurements.                                        |            |
| `-o` | `--org-id`       | Process data for specified organization ID.                               | string     |
|      | `--path`         | Specify path to index. Defaults to `~/.influxdbv2/engine/index`.          | string     |
|      | `--series-file`  | Specify path to series file. Defaults to `~/.influxdbv2/engine/_series`.  | string     |
| `-t` | `-top`           | Limit results to the top n.                                               | integer    |
