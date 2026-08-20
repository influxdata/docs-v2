---
title: Monitor InfluxDB Enterprise v1
description: Monitor InfluxDB Enterprise with InfluxDB Cloud or OSS.
menu:
  enterprise_influxdb_v1:
    name: Monitor
    parent: Administration
    weight: 50
aliases:
  - /enterprise_influxdb/v1/administration/monitor-enterprise/monitor-with-cloud/
  - /enterprise_influxdb/v1/administration/monitor/monitor-with-cloud/
---

Monitoring is the act of observing changes in data over time. "Monitoring"
covers two different things:

- **Monitor InfluxDB itself**—track the health and performance of your
  InfluxDB Enterprise cluster.
- **Monitor other systems with InfluxDB**—use InfluxDB and the wider TICK
  stack (Telegraf, Chronograf, Kapacitor) as your monitoring backend for
  infrastructure and applications.

### Monitor with InfluxDB Insights

> [!Note]
> For InfluxDB Enterprise customers, Insights is a free service that monitors your cluster and sends metrics to a private Cloud account. This allows InfluxDB Support to monitor your cluster health and access usage statistics when assisting with support tickets that you raise.
>
> To apply for this service, please [contact InfluxData support](https://support.influxdata.com).

## Monitor InfluxDB itself

- [`_internal` measurements and fields](/enterprise_influxdb/v1/administration/monitor/measurements-internal/)
- [SHOW STATS](/enterprise_influxdb/v1/administration/monitor/show-stats/) and [SHOW DIAGNOSTICS](/enterprise_influxdb/v1/administration/monitor/show-diagnostics/)
- [Monitor with InfluxDB OSS](/enterprise_influxdb/v1/administration/monitor/monitor-with-oss/)
- [Log and trace InfluxDB Enterprise operations](/enterprise_influxdb/v1/administration/monitor/logs/)
- [Use InfluxQL for diagnostics](/enterprise_influxdb/v1/administration/monitor/diagnostics/)

## Monitor other systems with InfluxDB

- [Monitoring dashboards](/enterprise_influxdb/v1/administration/monitor/monitoring-dashboards/)
- [Internal vs. external monitoring](/enterprise_influxdb/v1/administration/monitor/internal-vs-external/) and [watcher of watchers setup](/enterprise_influxdb/v1/administration/monitor/external-monitor-setup/)
- [Kapacitor measurements](/enterprise_influxdb/v1/administration/monitor/kapacitor-measurements/)
- [Monitor Kubernetes](/enterprise_influxdb/v1/administration/monitor/monitor-kubernetes/)
