---
title: Manage the InfluxDB time series index (TSI)
description: >
  ...
menu:
  influxdb_2_4:
    name: Manage TSI indexes
    parent: Manage internal systems
weight: 101
---

The InfluxDB [Time Series Index (TSI)](/influxdb/v2.4/reference/internals/storage-engine/#time-series-index-tsi) indexes or caches measurement and tag data to ensure queries are performant.

## Rebuild the TSI index

build-tsi         Rebuilds the TSI index and (where necessary) the Series File.

## Output information about TSI index fils

dump-tsi          Dumps low-level details about tsi1 files.

## Export TSI index data

export-index      Exports TSI index data

## Report the cardinality of TSI files

report-tsi        Reports the cardinality of TSI files

