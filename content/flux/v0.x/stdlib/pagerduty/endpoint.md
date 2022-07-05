---
title: pagerduty.endpoint() function
description: >
  `pagerduty.endpoint()` returns a function that sends a message to PagerDuty that includes output data.
menu:
  flux_0_x_ref:
    name: pagerduty.endpoint
    parent: pagerduty
    identifier: pagerduty/endpoint
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pagerduty/pagerduty.flux#L306-L335

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pagerduty.endpoint()` returns a function that sends a message to PagerDuty that includes output data.



##### Function type signature

```js
(
    ?url: string,
) => (
    mapFn: (
        r: {A with _pagerdutyDedupKey: string},
    ) => {
        B with
        timestamp: L,
        summary: K,
        source: J,
        severity: I,
        routingKey: H,
        group: G,
        eventAction: F,
        clientURL: E,
        client: D,
        class: C,
    },
) => (<-tables: stream[A]) => stream[{A with _status: string, _sent: string, _pagerdutyDedupKey: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### url

PagerDuty v2 Events API URL.

Default is `https://events.pagerduty.com/v2/enqueue`.

