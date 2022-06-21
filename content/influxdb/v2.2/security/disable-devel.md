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

By default, InfluxDB {{< current-version >}} enables functionality useful in developer environments. Depending on your site requirements, you may want to disable this functionality when running InfluxDB in production. To disable, use the following options:

- [Disable /debug/pprof](/influxdb/v2.2/reference/config-options/#pprof-disabled). This endpoint provides runtime profiling data.
- [Disable /metrics](/influxdb/v2.2/reference/config-options/#metrics-disabled). This endpoint exposes [internal InfluxDB metrics](/influxdb/v2.2/reference/internals/metrics/).
- [Disable UI](/influxdb/v2.2/reference/config-options/#ui-disabled). The user interface for InfluxDB.
