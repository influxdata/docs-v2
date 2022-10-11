---
title: Manage InfluxDB WAL files
description: >
  ...
menu:
  influxdb_2_4:
    name: Manage WAL files
    parent: Manage internal systems
weight: 101
---

build-tsi         Rebuilds the TSI index and (where necessary) the Series File.
delete-tsm        Deletes a measurement from a raw tsm file.
dump-tsi          Dumps low-level details about tsi1 files.
dump-tsm          Dumps low-level details about tsm1 files
dump-wal          Dumps TSM data from WAL files
export-index      Exports TSI index data
export-lp         Export TSM data as line protocol
report-tsi        Reports the cardinality of TSI files
report-tsm        Run TSM report
verify-seriesfile Verifies the integrity of series files.
verify-tombstone  Verify the integrity of tombstone files
verify-tsm        Verifies the integrity of TSM files
verify-wal        Check for WAL corruption