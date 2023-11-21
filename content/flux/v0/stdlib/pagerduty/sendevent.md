---
title: pagerduty.sendEvent() function
description: >
  `pagerduty.sendEvent()` sends an event to PagerDuty and returns the HTTP response code of the request.
menu:
  flux_v0_ref:
    name: pagerduty.sendEvent
    parent: pagerduty
    identifier: pagerduty/sendEvent
weight: 101
flux/v0/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pagerduty/pagerduty.flux#L248-L279

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pagerduty.sendEvent()` sends an event to PagerDuty and returns the HTTP response code of the request.



##### Function type signature

```js
(
    class: A,
    client: B,
    clientURL: C,
    dedupKey: D,
    eventAction: E,
    group: F,
    routingKey: G,
    severity: H,
    source: I,
    summary: string,
    timestamp: J,
    ?component: K,
    ?customDetails: L,
    ?pagerdutyURL: string,
) => int where L: Equatable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### pagerdutyURL

PagerDuty endpoint URL.

Default is https://events.pagerduty.com/v2/enqueue.

### routingKey
({{< req >}})
Routing key generated from your PagerDuty integration.



### client
({{< req >}})
Name of the client sending the alert.



### clientURL
({{< req >}})
URL of the client sending the alert.



### dedupKey
({{< req >}})
Per-alert ID that acts as deduplication key and allows you to
acknowledge or change the severity of previous messages.
Supports a maximum of 255 characters.



### class
({{< req >}})
Class or type of the event.

Classes are user-defined.
For example, `ping failure` or `cpu load`.

### group
({{< req >}})
Logical grouping used by PagerDuty.

Groups are user-defined.
For example, `app-stack`.

### severity
({{< req >}})
Severity of the event.

Valid values:
- `critical`
- `error`
- `warning`
- `info`

### eventAction
({{< req >}})
Event type to send to PagerDuty.

Valid values:
- `trigger`
- `resolve`
- `acknowledge`

### source
({{< req >}})
Unique location of the affected system.
For example, the hostname or fully qualified domain name (FQDN).



### component

Component responsible for the event.



### summary
({{< req >}})
Brief text summary of the event used as the summaries or titles of associated alerts.
The maximum permitted length is 1024 characters.



### timestamp
({{< req >}})
Time the detected event occurred in RFC3339nano format.



### customDetails

Record with additional details about the event.




## Examples

### Send an event to PagerDuty

```js
import "pagerduty"
import "pagerduty"

pagerduty.sendEvent(
    routingKey: "example-routing-key",
    client: "example-client",
    clientURL: "http://example-url.com",
    dedupKey: "example-dedup-key",
    class: "example-class",
    eventAction: "trigger",
    group: "example-group",
    severity: "crit",
    component: "example-component",
    source: "example-source",
    summary: "example-summary",
    timestamp: now(),
    customDetails: {"example-key": "example value"},
)

```

