---
title: victorops.endpoint() function
description: >
  `victorops.endpoint()` sends events to VictorOps using data from input rows.
menu:
  flux_v0_ref:
    name: victorops.endpoint
    parent: contrib/bonitoo-io/victorops
    identifier: contrib/bonitoo-io/victorops/endpoint
weight: 301
flux/v0/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/victorops/victorops.flux#L163-L186

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`victorops.endpoint()` sends events to VictorOps using data from input rows.

### Usage
`victorops.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

#### mapFn
A function that builds the object used to generate the POST request. Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the following fields:

- monitoringTool
- messageType
- entityID
- entityDisplayName
- stateMessage
- timestamp

For more information, see `victorops.event()` parameters.

##### Function type signature

```js
(
    url: string,
    ?monitoringTool: A,
) => (
    mapFn: (
        r: B,
    ) => {
        C with
        timestamp: H,
        stateMessage: G,
        messageType: F,
        entityID: E,
        entityDisplayName: D,
    },
) => (<-tables: stream[B]) => stream[{B with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
VictorOps REST endpoint integration URL.

Example: `https://alert.victorops.com/integrations/generic/00000000/alert/<api_key>/<routing_key>`
Replace `<api_key>` and `<routing_key>` with valid VictorOps API and routing keys.

### monitoringTool

Tool to use for monitoring.
Default is `InfluxDB`.




## Examples

### Send critical events to VictorOps

```js
import "contrib/bonitoo-io/victorops"
import "influxdata/influxdb/secrets"

apiKey = secrets.get(key: "VICTOROPS_API_KEY")
routingKey = secrets.get(key: "VICTOROPS_ROUTING_KEY")
url = "https://alert.victorops.com/integrations/generic/00000000/alert/${apiKey}/${routingKey}"
endpoint = victorops.endpoint(url: url)

crit_events =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_events
    |> endpoint(
        mapFn: (r) =>
            ({
                monitoringTool: "InfluxDB",
                messageType: "CRITICAL",
                entityID: "${r.host}-${r._field}-critical",
                entityDisplayName: "Critical alert for ${r.host}",
                stateMessage: "${r.host} is in a critical state. ${r._field} is ${string(
                        v: r._value,
                    )}.",
                timestamp: now(),
            }),
    )()

```

