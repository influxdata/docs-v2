---
title: monitor.notify() function
description: >
  The `monitor.notify()` function sends a notification to an endpoint and logs it
  in the `notifications` measurement in the `_monitoring` bucket.
aliases:
  - /influxdb/cloud/reference/flux/functions/monitor/notify/
menu:
  influxdb_cloud_ref:
    name: monitor.notify
    parent: InfluxDB Monitor
weight: 202
---

The `monitor.notify()` function sends a notification to an endpoint and logs it
in the `notifications` measurement in the `_monitoring` bucket.

_**Function type:** Output_

```js
import "influxdata/influxdb/monitor"

monitor.notify(
  endpoint: endpoint,
  data: {}
)
```

## Parameters

### endpoint
A function that constructs and sends the notification to an endpoint.

_**Data type:** Function_

### data
Data to append to the output.
**InfluxDB populates notification data.**

_**Data type:** Record_

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
