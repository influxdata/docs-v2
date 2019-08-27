---
title: monitor.notify() function
description: >
  The `monitor.notify()` function sends a notification to an endpoint and logs it
  in the `notifications` measurement in the `_monitoring` bucket.
menu:
  v2_0_ref:
    name: monitor.notify
    parent: Monitor
weight: 202
---

The `monitor.notify()` function sends a notification to an endpoint and logs it
in the `notifications` measurement in the `_monitoring` bucket.

_**Function type:** Type conversion_

```js
import "influxdata/influxdb/monitor"

monitor.notify(
  endpoint: ,
  data: {}
)
```

## Parameters

### endpoint
A function that constructs and sends the notification to an endpoint.

_**Data type:** Function_

### data
The data object to send to the endpoint.
Defaults to `{}`.

_**Data type:** Object_

## Examples

### Send a notification to Slack
```js
import "influxdata/influxdb/monitor"
import "slack"

endpoint = slack.endpoint(name: "slack", channel: "#flux")

from(bucket: "system")
	|> range(start: -5m)
	|> monitor.notify(endpoint: endpoint)
```
