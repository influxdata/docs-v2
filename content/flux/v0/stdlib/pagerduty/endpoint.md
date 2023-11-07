---
title: pagerduty.endpoint() function
description: >
  `pagerduty.endpoint()` returns a function that sends a message to PagerDuty that includes output data.
menu:
  flux_v0_ref:
    name: pagerduty.endpoint
    parent: pagerduty
    identifier: pagerduty/endpoint
weight: 101
flux/v0/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pagerduty/pagerduty.flux#L348-L381

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pagerduty.endpoint()` returns a function that sends a message to PagerDuty that includes output data.

### Usage
`pagerduty.endpoint()` is a factory function that outputs another function.
 The output function requires a `mapFn` parameter.

#### mapFn
Function that builds the record used to generate the POST request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns a record that must include the
following properties:

- routingKey
- client
- client_url
- class
- eventAction
- group
- severity
- source
- component
- summary
- timestamp
- customDetails

##### Function type signature

```js
(
    ?url: string,
) => (
    mapFn: (
        r: {A with _pagerdutyDedupKey: string},
    ) => {
        B with
        timestamp: K,
        summary: string,
        source: J,
        severity: I,
        routingKey: H,
        group: G,
        eventAction: F,
        clientURL: E,
        client: D,
        class: C,
    },
) => (<-tables: stream[A]) => stream[{A with _status: string, _sent: string, _pagerdutyDedupKey: string, _body: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url

PagerDuty v2 Events API URL.

Default is `https://events.pagerduty.com/v2/enqueue`.


## Examples

### Send critical statuses to a PagerDuty endpoint

```js
import "pagerduty"
import "influxdata/influxdb/secrets"

routingKey = secrets.get(key: "PAGERDUTY_ROUTING_KEY")
toPagerDuty = pagerduty.endpoint()

crit_statuses =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and r.status == "crit")

crit_statuses
    |> toPagerDuty(
        mapFn: (r) =>
            ({r with
                routingKey: routingKey,
                client: r.client,
                clientURL: r.clientURL,
                class: r.class,
                eventAction: r.eventAction,
                group: r.group,
                severity: r.severity,
                source: r.source,
                component: r.component,
                summary: r.summary,
                timestamp: r._time,
                customDetails: {"ping time": r.ping, load: r.load},
            }),
    )()

```

