---
title: influxd inspect report-tsm
description: >
  The `influxd inspect report-tsm` command analyzes Time-Structured Merge Tree (TSM)
  files within a storage engine directory and reports the cardinality within the files
  and the time range the data covers.
influxdb/v2.1/tags: [tsm, cardinality, inspect]
menu:
  influxdb_2_1_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect report-tsm` command analyzes Time-Structured Merge Tree (TSM)
files within a storage engine directory and reports the cardinality within the files
and the time range the data covers.

This command only reports on the index within each TSM file.
It does not read any block data.
To reduce heap requirements, by default `report-tsm` estimates the overall
cardinality in the file set by using the HLL++ algorithm.
Determine exact cardinalities by using the `--exact` flag.

## Usage
```sh
influxd inspect report-tsm [flags]
```

## Output details
`influxd inspect report-tsm` outputs the following for each TSM file:

- The full file name.
- The series cardinality within the file.
- The number of series first encountered within the file.
- The minimum and maximum timestamp associated with TSM data in the file.
- The time to load the TSM index and apply any tombstones.

The summary section then outputs the total time range and series cardinality for
the file set. Depending on the `--detailed` flag, series cardinality is segmented
in the following ways:

- Series cardinality for each organization.
- Series cardinality for each bucket.
- Series cardinality for each measurement.
- Number of field keys for each measurement.
- Number of tag values for each tag key.

## Flags
| Flag |               | Description                                                                                      | Input Type |
| :--- | :------------ | :----------------------------------------------------------------------------------------------- | :--------: |
|      | `--data-path` | Path to data directory (defaults to `~/.influxdbv2/engine/data`).                                |   string   |
|      | `--detailed`  | Emit series cardinality segmented by measurements, tag keys, and fields. _**May take a while**_. |            |
|      | `--exact`     | Calculate an exact cardinality count. _**May use significant memory**_.                          |            |
| `-h` | `--help`      | Help for the `report-tsm` command.                                                               |            |
|      | `--pattern`   | Only process TSM files containing pattern.                                                       |   string   |
