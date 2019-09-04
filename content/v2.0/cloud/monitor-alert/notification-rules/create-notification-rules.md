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

Once you've set up checks and notification endpoints, create notification rules to alert you. For details, see <link> and <link>.

## Create a new notification rule in the UI

1. Select the **Monitoring and Alerting** icon from the sidebar.


    {{< nav-icon "alert" >}}


2. Under **Notification Rules**, click **+Create**.
2. Complete the **About** section:
  a. In the **Name** field, enter a name for the notification rule.
  b. In the **Schedule Every** field, enter .
  c. In the **Offset** field, enter .
3. In the **Conditions** section, build a condition using a combination of status and tag keys.
  a. Next to **When status**, select a an operator from the drop-down field. (either **is equal to** or **changes from**.)
  Select status from the drop-down list (one for is equal to or two for changes from).
  b. Next to **AND When**, enter one or more tag key-value pairs to filter by.
4. In the **Message** section, select an endpoint to notify.
5. Click **Create Notification Rule**.

## Clone an existing notification rule in the UI

1. Select the **Monitoring and Alerting** icon from the sidebar.


    {{< nav-icon "alert" >}}


2. Under **Notification Rules**, hover over the rule you want to clone.
3. Click the clone icon and select **Clone**. The cloned rule appears.
