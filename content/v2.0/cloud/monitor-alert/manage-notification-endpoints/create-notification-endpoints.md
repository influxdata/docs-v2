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

1.  Select the **Monitoring and Alerting** icon from the sidebar.

    {{< nav-icon "alerts" >}}

2. Next to **Notification Endpoints**, click **Create**.
3. From the **Destination** drop-down list, select a destination endpoint to send notifications:
   - (Free plan) Slack
   - (Pay as You Go plan) HTTP, Slack, or PagerDuty
4. In the **Name** and **Description** fields, enter a name and description for the endpoint.
5. Enter enter information to connect to the endpoint:

   - For HTTP, enter the **URL** to send the notification. Select the **auth method** to use: **None** for no authentication. To authenticate with a username and password, select **Basic** and then enter credentials in the **Username** and **Password** fields. To authenticate with a token, select **Bearer**, and then enter the authentication token in the **Token** field.
        
    - For Slack, create an [Incoming WebHook](https://api.slack.com/incoming-webhooks#posting_with_webhooks) in Slack, and then enter your webHook URL in the **Slack Incoming WebHook URL** field.
        
    - For PagerDuty, [create a new service](https://support.pagerduty.com/docs/services-and-integrations#section-create-a-new-service), [add an integration for your service](https://support.pagerduty.com/docs/services-and-integrations#section-add-integrations-to-an-existing-service), and then enter the PagerDuty integration key for your new service in the **Routing Key** field.

6. Click **Create Notification Endpoint**.
