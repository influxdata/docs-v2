---
title: victorops.endpoint() function
description: >
  The `victorops.endpoint()` function sends events to VictorOps using data from input rows.
menu:
  flux_0_x_ref:
    name: victorops.endpoint
    parent: victorops
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/victorops/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/victorops/endpoint/
flux/v0.x/tags: [notification endpoints]
introduced: 0.108.0
---

The `victorops.endpoint()` function sends events to VictorOps using data from input rows.

{{% note %}}
#### VictorOps is now Splunk On-Call
Splunk acquired VictorOps and VictorOps is now
[Splunk On-Call](https://www.splunk.com/en_us/investor-relations/acquisitions/splunk-on-call.html).
{{% /note %}}

```js
import "contrib/bonitoo-io/victorops"

victorops.endpoint(
  url: "https://alert.victorops.com/integrations/generic/00000000/alert${apiKey}/${routingKey}",
)
```

## Parameters

### url {data-type="string"}
({{< req >}})
[VictorOps REST endpoint integration URL](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/).

##### VictorOps URL example
```
https://alert.victorops.com/integrations/generic/00000000/alert/<api_key>/<routing_key>
```

_Replace `<api_key>` and `<routing_key>` with valid VictorOps API and routing keys._

## Usage
`victorops.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the
following fields:

- `monitoringTool`
- `messageType`
- `entityID`
- `entityDisplayName`
- `stateMessage`
- `timestamp`

_For more information, see [`victorops.event()` parameters](/flux/v0.x/stdlib/contrib/bonitoo-io/victorops/event/#parameters)._

## Examples

##### Send critical events to VictorOps
```js
import "contrib/bonitoo-io/victorops"
import "influxdata/influxdb/secrets"

apiKey = secrets.get(key: "VICTOROPS_API_KEY")
routingKey = secrets.get(key: "VICTOROPS_ROUTING_KEY")
url = "https://alert.victorops.com/integrations/generic/00000000/alert/${apiKey}/${routingKey}"
endpoint = victorops.endpoint(url: url)

crit_events = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_events
  |> endpoint(mapFn: (r) => ({
      monitoringTool: "InfluxDB"
      messageType: "CRITICAL",
      entityID: "${r.host}-${r._field)-critical",
      entityDisplayName: "Critical alert for ${r.host}",
      stateMessage: "${r.host} is in a critical state. ${r._field} is ${string(v: r._value)}.",
      timestamp: now()
    })
  )()
```
