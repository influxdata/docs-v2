---
title: victorops.endpoint() function
description: >
  `victorops.endpoint()` sends events to VictorOps using data from input rows.
menu:
  flux_0_x_ref:
    name: victorops.endpoint
    parent: contrib/bonitoo-io/victorops
    identifier: contrib/bonitoo-io/victorops/endpoint
weight: 301
tags: [notification endpoints, transformations]
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

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
VictorOps REST endpoint integration URL.

Example: `https://alert.victorops.com/integrations/generic/00000000/alert/<api_key>/<routing_key>`
Replace `<api_key>` and `<routing_key>` with valid VictorOps API and routing keys.

### monitoringTool

Tool to use for monitoring.
Default is `InfluxDB`.



