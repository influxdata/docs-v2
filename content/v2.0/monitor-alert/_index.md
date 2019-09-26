---
title: Monitor data and send alerts
seotitle: Monitor data and send alerts
description: >
  Monitor your time series data and send alerts by creating checks, notification
  rules, and notification endpoints.
menu:
  v2_0:
    name: Monitor & alert
weight: 6
v2.0/tags: [monitor, alert, checks, notification, endpoints]
---

Monitor your time series data and send alerts by creating checks, notification
rules, and notification endpoints.

## The monitoring workflow

1.  A [check](/v2.0/reference/glossary/#check) in InfluxDB queries data and assigns a status with a `_level` based on specific conditions.
2.  InfluxDB stores the output of a check in the `statuses` measurement in the `_monitoring` system bucket.
3.  [Notification rules](/v2.0/reference/glossary/#notification-rule) check data in the `statuses`
    measurement and, based on conditions set in the notification rule, send a message
    to a [notification endpoint](/v2.0/reference/glossary/#notification-endpoint).
4.  InfluxDB stores notifications in the `notifications` measurement in the `_monitoring` system bucket.

## Monitor your data
To get started, do the following:

1.  [Create checks](/v2.0/monitor-alert/checks/create/) to monitor data and assign a status.
2.  [Add notification endpoints](/v2.0/monitor-alert/notification-endpoints/create/)
    to send notifications to third parties.
3.  [Create notification rules](/v2.0/monitor-alert/notification-rules/create) to check
    statuses and send notifications to your notifications endpoints.


## Manage your monitoring and alerting pipeline

{{< children >}}
