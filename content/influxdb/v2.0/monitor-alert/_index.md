---
title: Monitor data and send alerts
seotitle: Monitor data and send alerts
description: >
  Monitor your time series data and send alerts by creating checks, notification
  rules, and notification endpoints. Or use community templates to monitor supported environments.
menu:
  influxdb_2_0:
    name: Monitor & alert
weight: 7
influxdb/v2.0/tags: [monitor, alert, checks, notification, endpoints]
---

Monitor your time series data and send alerts by creating checks, notification
rules, and notification endpoints. Or use [community templates to monitor](/influxdb/v2.0/monitor-alert/templates/) supported environments.

## Overview

1. A [check](/influxdb/v2.0/reference/glossary/#check) in InfluxDB queries data and assigns a status with a `_level` based on specific conditions.
2. InfluxDB stores the output of a check in the `statuses` measurement in the `_monitoring` system bucket.
3. A [rejected point](/{{% latest "influxdb" %}}/reference/glossary/#rejected-point) in InfluxDB is a log entry that contains information about a data point that InfluxDB could not write to the target bucket. 
4. InfluxDB stores rejected data points in the `rejected_points` measurement in the `_monitoring` system bucket. 
5. [Notification rules](/influxdb/v2.0/reference/glossary/#notification-rule) check data in the `statuses`
    measurement and, based on conditions set in the notification rule, send a message
    to a [notification endpoint](/influxdb/v2.0/reference/glossary/#notification-endpoint).
6. InfluxDB stores notifications in the `notifications` measurement in the `_monitoring` system bucket.

## Create an alert

To get started, do the following:

1.  [Create checks](/influxdb/v2.0/monitor-alert/checks/create/) to monitor data and assign a status.
2.  [Add notification endpoints](/influxdb/v2.0/monitor-alert/notification-endpoints/create/)
    to send notifications to third parties.
3.  [Create notification rules](/influxdb/v2.0/monitor-alert/notification-rules/create) to check
    statuses and send notifications to your notifications endpoints.

## Manage your monitoring and alerting pipeline

{{< children >}}
