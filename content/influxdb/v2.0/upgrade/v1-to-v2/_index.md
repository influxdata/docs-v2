---
title: Upgrade from InfluxDB 1.x to 2.0
description: >
  Explore different methods for upgrading from InfluxDB 1.x to InfluxDB 2.0 and
  choose the best one for your use case.
menu:
  influxdb_2_0:
    parent: Upgrade InfluxDB
    name: InfluxDB 1.x to 2.0
weight: 10
---

Explore different methods for upgrading from InfluxDB 1.x to InfluxDB 2.0 and
determine which best suits your use case.
Consider the following:

#### Do you want to migrate all your time series data?
[Automatically upgrade to InfluxDB 2.0](/influxdb/v2.0/upgrade/v1-to-v2/automatic-upgrade/).

#### Do you want to selectively migrate your time series data?
[Manually upgrade to InfluxDB 2.0](/influxdb/v2.0/upgrade/v1-to-v2/manual-upgrade/).

#### Are you using Docker?
[Upgrade to the 2.x Docker image](/influxdb/v2.0/upgrade/v1-to-v2/docker/).

#### Are you using continuous queries (CQs)?
After you upgrade (automatically, manually, or using Docker),
[migrate your 1.x CQs to InfluxDB 2.0 tasks](/influxdb/v2.0/upgrade/v1-to-v2/migrate-cqs/).
