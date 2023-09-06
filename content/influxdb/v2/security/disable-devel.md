---
title: Disable development features
seotitle: Disable development features in InfluxDB
description: >
  Disable development features that may not be desirable in production.
weight: 105
menu:
  influxdb_v2:
    parent: Security & authorization
influxdb/v2/tags: [security, development]
---

By default, InfluxDB {{< current-version >}} enables useful functionality that exposes some level of information about your instance. Two of these are endpoints for observability of the health and activity of your instance. The third is the bundled UI. Depending on your site requirements, you may want to disable one or more of these when running InfluxDB in production. To disable, use the following configuration options:

- [Disable /debug/pprof](/influxdb/v2/reference/config-options/#pprof-disabled). This endpoint provides runtime profiling data.
- [Disable /metrics](/influxdb/v2/reference/config-options/#metrics-disabled). This endpoint exposes [internal InfluxDB metrics](/influxdb/v2/reference/internals/metrics/).
- [Disable UI](/influxdb/v2/reference/config-options/#ui-disabled). The user interface for InfluxDB.
