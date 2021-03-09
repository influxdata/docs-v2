---
title: Upgrade InfluxDB
description: >
  Upgrade from InfluxDB 1.x to InfluxDB 2.0.
menu:
  influxdb_2_0:
    parent: Upgrade InfluxDB
    name: InfluxDB 1.x to 2.0
weight: 10
---

To migrate all data, use the `influxd upgrade` tool.
<!-- Is there a way to use `influxd upgrade` for time series data only, and ignore other resources/configs? -->

If you will be continuing to use 1.x client libraries to write data to InfluxDB 2.0,
**and** do not have auth enabled,
see the [manual upgrade process](/influxdb/v2.0/upgrade/v1-to-v2/manual-upgrade).

{{< children >}}

<!-- Automatically upgrade from InfluxDB 1.x to InfluxDB 2.0 -->
<!-- Upgrade from InfluxDB 1.x to InfluxDB 2.0. -->

<!-- Manually upgrade from InfluxDB 1.x to 2.0 -->
<!-- Manually upgrade from InfluxDB 1.x to InfluxDB 2.0. -->

<!-- Upgrade from InfluxDB 1.x to 2.0 with Docker -->
<!-- Use the automated upgrade process built into the InfluxDB 2.x Docker image to update InfluxDB 1.x Docker deployments to InfluxDB 2.x. -->

<!-- Migrate continuous queries to tasks -->
<!-- InfluxDB OSS 2.0 replaces 1.x continuous queries (CQs) with InfluxDB tasks. To migrate continuous queries to InfluxDB 2.0, convert InfluxDB 1.x CQs into Flux and create new InfluxDB 2.0 tasks. -->

