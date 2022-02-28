---
title: monitor.notify() function
description: >
  The `monitor.notify()` function sends a notification to an endpoint and logs it
  in the `notifications` measurement in the `_monitoring` bucket.
aliases:
  - /influxdb/v2.0/reference/flux/functions/monitor/notify/
  - /influxdb/v2.0/reference/flux/stdlib/monitor/notify/
  - /influxdb/cloud/reference/flux/stdlib/monitor/notify/
menu:
  flux_0_x_ref:
    name: monitor.notify
    parent: monitor
weight: 202
introduced: 0.39.0
---

The `monitor.notify()` function sends a notification to an endpoint and logs it
in the `notifications` measurement in the [`_monitoring` bucket](/influxdb/cloud/reference/internals/system-buckets/#monitoring-system-bucket).

```js
import "influxdata/influxdb/monitor"

monitor.notify(
    endpoint: endpoint,
    data: {},
)
```

## Parameters

### endpoint {data-type="function"}
({{< req >}}) A function that constructs and sends the notification to an endpoint.

### data {data-type="record"}
({{< req >}}) Notification data to append to the output.
This data specifies which notification rule and notification endpoint to associate
with the sent notification.

The data record must contain the following fields:

- _notification_rule_id
- _notification_rule_name
- _notification_endpoint_id
- _notification_endpoint_name

The InfluxDB monitoring and alerting system uses `monitor.notify()` to store
information about sent notifications and automatically assigns these values.
If writing a custom notification [task](/influxdb/cloud/process-data/),
we recommend using **unique arbitrary values** for data record fields.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

- [Send a notification to Slack](#send-a-notification-to-slack)
- [Send a notification to PagerDuty](#send-a-notification-to-pagerduty)

### Send a notification to Slack
```js
import "influxdata/influxdb/monitor"
import "influxdata/influxdb/secrets"
import "slack"

token = secrets.get(key: "SLACK_TOKEN")

endpoint = slack.endpoint(token: token)(mapFn: (r) => ({channel: "Alerts", text: r._message, color: "danger"}))

notification_data = {
    _notification_rule_id: "0000000000000001",
    _notification_rule_name: "example-rule-name",
    _notification_endpoint_id: "0000000000000002",
    _notification_endpoint_name: "example-endpoint-name"
}

from(bucket: "system")
    |> range(start: -5m)
    |> monitor.notify(endpoint: endpoint, data: notification_data)
```

### Send a notification to PagerDuty
```js
import "influxdata/influxdb/monitor"
import "influxdata/influxdb/secrets"
import "pagerduty"

routingKey = secrets.get(key: "PAGERDUTY_ROUTING_KEY")

endpoint = pagerduty.endpoint()(
    mapFn: (r) => ({
        routingKey: routingKey,
        client: "ExampleClient",
        clientURL: "http://examplepagerdutyclient.com",
        dedupkey: "ExampleDedupKey",
        class: "cpu usage",
        group: "app-stack",
        severity: "ok",
        eventAction: "trigger",
        source: "monitoringtool:vendor:region",
        timestamp: r._source_timestamp,
    }),
)

notification_data = {
    _notification_rule_id: "0000000000000001",
    _notification_rule_name: "example-rule-name",
    _notification_endpoint_id: "0000000000000002",
    _notification_endpoint_name: "example-endpoint-name"
}

from(bucket: "system")
    |> range(start: -5m)
    |> monitor.notify(endpoint: endpoint, data: notification_data)
```
