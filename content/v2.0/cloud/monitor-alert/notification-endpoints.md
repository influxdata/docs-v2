---
title: Create notification endpoints
description: >
  Create notification endpoints to receive alerts on your time series data.

weight: 101
v2.0/tags: [monitor, checks]
menu:
  v2_0:
    name: Create notification endpoints
    parent: Monitor and alert
related:
  - /v2.0/monitor-alert/create-notification-rules/
  - /v2.0/monitor-alert/create-notification-endpoints/
---

To receive notifications about changes in your data, start by setting up a notification endpoint. After setting up your notification endpoints, create notification rules <insertlink> and checks <insertlink>.

## Create a notification endpoint in the UI

1. On the **Monitoring and Alerting** page, next to **Notification Endpoints**, click **Create**.
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

##### Example creating a Slack notification endpoint in line protocol

```js
// To create the endpoint, run the following command with your secret key and Slack authorization token.

vault kv put secret/111ab11111111111 SLACK_TOKEN=AABBCCDEEEeee

Key              Value
---              -----
created_time     2019-08-28T18:39:06.766942315Z
deletion_time    n/a
destroyed        false
version          2

// To test your Slack notification endpoint, run the following command.

curl http://localhost:9999/api/v2/query\?org\=my-org -XPOST -sS -H 'Authorization: Token my-token' -H 'accept:application/csv' -H 'content-type:application/vnd.flux' -d 'import "influxdata/influxdb/secrets" import "generate" x  = secrets.get(key:"SLACK_TOKEN") from(bucket: "my-bucket") |> range(start: -5h) |> set(key:"secret", value: x) '

,result,table,_start,_stop,_time,_value,_field,_measurement,k,secret
,_result,0,2019-08-28T13:39:09.820375497Z,2019-08-28T18:39:09.820375497Z,2019-08-28T17:07:03Z,18739,v,m,v,AABBCCDEEEeee
```

##### Example creating a PagerDuty notification endpoint in line protocol

```js
// To create the endpoint, run the following command with your authorization routing key.

Enter example here...detail from v1 docs:
Routing Key: GUID of your PagerDuty Events API V2 integration, listed as “Integration Key”.
See Create a new service in the PagerDuty documentation details on getting an “Integration Key” (routing_key).
PagerDuty URL: URL used to POST a JSON body representing the event. This value should not be changed. Valid value is https://events.pagerduty.com/v2/enqueue.
metrics available for integration; api keys and application keys currently in use by organization

// To test your PagerDuty notification endpoint, run the following command.

See the PagerDuty Events API V2 Overview for details on the PagerDuty Events API and recognized event types (trigger, acknowledge, and resolve).

```js
from(bucket: alertBucket) |> [conditions here] |> toPagerDuty()
```