---
title: zenoss.endpoint() function
description: >
  `zenoss.endpoint()` sends events to Zenoss using data from input rows.
menu:
  flux_v0_ref:
    name: zenoss.endpoint
    parent: contrib/bonitoo-io/zenoss
    identifier: contrib/bonitoo-io/zenoss/endpoint
weight: 301
flux/v0/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/zenoss/zenoss.flux#L219-L260

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`zenoss.endpoint()` sends events to Zenoss using data from input rows.

### Usage
`zenoss.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

#### mapFn
A function that builds the object used to generate the POST request. Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the following fields:

- summary
- device
- component
- severity
- eventClass
- eventClassKey
- collector
- message

For more information, see `zenoss.event()` parameters.

##### Function type signature

```js
(
    url: string,
    ?action: A,
    ?apiKey: B,
    ?method: C,
    ?password: string,
    ?tid: D,
    ?type: E,
    ?username: string,
) => (
    mapFn: (
        r: F,
    ) => {
        G with
        summary: O,
        severity: N,
        message: M,
        eventClassKey: L,
        eventClass: K,
        device: J,
        component: I,
        collector: H,
    },
) => (<-tables: stream[F]) => stream[{F with _sent: string}] where B: Equatable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
Zenoss [router endpoint URL](https://help.zenoss.com/zsd/RM/configuring-resource-manager/enabling-access-to-browser-interfaces/creating-and-changing-public-endpoints).



### username

Zenoss username to use for HTTP BASIC authentication.
Default is `""` (no authentication).



### password

Zenoss password to use for HTTP BASIC authentication.
Default is `""` (no authentication).



### apiKey

Zenoss cloud API key.
Default is `""` (no API key).



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




## Examples

### Send critical events to Zenoss

```js
import "contrib/bonitoo-io/zenoss"
import "influxdata/influxdb/secrets"

url = "https://tenant.zenoss.io:8080/zport/dmd/evconsole_router"
username = secrets.get(key: "ZENOSS_USERNAME")
password = secrets.get(key: "ZENOSS_PASSWORD")
endpoint = zenoss.endpoint(url: url, username: username, password: password)

crit_events =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_events
    |> endpoint(
        mapFn: (r) =>
            ({
                summary: "Critical event for ${r.host}",
                device: r.deviceID,
                component: r.host,
                severity: "Critical",
                eventClass: "/App",
                eventClassKey: "",
                collector: "",
                message: "${r.host} is in a critical state.",
            }),
    )()

```

