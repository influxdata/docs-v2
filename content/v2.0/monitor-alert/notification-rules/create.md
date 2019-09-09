---
title: Create notification rules
description: >
  Create notification rules to send alerts on your time series data.
weight: 20
menu:
  v2_0:
    parent: Manage notification rules
related:
  - /v2.0/monitor-alert/checks/
  - /v2.0/monitor-alert/notification-endpoints/
cloud_all: true
---

Once you've set up checks and notification endpoints, create notification rules to alert you.
_For details, see [Manage checks](/v2.0/monitor-alert/checks/) and
[Manage notification endpoints](/v2.0/monitor-alert/notification-endpoints/)._

## Create a new notification rule in the UI

1. Select the **Monitoring and Alerting** icon from the sidebar.

    {{< nav-icon "alerts" >}}

2. Under **Notification Rules**, click **+Create**.
3. Complete the **About** section:
  1. In the **Name** field, enter a name for the notification rule.
  2. In the **Schedule Every** field, enter how frequently the rule should run.
  3. In the **Offset** field, enter an offset time. For example,if a task runs on the hour, a 10m offset delays the task to 10 minutes after the hour. Time ranges defined in the task are relative to the specified execution time.
4. In the **Conditions** section, build a condition using a combination of status and tag keys.
  1. Next to **When status**, select a an operator from the drop-down field:
  - **is equal to** and then select the status
  - **changes from** and then select both statuses
  2. Next to **AND When**, enter one or more tag key-value pairs to filter by.
5. In the **Message** section, select an endpoint to notify.
6. Click **Create Notification Rule**.

## Clone an existing notification rule in the UI

1. Select the **Monitoring and Alerting** icon from the sidebar.


    {{< nav-icon "alerts" >}}


2. Under **Notification Rules**, hover over the rule you want to clone.
3. Click the clone icon and select **Clone**. The cloned rule appears.
