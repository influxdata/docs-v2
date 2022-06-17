---
title: Disable development features
seotitle: Disable development features in InfluxDB
description: >
  Disable development features that may not be desirable in production.
weight: 105
menu:
  influxdb_2_2:
    parent: Security & authorization
influxdb/v2.2/tags: [security, development]
---

InfluxDB {{< current-version >}} defaults to enabling functionality that is
particularly useful in developer environments but depending on
site-requirements, may not be needed when running InfluxDB in production.

- [Disable /debug/pprof](/influxdb/v2.2/reference/config-options/#pprof-disabled). This endpoint provides runtime profiling data.
- [Disable /metrics](/influxdb/v2.2/reference/config-options/#metrics-disabled). This endpoint exposes [internal InfluxDB metrics](/influxdb/v2.2/reference/internals/metrics/).
- [Disable UI](/influxdb/v2.2/reference/config-options/#ui-disabled). The user interface for InfluxDB.
