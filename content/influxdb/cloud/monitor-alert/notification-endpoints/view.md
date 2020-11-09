---
title: View notification endpoint history
seotitle: View notification endpoint details and history
description: >
  View notification endpoint details and history in the InfluxDB UI.
menu:
  influxdb_cloud:
    name: View endpoint history
    parent: Manage notification endpoints
weight: 202
related:
  - /influxdb/cloud/monitor-alert/checks/
  - /influxdb/cloud/monitor-alert/notification-rules/
---

View notification endpoint details and history in the InfluxDB user interface (UI).

- [View notification endpoints](#view-notification-endpoints)
- [View notification endpoint details](#view-notification-endpoint-details)
- [View history notification endpoint history](#view-notification-endpoint-history), including statues and notifications sent to the endpoint

## View notification endpoints

1. In the navigation menu on the left, select **Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **Notification Endpoints** near to top of the page.

## View notification endpoint details

1. In the navigation menu on the left, select **Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **Notification Endpoints** near to top of the page.
3. Click the name of the notification endpoint you want to view.
4. View the notification endpoint destination, name, and information to connect to the endpoint.

## View notification endpoint history

1. In the navigation menu on the left, select **Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **Notification Endpoints** near to top of the page.
3. Hover over the notification endpoint, click the **{{< icon "view" >}}** icon, then **View History**.
   The Check Statuses History page displays:

    - Statuses generated for the selected notification endpoint
    - Notifications sent to the selected notification endpoint
