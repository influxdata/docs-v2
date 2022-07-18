---
title: zenoss.endpoint() function
description: >
  `zenoss.endpoint()` sends events to Zenoss using data from input rows.
menu:
  flux_0_x_ref:
    name: zenoss.endpoint
    parent: contrib/bonitoo-io/zenoss
    identifier: contrib/bonitoo-io/zenoss/endpoint
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/zenoss/zenoss.flux#L204-L243

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`zenoss.endpoint()` sends events to Zenoss using data from input rows.



##### Function type signature

```js
(
    password: string,
    url: string,
    username: string,
    ?action: A,
    ?method: B,
    ?tid: C,
    ?type: D,
) => (
    mapFn: (
        r: E,
    ) => {
        F with
        summary: N,
        severity: M,
        message: L,
        eventClassKey: K,
        eventClass: J,
        device: I,
        component: H,
        collector: G,
    },
) => (<-tables: stream[E]) => stream[{E with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
Zenoss [router endpoint URL](https://help.zenoss.com/zsd/RM/configuring-resource-manager/enabling-access-to-browser-interfaces/creating-and-changing-public-endpoints).



### username
({{< req >}})
Zenoss username to use for HTTP BASIC authentication.
Default is `""` (no authentication).



### password
({{< req >}})
Zenoss password to use for HTTP BASIC authentication.
Default is `""` (no authentication).



### action

Zenoss router name.
Default is `"EventsRouter"`.



### method

EventsRouter method.
Default is `"add_event"`.



### type

Event type. Default is `"rpc"`.



### tid

Temporary request transaction ID.
Default is `1`.



