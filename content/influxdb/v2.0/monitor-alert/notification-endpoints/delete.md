---
title: Delete notification endpoints
description: >
   Delete a notification endpoint in the InfluxDB UI.
menu:
  influxdb_2_0:
    name: Delete endpoints
    parent: Manage notification endpoints
weight: 204
related:
  - /influxdb/v2.0/monitor-alert/checks/
  - /influxdb/v2.0/monitor-alert/notification-rules/
---

If notifications are no longer sent to an endpoint, complete the steps below to delete the endpoint, and then [update notification rules](/influxdb/v2.0/monitor-alert/notification-rules/update) with a new notification endpoint as needed.

## Delete a notification endpoint in the UI

1. In the navigation menu on the left, select **Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **Notification Endpoints** near to top of the page.
   find the rule you want to delete.
3. Hover over the endpoint you want to delete and click the **{{< icon "trash" >}}** icon.
4. Click **Delete** to confirm.
