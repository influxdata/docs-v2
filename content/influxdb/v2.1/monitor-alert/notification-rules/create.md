---
title: Create notification rules
description: >
  Create notification rules to send alerts on your time series data.
weight: 201
menu:
  influxdb_2_1:
    parent: Manage notification rules
related:
  - /influxdb/v2.1/monitor-alert/checks/
  - /influxdb/v2.1/monitor-alert/notification-endpoints/
---

Once you've set up checks and notification endpoints, create notification rules to alert you.
_For details, see [Manage checks](/influxdb/v2.1/monitor-alert/checks/) and
[Manage notification endpoints](/influxdb/v2.1/monitor-alert/notification-endpoints/)._


1. In the navigation menu on the left, select **Alerts > Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **{{< caps >}}Notification Rules{{< /caps >}}** near to top of the page.

    - [Create a new notification rule in the UI](#create-a-new-notification-rule-in-the-ui)
    - [Clone an existing notification rule in the UI](#clone-an-existing-notification-rule-in-the-ui)

## Create a new notification rule

1. On the notification rules page, click **{{< caps >}}{{< icon "plus" >}} Create{{< /caps >}}**.
2. Complete the **About** section:
  1. In the **Name** field, enter a name for the notification rule.
  2. In the **Schedule Every** field, enter how frequently the rule should run.
  3. In the **Offset** field, enter an offset time. For example,if a task runs on the hour, a 10m offset delays the task to 10 minutes after the hour. Time ranges defined in the task are relative to the specified execution time.
3. In the **Conditions** section, build a condition using a combination of status and tag keys.
    - Next to **When status is equal to**, select a status from the drop-down field.
    - Next to **AND When**, enter one or more tag key-value pairs to filter by.
4. In the **Message** section, select an endpoint to notify.
5. Click **{{< caps >}}Create Notification Rule{{< /caps >}}**.

## Clone an existing notification rule

On the notification rules page, click the **{{< icon "gear" >}}** icon and select **Clone**.
The cloned rule appears.
