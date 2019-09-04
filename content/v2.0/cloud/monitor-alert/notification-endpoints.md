---
title: Create notification endpoints
description: >
  Create notification endpoints to send alerts on your time series data.

weight: 101
v2.0/tags: [monitor, notifications, endpoints]
menu:
  v2_0:
    parent: Monitor and alert
related:
  - /v2.0/monitor-alert/create-notification-rules/
  - /v2.0/monitor-alert/create-notification-endpoints/
---

To send notifications about changes in your data, start by setting up a notification endpoint in the UI or with the InfluxDB After setting up your notification endpoints, create notification rules <insertlink> and checks <insertlink>.

## Create a notification endpoint in the UI

1. On the **Monitoring and Alerting** page, next to **Notification Endpoints**, click **Create**.
2. In the **Name** and **Description** fields, enter a name and description for the endpoint.
3. From the **Destination** drop-down list, select a destination endpoint to send notifications:
   - (Free plan) HTTP
   - (Pay as You Go plan) HTTP, Slack, or PagerDuty
4. Enter the **URL** to notify, and then enter connection information:

   - For HTTP:
     
        a. Select the **HTTP method** to use. In most cases, select **POST**. {find use cases when to use PUT & GET}
        
        b. Select the **auth method** to use: **None** for no authentication. To authenticate with a username and password, select **Basic** and then enter credentials in the **Username** and **Password** fields. To authenticate with a token, select **Bearer**, and then enter the authentication token in the **Token** field.
        
        c. In the **Content Template** field, enter {examples for each endpoint template}.
        
    - For Slack, enter your Slack authentication token in the **Token** field.
    - For PagerDuty, enter your PagerDuty routing key in the **Routing Key** field.

5. Click **Create Notification Endpoint**.

##### Example creating a Slack notification endpoint in line protocol

```js
// To create the endpoint, run the following command with your secret key and Slack authorization token.

TBD 

// To test your Slack notification endpoint, run the following command.

TBD

##### Example creating a PagerDuty notification endpoint in line protocol

```js
// To create the endpoint, run the following command with your authorization routing key.

TBD
To obtain a PagerDuty routing_key, see PagerDuty documentation. Once you obtain your routing key, (add example with integration metrics, api and application keys).
Example using POST to send JSON body representing an event to PagerDuty URL. Note, URL should not change (once notification rule is set?). example PagerDuty URL: https://events.pagerduty.com/v2/enqueue.


// To test your PagerDuty notification endpoint, run the following command.

TBD
```js
from(bucket: alertBucket) |> [conditions here] |> toPagerDuty()
```