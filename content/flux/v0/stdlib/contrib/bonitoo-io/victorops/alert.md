---
title: victorops.alert() function
description: >
  `victorops.alert()` sends an alert to VictorOps.
menu:
  flux_v0_ref:
    name: victorops.alert
    parent: contrib/bonitoo-io/victorops
    identifier: contrib/bonitoo-io/victorops/alert
weight: 301
flux/v0.x/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/victorops/victorops.flux#L77-L100

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`victorops.alert()` sends an alert to VictorOps.



##### Function type signature

```js
(
    messageType: A,
    url: string,
    ?entityDisplayName: B,
    ?entityID: C,
    ?monitoringTool: D,
    ?stateMessage: E,
    ?timestamp: F,
) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
VictorOps REST endpoint integration URL.

Example: `https://alert.victorops.com/integrations/generic/00000000/alert/<api_key>/<routing_key>`
Replace `<api_key>` and `<routing_key>` with valid VictorOps API and routing keys.

### monitoringTool

Monitoring agent name. Default is `""`.



### messageType
({{< req >}})
VictorOps message type (alert behavior).

**Valid values**:
- `CRITICAL`
- `WARNING`
- `INFO`

### entityID

Incident ID. Default is `""`.



### entityDisplayName

Incident display name or summary. Default is `""`.



### stateMessage

Verbose incident message. Default is `""`.



### timestamp

Incident start time. Default is `now()`.




## Examples

### Send the last reported value and incident type to VictorOps

```js
import "contrib/bonitoo-io/victorops"
import "influxdata/influxdb/secrets"

apiKey = secrets.get(key: "VICTOROPS_API_KEY")
routingKey = secrets.get(key: "VICTOROPS_ROUTING_KEY")

lastReported =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_idle")
        |> last()
        |> findRecord(fn: (key) => true, idx: 0)

victorops.alert(
    url: "https://alert.victorops.com/integrations/generic/00000000/alert/${apiKey}/${routingKey}",
    messageType:
        if lastReported._value < 1.0 then
            "CRITICAL"
        else if lastReported._value < 5.0 then
            "WARNING"
        else
            "INFO",
    entityID: "example-alert-1",
    entityDisplayName: "Example Alert 1",
    stateMessage: "Last reported cpu_idle was ${string(v: r._value)}.",
)

```

