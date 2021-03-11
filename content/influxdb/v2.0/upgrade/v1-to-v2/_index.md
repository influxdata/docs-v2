---
title: Upgrade from InfluxDB 1.x to 2.0
description: >
  Explore different methods for upgrading from InfluxDB 1.x to InfluxDB 2.0 and
  which best suits your use case.
menu:
  influxdb_2_0:
    parent: Upgrade InfluxDB
    name: InfluxDB 1.x to 2.0
weight: 10
---

Explore different methods for upgrading from InfluxDB 1.x to InfluxDB 2.0 and
which best suits your use case.
We recommend [automatically upgrading from InfluxDB 1.x to 2.0](/influxdb/v2.0/upgrade/v1-to-v2/automatic-upgrade/),
but consider the following:

**Do you want to migrate all your time series data?**  
Use the [automatic upgrade process](/influxdb/v2.0/upgrade/v1-to-v2/automatic-upgrade/).

**Do you want to selectively migrate your time series data?**  
[Manually upgrade to InfluxDB 2.0](/influxdb/v2.0/upgrade/v1-to-v2/manual-upgrade/).

**Are you using Docker?**  
[Upgrade to the 2.x Docker image](/influxdb/v2.0/upgrade/v1-to-v2/docker/).

**Are you using continuous queries (CQs)?**  
Whether your automatically or manually upgrade from InfluxDB 1.x to 2.0,
you must [manually migrate your 1.x CQs to InfluxDB 2.0 tasks](/influxdb/v2.0/upgrade/v1-to-v2/migrate-cqs/).

## Upgrade guides

{{< children >}}
