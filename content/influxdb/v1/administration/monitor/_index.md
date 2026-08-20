---
title: Monitor InfluxDB
description: >
  Monitor the health and performance of your InfluxDB server, or use InfluxDB
  and the TICK stack to monitor other systems.
aliases:
  - /influxdb/v1/administration/server_monitoring/
  - /influxdb/v1/administration/statistics/
  - /influxdb/v1/troubleshooting/statistics/
menu:
  influxdb_v1:
    name: Monitor InfluxDB
    weight: 80
    parent: Administration
---

Monitoring is the act of observing changes in data over time. "Monitoring"
covers two different things:

- **Monitor InfluxDB itself**—track the health and performance of your
  InfluxDB server.
- **Monitor other systems with InfluxDB**—use InfluxDB and the wider TICK
  stack (Telegraf, Chronograf, Kapacitor) as your monitoring backend for
  infrastructure and applications.

## Monitor InfluxDB itself

- [`_internal` measurements and fields](/influxdb/v1/administration/monitor/measurements-internal/)
- [SHOW STATS](/influxdb/v1/administration/monitor/show-stats/)
- [SHOW DIAGNOSTICS](/influxdb/v1/administration/monitor/show-diagnostics/)
- [Performance metrics commands and the `/metrics` endpoint](/influxdb/v1/administration/monitor/performance-metrics-commands/)

## Monitor other systems with InfluxDB

- [Monitoring dashboards](/influxdb/v1/administration/monitor/monitoring-dashboards/)
- [Internal vs. external monitoring](/influxdb/v1/administration/monitor/internal-vs-external/) and [watcher of watchers setup](/influxdb/v1/administration/monitor/external-monitor-setup/)
- [Kapacitor measurements](/influxdb/v1/administration/monitor/kapacitor-measurements/)
- [Monitor Kubernetes](/influxdb/v1/administration/monitor/monitor-kubernetes/)
