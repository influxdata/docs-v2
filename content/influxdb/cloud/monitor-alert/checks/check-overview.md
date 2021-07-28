---
title: Overview of checks
seotitle: Create monitoring checks in InfluxDB
description: >
  Checks are used in monitoring and alerting.
menu:
  influxdb_cloud:
    parent: Manage checks
weight: 201
related:
  - /influxdb/cloud/monitor-alert/notification-rules/
  - /influxdb/cloud/monitor-alert/notification-endpoints/
---

A check queries data and applies a status to each point based on specified conditions. There are two types of checks:
- [Threshold check](#threshold-check)
- [Deadman check](#deadman-check)

Each check includes two parts:
- [Check query](#check-query)
- [Check configuration](#check-configuration)

## Threshold check

A threshold check assigns a status based on a value being above, below,
inside, or outside of defined thresholds.

## Deadman check

A deadman check assigns a status to data when a series or group doesn't report
in a specified amount of time.

## Check query

Specifies the dataset to monitor. May include tags to narrow results.

## Check configuration

Defines check properties, including the **check interval** and **status message**. Evaluates specified conditions, and then applies one of the following **statuses** (if applicable) to each data point and stores this status in the `_level` column:

 - `crit`
 - `warn`
 - `info`
 - `ok`
