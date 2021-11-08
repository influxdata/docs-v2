---
title: Delete notification endpoints
description: >
   Delete a notification endpoint in the InfluxDB UI.
menu:
  influxdb_2_1:
    name: Delete endpoints
    parent: Manage notification endpoints
weight: 204
related:
  - /influxdb/v2.1/monitor-alert/checks/
  - /influxdb/v2.1/monitor-alert/notification-rules/
---

If notifications are no longer sent to an endpoint, complete the steps below to
delete the endpoint, and then [update notification rules](/influxdb/v2.1/monitor-alert/notification-rules/update)
with a new notification endpoint as needed.

## Delete a notification endpoint in the UI

1. In the navigation menu on the left, select **Alerts > Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **{{< caps >}}Notification Endpoints{{< /caps >}}** near to top of the page.
   find the rule you want to delete.
3. Click the **{{< icon "trash" >}}** icon on the notification you want to delete
    and then click **{{< caps >}}Confirm{{< /caps >}}**.
