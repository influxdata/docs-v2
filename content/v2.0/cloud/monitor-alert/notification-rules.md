---
title: Create notification rules
description: >
  Create notification rules to receive alerts on your time series data.

weight: 101
v2.0/tags: [monitor, notification rules]
menu:
  v2_0:
    name: Create notification rules
    parent: Monitor and alert
related:
  - /v2.0/monitor-alert/create-notification-endpoints/
---

To receive notifications about changes in your data, start by setting up a notification endpoint. After setting up your notification endpoints, create notification rules <insertlink> and checks <insertlink>.

## Create a notification rule in the UI

1. On the **Monitoring and Alerting** page, next to **Notification Rules**, click **Create**.
2. In the **Name** and **Description** fields, enter a name and description for the endpoint (description used on History page? anywhere else?).
3. From the **Destination** drop-down list, select a destination to send notifications:
   - (Free plan) HTTP server
   - (Pay as You Go plan) HTTP server, Slack, or PagerDuty
4. Enter the **URL** to notify, and then enter connection information:

   - For HTTP:

        a. Select the **HTTP method** to use. In most cases, select **POST**. {find use cases when to use PUT & GET}

        b. Select the **auth method** to use: **None** for no authentication. To authenticate with a username and password, select **Basic** and then enter credentials in the **Username** and **Password** fields. To authenticate with a token, select **Bearer**, and then enter the authentication token in the **Token** field.

        c. In the **Content Template** field, enter {examples for each endpoint template}.

    - For Slack, enter your Slack authentication token in the **Token** field.
    - For PagerDuty, enter your PagerDuty routing key in the **Routing Key** field.

5. Click **Create Notification Endpoint**.
