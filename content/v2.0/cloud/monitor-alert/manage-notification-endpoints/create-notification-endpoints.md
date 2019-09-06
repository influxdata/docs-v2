---
title: Create notification endpoints
seotitle: Create notification endpoints
description: >
   Create notification endpoints to send alerts on your time series data.

v2.0/tags: [monitor, notifications, endpoints]
menu:
  v2_0:
    name: Create endpoints
    parent: Manage notification endpoints
weight: 201
related:
  - /v2.0/cloud/monitor-alert/manage-notification-rules/
  - /v2.0/cloud/monitor-alert/manage-notification-endpoints/
---

To send notifications about changes in your data, start by creating a notification endpoint to a third party service. After creating notification endpoints, [create notification rules](/v2.0/cloud/monitor-alert/manage-notification-rules/create-notification-rules) to send alerts to third party services on [check statuses](/v2.0/cloud/monitor-alert/manage-checks/create-checks).

## Create a notification endpoint in the UI

1. On the **Monitoring and Alerting** page, next to **Notification Endpoints**, click **Create**.
2. In the **Name** and **Description** fields, enter a name and description for the endpoint.
3. From the **Destination** drop-down list, select a destination endpoint to send notifications:
   - (Free plan) Slack
   - (Pay as You Go plan) HTTP, Slack, or PagerDuty
4. Enter the **URL** to notify, and then enter connection information:

   - For HTTP:
     
        a. Select the **HTTP method** to use. In most cases, select **POST**. {find use cases when to use PUT & GET}
        
        b. Select the **auth method** to use: **None** for no authentication. To authenticate with a username and password, select **Basic** and then enter credentials in the **Username** and **Password** fields. To authenticate with a token, select **Bearer**, and then enter the authentication token in the **Token** field.
        
        c. In the **Content Template** field, enter {examples for each endpoint template}.
        
    - For Slack, enter your Slack authentication token in the **Token** field.
    - For PagerDuty, enter your PagerDuty routing key in the **Routing Key** field.

5. Click **Create Notification Endpoint**.
