---
title: Update notification endpoints
description: >
  Update notification endpoints in the InfluxDB UI.
menu:
  influxdb_cloud:
    name: Update endpoints
    parent: Manage notification endpoints
weight: 203
related:
  - /influxdb/cloud/monitor-alert/checks/
  - /influxdb/cloud/monitor-alert/notification-rules/
---

To update the notification endpoint details, complete the procedures below as needed. To update the notification endpoint selected for a notification rule, see [update notification rules](/influxdb/cloud/monitor-alert/notification-rules/update/).

## Add a label to notification endpoint

1. In the navigation menu on the left, select **Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **Notification Endpoints** near to top of the page.
3. Click **{{< icon "add-label" "v2" >}} Add a label** next to the endpoint you want to add a label to.
   The **Add Labels** box opens.
4. To add an existing label, select the label from the list.
5. To create and add a new label:

  - In the search field, enter the name of the new label. The **Create Label** box opens.
  - In the **Description** field, enter an optional description for the label.
  - Select a color for the label.
  - Click **Create Label**.

6. To remove a label, hover over the label under an endpoint and click X.


## Disable notification endpoint

1. In the navigation menu on the left, select **Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **Notification Endpoints** near to top of the page.
3. Click the {{< icon "toggle" "v2" >}} toggle to disable the notification endpoint.

## Update the name or description for notification endpoint

1. In the navigation menu on the left, select **Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **Notification Endpoints** near to top of the page.
3. Hover over the name or description of the endpoint and click the pencil icon
   (**{{< icon "edit" "v2" >}}**) to edit the field.
4. Click outside of the field to save your changes.

## Change endpoint details

1. In the navigation menu on the left, select **Alerts**.

    {{< nav-icon "alerts" >}}

2. Select **Notification Endpoints** near to top of the page.
3. Click the endpoint to update.
4. Update details as needed, and then click **Edit Notification Endpoint**.
   For details about each field, see [Create notification endpoints](/influxdb/cloud/monitor-alert/notification-endpoints/create/).
