---
title: Update notification rules
description: >
  Update notification rules to update the notification message or change the schedule or conditions.
weight: 203
menu:
  influxdb_2_1:
    parent: Manage notification rules
related:
  - /influxdb/v2.1/monitor-alert/checks/
  - /influxdb/v2.1/monitor-alert/notification-endpoints/
---

Update notification rules to update the notification message or change the schedule or conditions.

To manage notifications rules:

1. In the navigation menu on the left, select **Alerts > Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **{{< caps >}}Notification Rules{{< /caps >}}** near to top of the page.

- [Update the name or description for notification rules](#update-the-name-or-description-for-notification-rules)
- [Enable or disable notification rules](#enable-or-disable-notification-rules)
- [Add a label to notification rules](#add-a-label-to-notification-rules)

## Update the name or description for notification rules
On the notification rules page:

1. Hover over the name or description of a rule and click the pencil icon
   (**{{< icon "edit" >}}**) to edit the field.
2. Click outside of the field to save your changes.

## Enable or disable notification rules
On the notification rules page, click the {{< icon "toggle" >}} toggle to
enable or disable the notification rule.

## Add a label to notification rules
On the notification rules page:

1. Click **{{< icon "add-label" >}} Add a label**
   next to the rule you want to add a label to.
   The **Add Labels** box opens.
2. To add an existing label, select the label from the list.
3. To create and add a new label:
  - In the search field, enter the name of the new label. The **Create Label** box opens.
  - In the **Description** field, enter an optional description for the label.
  - Select a color for the label.
  - Click **{{< caps >}}Create Label{{< /caps >}}**.
4. To remove a label, click **{{< icon "x" >}}** on the label.
