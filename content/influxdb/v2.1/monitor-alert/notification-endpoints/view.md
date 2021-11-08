---
title: View notification endpoint history
seotitle: View notification endpoint details and history
description: >
  View notification endpoint details and history in the InfluxDB UI.
menu:
  influxdb_2_1:
    name: View endpoint history
    parent: Manage notification endpoints
weight: 202
related:
  - /influxdb/v2.1/monitor-alert/checks/
  - /influxdb/v2.1/monitor-alert/notification-rules/
---

View notification endpoint details and history in the InfluxDB user interface (UI).

To view and manage notification endpoints:

1. In the navigation menu on the left, select **Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **{{< caps >}}Notification Endpoints{{< /caps >}}** near to top of the page.

- [View notification endpoint details](#view-notification-endpoint-details)
- [View history notification endpoint history](#view-notification-endpoint-history), including statues and notifications sent to the endpoint

## View notification endpoint details
On the notification endpoints page:

1. Click the name of the notification endpoint you want to view.
2. View the notification endpoint destination, name, and information to connect to the endpoint.

## View notification endpoint history
On the notification endpoints page, click the **{{< icon "gear" >}}** icon,
and then click **View History**.
The Check Statuses History page displays:

- Statuses generated for the selected notification endpoint
- Notifications sent to the selected notification endpoint
