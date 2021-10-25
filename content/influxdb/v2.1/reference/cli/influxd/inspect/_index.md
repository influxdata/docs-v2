---
title: influxd inspect
description: The `influxd inspect` commands and subcommands inspecting on-disk InfluxDB time series data.
influxdb/v2.1/tags: [inspect]
menu:
  influxdb_2_1_ref:
    parent: influxd
weight: 201
---

The `influxd inspect` commands and subcommands inspecting on-disk InfluxDB time series data.

## Usage
```sh
influxd inspect [subcommand]
```

## Subcommands
| Subcommand                                                                           | Description                             |
| :----------------------------------------------------------------------------------- | :-------------------------------------- |
| [build-tsi](/influxdb/v2.1/reference/cli/influxd/inspect/build-tsi/)                 | Rebuild the TSI index and series file   |
| [delete-tsm](/influxdb/v2.1/reference/cli/influxd/inspect/delete-tsm/)               | Delete a measurement from a TSM file   |
| [dump-tsi](/influxdb/v2.1/reference/cli/influxd/inspect/dump-tsi/)                   | Output low level TSI information        |
| [dump-tsm](/influxdb/v2.1/reference/cli/influxd/inspect/dump-tsm/)                   | Output low level TSM information        |
| [dump-wal](/influxdb/v2.1/reference/cli/influxd/inspect/dump-wal/)                   | Output TSM data from WAL files          |
| [export-index](/influxdb/v2.1/reference/cli/influxd/inspect/export-index/)           | Export TSI index data                   |
| [export-lp](/influxdb/v2.1/reference/cli/influxd/inspect/export-lp/)                 | Export TSM data to line protocol        |
| [report-tsi](/influxdb/v2.1/reference/cli/influxd/inspect/report-tsi/)               | Report the cardinality of TSI files     |
| [report-tsm](/influxdb/v2.1/reference/cli/influxd/inspect/report-tsm/)               | Report information about TSM files      |
| [verify-seriesfile](/influxdb/v2.1/reference/cli/influxd/inspect/verify-seriesfile/) | Verify the integrity of series files    |
| [verify-tombstone](/influxdb/v2.1/reference/cli/influxd/inspect/verify-tombstone/)   | Verify the integrity of tombstone files |
| [verify-tsm](/influxdb/v2.1/reference/cli/influxd/inspect/verify-tsm/)               | Verify the integrity of TSM files       |
| [verify-wal](/influxdb/v2.1/reference/cli/influxd/inspect/verify-wal/)               | Verify the integrity of WAL files       |

## Flags
| Flag |          | Description                    |
|:---- |:---      |:-----------                    |
| `-h` | `--help` | Help for the `inspect` command |
