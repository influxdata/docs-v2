---
title: Update notification endpoints
description: >
  Update notification endpoints in the InfluxDB UI.
menu:
  influxdb_2_1:
    name: Update endpoints
    parent: Manage notification endpoints
weight: 203
related:
  - /influxdb/v2.1/monitor-alert/checks/
  - /influxdb/v2.1/monitor-alert/notification-rules/
---

Complete the following steps to update notification endpoint details.
To update the notification endpoint selected for a notification rule, see [update notification rules](/influxdb/v2.1/monitor-alert/notification-rules/update/).

**To update a notification endpoint**

1. In the navigation menu on the left, select **Alerts > Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **{{< caps >}}Notification Endpoints{{< /caps >}}** near to top of the page, and then do the following as needed:

    - [Update the name or description for notification endpoint](#update-the-name-or-description-for-notification-endpoint)
    - [Change endpoint details](#change-endpoint-details)
    - [Disable notification endpoint](#disable-notification-endpoint)
    - [Add a label to notification endpoint](#add-a-label-to-notification-endpoint)

## Update the name or description for notification endpoint
1. Hover over the name or description of the endpoint and click the pencil icon
   (**{{< icon "edit" >}}**) to edit the field.
2. Click outside of the field to save your changes.

## Change endpoint details
1. Click the name of the endpoint to update.
2. Update details as needed, and then click **Edit Notification Endpoint**.
   For details about each field, see [Create notification endpoints](/influxdb/v2.1/monitor-alert/notification-endpoints/create/).

## Disable notification endpoint
Click the {{< icon "toggle" >}} toggle to disable the notification endpoint.

## Add a label to notification endpoint
1. Click **{{< icon "add-label" >}} Add a label** next to the endpoint you want to add a label to.
   The **Add Labels** box opens.
2. To add an existing label, select the label from the list.
3. To create and add a new label:

    - In the search field, enter the name of the new label. The **Create Label** box opens.
    - In the **Description** field, enter an optional description for the label.
    - Select a color for the label.
    - Click **{{< caps >}}Create Label{{< /caps >}}**.

4. To remove a label, click **{{< icon "x" >}}** on the label.
