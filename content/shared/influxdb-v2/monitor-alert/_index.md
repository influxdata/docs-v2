
Monitor your time series data and send alerts by creating checks, notification
rules, and notification endpoints. Or use [community templates to monitor](/influxdb/version/monitor-alert/templates/) supported environments.

## Overview

1.  A [check](/influxdb/version/reference/glossary/#check) in InfluxDB queries data and assigns a status with a `_level` based on specific conditions.
2.  InfluxDB stores the output of a check in the `statuses` measurement in the `_monitoring` system bucket.
3.  [Notification rules](/influxdb/version/reference/glossary/#notification-rule) check data in the `statuses`
    measurement and, based on conditions set in the notification rule, send a message
    to a [notification endpoint](/influxdb/version/reference/glossary/#notification-endpoint).
4.  InfluxDB stores notifications in the `notifications` measurement in the `_monitoring` system bucket.

## Create an alert

To get started, do the following:

1.  [Create checks](/influxdb/version/monitor-alert/checks/create/) to monitor data and assign a status.
2.  [Add notification endpoints](/influxdb/version/monitor-alert/notification-endpoints/create/)
    to send notifications to third parties.
3.  [Create notification rules](/influxdb/version/monitor-alert/notification-rules/create) to check
    statuses and send notifications to your notifications endpoints.

## Manage your monitoring and alerting pipeline

{{< children >}}
