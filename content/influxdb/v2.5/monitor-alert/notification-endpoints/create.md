---
title: Create notification endpoints
description: >
   Create notification endpoints to send alerts on your time series data.
menu:
  influxdb_2_5:
    name: Create endpoints
    parent: Manage notification endpoints
weight: 201
related:
  - /influxdb/v2.5/monitor-alert/checks/
  - /influxdb/v2.5/monitor-alert/notification-rules/
---

To send notifications about changes in your data, start by creating a notification endpoint to a third-party service. After creating notification endpoints, [create notification rules](/influxdb/v2.5/monitor-alert/notification-rules/create) to send alerts to third-party services on [check statuses](/influxdb/v2.5/monitor-alert/checks/create).

{{% cloud-only %}}

#### Endpoints available in InfluxDB Cloud
The following endpoints are available for the InfluxDB Cloud Free Plan and Usage-based Plan:

| Endpoint      | Free Plan                | Usage-based Plan             |
|:--------      |:-------------------:     |:----------------------------:|
| **Slack**     | **{{< icon "check" >}}** | **{{< icon "check" >}}**     |
| **PagerDuty** |                          | **{{< icon "check" >}}**     |
| **HTTP**      |                          | **{{< icon "check" >}}**     |

{{% /cloud-only %}}

## Create a notification endpoint

1.  In the navigation menu on the left, select **Alerts > Alerts**.

    {{< nav-icon "alerts" >}}

2.  Select **{{< caps >}}Notification Endpoints{{< /caps >}}**.
3.  Click **{{< caps >}}{{< icon "plus" >}} Create{{< /caps >}}**.
4.  From the **Destination** drop-down list, select a destination endpoint to send notifications to.
    {{% cloud-only %}}_See [available endpoints](#endpoints-available-in-influxdb-cloud)._{{% /cloud-only %}}
5.  In the **Name** and **Description** fields, enter a name and description for the endpoint.
6.  Enter information to connect to the endpoint:

    - **For HTTP**, enter the **URL** to send the notification.
      Select the **auth method** to use: **None** for no authentication.
      To authenticate with a username and password, select **Basic** and then
      enter credentials in the **Username** and **Password** fields.
      To authenticate with an API token, select **Bearer**, and then enter the
      API token in the **Token** field.

    - **For Slack**, create an [Incoming WebHook](https://api.slack.com/incoming-webhooks#posting_with_webhooks)
      in Slack, and then enter your webHook URL in the **Slack Incoming WebHook URL** field.

    - **For PagerDuty**:
      - [Create a new service](https://support.pagerduty.com/docs/services-and-integrations#section-create-a-new-service),
        [add an integration for your service](https://support.pagerduty.com/docs/services-and-integrations#section-add-integrations-to-an-existing-service),
        and then enter the PagerDuty integration key for your new service in the **Routing Key** field.
      - The **Client URL** provides a useful link in your PagerDuty notification.
        Enter any URL that you'd like to use to investigate issues.
        This URL is sent as the `client_url` property in the PagerDuty trigger event.
        By default, the **Client URL** is set to your Monitoring & Alerting History
        page, and the following included in the PagerDuty trigger event:

          ```json
          "client_url": "http://localhost:8086/orgs/<your-org-ID>/alert-history"
          ```

6. Click **{{< caps >}}Create Notification Endpoint{{< /caps >}}**.
