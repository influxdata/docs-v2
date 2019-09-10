---
title: Create notification endpoints
description: >
   Create notification endpoints to send alerts on your time series data.
menu:
  v2_0:
    name: Create endpoints
    parent: Manage notification endpoints
weight: 201
related:
  - /v2.0/monitor-alert/checks/
  - /v2.0/monitor-alert/notification-rules/
cloud_all: true
---

To send notifications about changes in your data, start by creating a notification endpoint to a third party service. After creating notification endpoints, [create notification rules](/v2.0/monitor-alert/notification-rules/create) to send alerts to third party services on [check statuses](/v2.0/monitor-alert/checks/create).

## Create a notification endpoint in the UI

1.  Select the **Monitoring and Alerting** icon from the sidebar.

    {{< nav-icon "alerts" >}}

2.  Next to **Notification Endpoints**, click **Create**.
3.  From the **Destination** drop-down list, select a destination endpoint to send notifications.
    The following endpoints are available for InfluxDB 2.0 OSS, the InfluxDB Cloud 2.0 Free Plan,
    and the InfluxDB Cloud 2.0 Pay As You Go (PAYG) Plan:

    | Endpoint      | OSS      | Free Plan _(Cloud)_      | PAYG Plan _(Cloud)_          |
    |:--------      |:--------:|:-------------------:     |:----------------------------:|
    | **Slack**     | _Coming_ | **{{< icon "check" >}}** | **{{< icon "check" >}}**     |
    | **PagerDuty** | _Coming_ |                          | **{{< icon "check" >}}**     |
    | **HTTP**      | _Coming_ |                          | **{{< icon "check" >}}**     |

4.  In the **Name** and **Description** fields, enter a name and description for the endpoint.
5.  Enter enter information to connect to the endpoint:

    - For HTTP, enter the **URL** to send the notification. Select the **auth method** to use: **None** for no authentication. To authenticate with a username and password, select **Basic** and then enter credentials in the **Username** and **Password** fields. To authenticate with a token, select **Bearer**, and then enter the authentication token in the **Token** field.

    - For Slack, create an [Incoming WebHook](https://api.slack.com/incoming-webhooks#posting_with_webhooks) in Slack, and then enter your webHook URL in the **Slack Incoming WebHook URL** field.

    - For PagerDuty, [create a new service](https://support.pagerduty.com/docs/services-and-integrations#section-create-a-new-service), [add an integration for your service](https://support.pagerduty.com/docs/services-and-integrations#section-add-integrations-to-an-existing-service), and then enter the PagerDuty integration key for your new service in the **Routing Key** field. By default, the PagerDuty client URL is https://events.pagerduty.com/v2/enqueue. For details, see [PagerDuty documentation](https://v2.developer.pagerduty.com/docs/send-an-event-events-api-v2).

6. Click **Create Notification Endpoint**.
