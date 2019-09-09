---
title: Update notification endpoints
description: >
  Update notification endpoints in the InfluxDB UI.
menu:
  v2_0:
    name: Update endpoints
    parent: Manage notification endpoints
weight: 204
related:
  - /v2.0/monitor-alert/checks/
  - /v2.0/monitor-alert/notification-rules/
cloud_all: true
---

To update the notification endpoint details, complete the following procedures as needed.

> **Note:** To update the notification endpoint selected for a notification rule, see [update notification rules](/v2.0/cloud/monitor-alert/update-notification-rules/).

## Add a label to notification endpoint

1. Select the **Monitoring and Alerting** icon from the sidebar.

    {{< nav-icon "alerts" >}}

2. Under **Notification Endpoints**, click **Add a label** next to the endpoint you want to add a label to. The **Add Labels** box opens.
3. To add an existing label, select the label from the list.
4. To create and add a new label:

  - In the search field, enter the name of the new label. The **Create Label** box opens.
  - In the **Description** field, enter an optional description for the label.
  - Select a color for the label.
  - Click **Create Label**.

5. To remove a label, hover over the label under an endpoint and click X.


## Disable notification endpoint

1. Select the **Monitoring and Alerting** icon from the sidebar.


    {{< nav-icon "alerts" >}}


2. Under **Notification Endpoints**, find the endpoint you want to disable.
3. Click the blue toggle to disable the notification endpoint.

## Update the name or description for notification endpoint

1. Select the **Monitoring and Alerting** icon from the sidebar.


    {{< nav-icon "alerts" >}}


2. Under **Notification Endpoints**, hover over the name or description of the endpoint.
3. Click the pencil icon to edit the field.
4. Click outside of the field to save your changes.

## Change endpoint details

1. Select the **Monitoring and Alerting** icon from the sidebar.

    {{< nav-icon "alerts" >}}

2. Under **Notification Endpoints**, click the endpoint to update.
3. Update details as needed, and then click **Edit a Notification Endpoint**. For details about each field, see [create a notification endpoint](v2.0/cloud/monitor-alert/manage-checks/create-notification-endpoints).
