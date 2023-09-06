---
title: monitor.notify() function
description: >
  `monitor.notify()` sends a notification to an endpoint and logs it in the `notifications`
  measurement in the `_monitoring` bucket.
menu:
  flux_v0_ref:
    name: monitor.notify
    parent: influxdata/influxdb/monitor
    identifier: influxdata/influxdb/monitor/notify
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/monitor/monitor.flux#L223-L236

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`monitor.notify()` sends a notification to an endpoint and logs it in the `notifications`
measurement in the `_monitoring` bucket.



##### Function type signature

```js
(
    <-tables: stream[E],
    data: A,
    endpoint: (<-: stream[{B with _time: C, _time: time, _status_timestamp: int, _measurement: string}]) => stream[D],
) => stream[D] where A: Record, D: Record, E: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### endpoint
({{< req >}})
A function that constructs and sends the notification to an endpoint.



### data
({{< req >}})
Notification data to append to the output.

This data specifies which notification rule and notification endpoint to
associate with the sent notification.
The data record must contain the following properties:
- \_notification\_rule\_id
- \_notification\_rule\_name
- \_notification\_endpoint\_id
- \_notification\_endpoint\_name
The InfluxDB monitoring and alerting system uses `monitor.notify()` to store
information about sent notifications and automatically assigns these values.
If writing a custom notification task, we recommend using **unique arbitrary**
values for data record properties.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Send critical status notifications to Slack

```js
import "influxdata/influxdb/monitor"
import "influxdata/influxdb/secrets"
import "slack"

token = secrets.get(key: "SLACK_TOKEN")

endpoint =
    slack.endpoint(token: token)(
        mapFn: (r) => ({channel: "Alerts", text: r._message, color: "danger"}),
    )

notification_data = {
    _notification_rule_id: "0000000000000001",
    _notification_rule_name: "example-rule-name",
    _notification_endpoint_id: "0000000000000002",
    _notification_endpoint_name: "example-endpoint-name",
}

monitor.from(range: -5m, fn: (r) => r._level == "crit")
    |> range(start: -5m)
    |> monitor.notify(endpoint: endpoint, data: notification_data)

```

