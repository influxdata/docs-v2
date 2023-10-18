---
title: Manage InfluxDB TSM files
description: >
  ...
menu:
  influxdb_v2:
    name: Manage TSM files
    parent: Manage internal systems
weight: 101
draft: true
---

<!-- 

Marked as draft. Placeholder for future content.

-->

- influxd inspect delete-tsm        Deletes a measurement from a raw tsm file.
- influxd inspect dump-tsm          Dumps low-level details about tsm1 files
- influxd inspect export-lp         Export TSM data as line protocol
- influxd inspect report-tsm        Run TSM report
- influxd inspect verify-tombstone  Verify the integrity of tombstone files
- influxd inspect verify-tsm        Verifies the integrity of TSM files
- influxd inspect verify-wal        Check for WAL corruption
- influxd inspect verify-tombstone  Verify the integrity of tombstone files
- influxd inspect verify-seriesfile Verifies the integrity of series files.
- influxd inspect build-tsi --compact-series-file (Compact a series file without rebuilding the index)