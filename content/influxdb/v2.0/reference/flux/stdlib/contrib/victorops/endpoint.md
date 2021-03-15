---
title: victorops.endpoint() function
description: >
  The `victorops.endpoint()` function sends events to VictorOps using data from input rows.
menu:
  influxdb_2_0_ref:
    name: victorops.endpoint
    parent: VictorOps
weight: 202
---

The `victorops.endpoint()` function sends events to VictorOps using data from input rows.

_**Function type:** Output_

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

### url
({{< req >}})
[VictorOps REST endpoint integration URL](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/).

_**Data type:** String_

##### VictorOps URL example
```
https://alert.victorops.com/integrations/generic/00000000/alert/<api_key>/<routing_key>
```

_Replace `<api_key>` and `<routing_key>` with valid VictorOps API and routing keys._

## Usage
`victorops.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

_**Data type:** Function_

`mapFn` accepts a table row (`r`) and returns an object that must include the
following fields:

- `monitoringTool`
- `messageType`
- `entityID`
- `entityDisplayName`
- `stateMessage`
- `timestamp`

_For more information, see [`victorops.event()` parameters](/influxdb/v2.0/reference/flux/stdlib/contrib/victorops/event/#parameters)._

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

{{% note %}}
#### Package author and maintainer
**Github:** [@alespour](https://github.com/alespour), [@bonitoo-io](https://github.com/bonitoo-io)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}
