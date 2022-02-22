---
title: pagerduty.sendEvent() function
description: >
  The `pagerduty.sendEvent()` function sends an event to PagerDuty.
aliases:
  - /influxdb/v2.0/reference/flux/functions/pagerduty/sendevent/
  - /influxdb/v2.0/reference/flux/stdlib/pagerduty/sendevent/
  - /influxdb/cloud/reference/flux/stdlib/pagerduty/sendevent/
menu:
  flux_0_x_ref:
    name: pagerduty.sendEvent
    parent: pagerduty
weight: 202
introduced: 0.43.0
---

The `pagerduty.sendEvent()` function sends an event to PagerDuty.

```js
import "pagerduty"

pagerduty.sendEvent(
  pagerdutyURL: "https://events.pagerduty.com/v2/enqueue",
  routingKey: "ExampleRoutingKey",
  client: "ExampleClient",
  clientURL: "http://examplepagerdutyclient.com",
  dedupKey: "ExampleDedupKey",
  class: "cpu usage",
  group: "app-stack",
  severity: "ok",
  eventAction: "trigger",
  source: "monitoringtool:vendor:region",
  component: "example-component",
  summary: "This is an example summary.",
  timestamp: "2016-07-17T08:42:58.315+0000",
  customDetails: {exampleDetail: "Details"}
)
```

## Parameters

### pagerdutyURL {data-type="string"}
The URL of the PagerDuty endpoint.
Defaults to `https://events.pagerduty.com/v2/enqueue`.

### routingKey {data-type="string"}
The routing key generated from your PagerDuty integration.

### client {data-type="string"}
The name of the client sending the alert.

### clientURL {data-type="string"}
The URL of the client sending the alert.

### dedupKey {data-type="string"}
A per-alert ID that acts as deduplication key and allows you to acknowledge or
change the severity of previous messages.
Supports a maximum of 255 characters.

{{% note %}}
When using [`pagerduty.endpoint()`](/flux/v0.x/stdlib/pagerduty/endpoint/)
to send data to PagerDuty, the function uses the [`pagerduty.dedupKey()` function](/flux/v0.x/stdlib/pagerduty/dedupkey/) to populate the `dedupKey` parameter.
{{% /note %}}

### class {data-type="string"}
The class or type of the event.
Classes are user-defined.
For example, `ping failure` or `cpu load`.

### group {data-type="string"}
A logical grouping used by PagerDuty.
Groups are user-defined.
For example, `app-stack`.

### severity {data-type="string"}
The severity of the event.

**Valid values include:**

- `critical`
- `error`
- `warning`
- `info`

### eventAction {data-type="string"}
[Event type](https://developer.pagerduty.com/docs/events-api-v1/overview/#event-types) to send to PagerDuty.

**Valid values include:**

- `trigger`
- `resolve`
- `acknowledge`

### source {data-type="string"}
The unique location of the affected system.
For example, the hostname or fully qualified domain name (FQDN).

### component {data-type="string"}
Component responsible for the event.

### summary {data-type="string"}
A brief text summary of the event used as the summaries or titles of associated alerts.
The maximum permitted length is 1024 characters.

### timestamp {data-type="string"}
The time the detected event occurred in [RFC3339nano format](https://golang.org/pkg/time/#RFC3339Nano).

### customDetails {data-type="record"}
Additional event details.

## Examples

## Send the last reported status to PagerDuty
```js
import "pagerduty"
import "influxdata/influxdb/secrets"

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "statuses")
    |> last()
    |> findRecord(fn: (key) => true, idx: 0)

pagerduty.sendEvent(
  routingKey: "example-routing-key",
  client: lastReported.client,
  clientURL: lastReported.clientURL,
  class: lastReported.class,
  eventAction: lastReported.eventAction,
  group: lastReported.group,
  severity: lastReported.severity,
  component: lastReported.component,
  source: lastReported.source,
  component: lastReported.component,
  summary: lastReported.summary,
  timestamp: lastReported._time,
  customDetails: {
    "ping time": lastReported.ping,
    load: lastReported.load
  }
)
```