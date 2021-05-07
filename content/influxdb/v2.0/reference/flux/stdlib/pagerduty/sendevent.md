---
title: pagerduty.sendEvent() function
description: >
  The `pagerduty.sendEvent()` function sends an event to PagerDuty.
aliases:
  - /influxdb/v2.0/reference/flux/functions/pagerduty/sendevent/
menu:
  influxdb_2_0_ref:
    name: pagerduty.sendEvent
    parent: PagerDuty
weight: 202
---

The `pagerduty.sendEvent()` function sends an event to PagerDuty.

_**Function type:** Output_

```js
import "pagerduty"

pagerduty.sendEvent(
  pagerdutyURL: "https://events.pagerduty.com/v2/enqueue",
  routingKey: "ExampleRoutingKey",
  client: "ExampleClient",
  clientURL: "http://examplepagerdutyclient.com",
  dedupkey: "ExampleDedupKey",
  class: "cpu usage",
  group: "app-stack",
  severity: "ok",
  eventAction: "trigger",
  source: "monitoringtool:vendor:region",
  summary: "This is an example summary.",
  timestamp: "2016-07-17T08:42:58.315+0000"
)
```

## Parameters

### pagerdutyURL
The URL of the PagerDuty endpoint.
Defaults to `https://events.pagerduty.com/v2/enqueue`.

_**Data type:** String_

### routingKey
The routing key generated from your PagerDuty integration.

_**Data type:** String_

### client
The name of the client sending the alert.

_**Data type:** String_

### clientURL
The URL of the client sending the alert.

_**Data type:** String_

### dedupkey
A per-alert ID that acts as deduplication key and allows you to acknowledge or
change the severity of previous messages.
Supports a maximum of 255 characters.

{{% note %}}
When using [`pagerduty.endpoint()`](/influxdb/v2.0/reference/flux/stdlib/pagerduty/endpoint/)
to send data to PagerDuty, the function uses the [`pagerduty.dedupKey()` function](/influxdb/v2.0/reference/flux/stdlib/pagerduty/dedupkey/) to populate the `dedupkey` parameter.
{{% /note %}}

_**Data type:** String_

### class
The class or type of the event.
Classes are user-defined.
For example, `ping failure` or `cpu load`.

_**Data type:** String_

### group
A logical grouping used by PagerDuty.
Groups are user-defined.
For example, `app-stack`.

_**Data type:** String_

### severity
The severity of the event.

**Valid values include:**

- `critical`
- `error`
- `warning`
- `info`

_**Data type:** String_

### eventAction
[Event type](https://developer.pagerduty.com/docs/events-api-v1/overview/#event-types) to send to PagerDuty.

**Valid values include:**

- `trigger`
- `resolve`
- `acknowledge`

_**Data type:** String_

### source
The unique location of the affected system.
For example, the hostname or fully qualified domain name (FQDN).

_**Data type:** String_

### summary
A brief text summary of the event used as the summaries or titles of associated alerts.
The maximum permitted length is 1024 characters.

_**Data type:** String_

### timestamp
The time the detected event occurred in [RFC3339nano format](https://golang.org/pkg/time/#RFC3339Nano).

_**Data type:** String_
