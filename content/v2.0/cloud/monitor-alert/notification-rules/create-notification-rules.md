---
title: Create notification rules
description: >
  Create notification rules to receive alerts on your time series data.

weight: 201
v2.0/tags: [monitor, notification rules]
menu:
  v2_0:
    name: Create notification rules
    parent: Manage notification rules
---

Once you've set up checks and notification endpoints, create notification rules to alert you. For details, see <link to checks doc> and <link to endpoints doc>.

## Create a new notification rule in the UI

1. Select the **Monitoring and Alerting** icon from the sidebar.


    {{< nav-icon "alerts" >}}


2. Under **Notification Rules**, click **+Create**.
3. Complete the **About** section:
  1. In the **Name** field, enter a name for the notification rule.
  2. In the **Schedule Every** field, enter .
  3. In the **Offset** field, enter .
4. In the **Conditions** section, build a condition using a combination of status and tag keys.
  1. Next to **When status**, select a an operator from the drop-down field. (either **is equal to** or **changes from**.)
  Select status from the drop-down list (one for is equal to or two for changes from).
  2. Next to **AND When**, enter one or more tag key-value pairs to filter by.
5. In the **Message** section, select an endpoint to notify.
6. Click **Create Notification Rule**.

## Clone an existing notification rule in the UI

1. Select the **Monitoring and Alerting** icon from the sidebar.


    {{< nav-icon "alert" >}}


2. Under **Notification Rules**, hover over the rule you want to clone.
3. Click the clone icon and select **Clone**. The cloned rule appears.
