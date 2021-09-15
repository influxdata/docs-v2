---
title: victorops.event() function
description: >
  The `victorops.event()` function sends an event to VictorOps.
menu:
  flux_0_x_ref:
    name: victorops.event
    parent: victorops
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/victorops/event/
  - /influxdb/cloud/reference/flux/stdlib/contrib/victorops/event/
introduced: 0.108.0
---

The `victorops.event()` function sends an event to [VictorOps](https://www.victorops.com/).

{{% note %}}
#### VictorOps is now Splunk On-Call
Splunk acquired VictorOps and VictorOps is now
[Splunk On-Call](https://www.splunk.com/en_us/investor-relations/acquisitions/splunk-on-call.html).
{{% /note %}}

```js
import "contrib/bonitoo-io/victorops"

victorops.event(
  url: "https://alert.victorops.com/integrations/generic/00000000/alert/${api_key}/${routing_key}",
  monitoringTool: "",
  messageType: "CRITICAL",
  entityID: "",
  entityDisplayName: "",
  stateMessage: "",
  timestamp: now()
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

### monitoringTool {data-type="string"}
Monitoring agent name.
Default is `""`.

### messageType {data-type="string"}
({{< req >}})
VictorOps [message type](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/#recommended-rest-endpoint-integration-fields)
(alert behavior).

**Valid values:**

- `CRITICAL`
- `WARNING`
- `INFO`

### entityID {data-type="string"}
[Incident ID](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/#recommended-rest-endpoint-integration-fields).
Default is `""`.

### entityDisplayName {data-type="string"}
[Incident display name or summary](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/#recommended-rest-endpoint-integration-fields).
Default is `""`.

### stateMessage {data-type="string"}
[Verbose incident message](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/#recommended-rest-endpoint-integration-fields).
Default is `""`.

### timestamp {data-type="time"}
[Incident start time](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/#recommended-rest-endpoint-integration-fields).
Default is `now()`.

## Examples

##### Send the last reported value and incident type to VictorOps
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

victorops.event(
  url: "https://alert.victorops.com/integrations/generic/00000000/alert/${apiKey}/${routingKey}",
  messageType:
    if lastReported._value < 1.0 then "CRITICAL"
    else if lastReported._value < 5.0 then "WARNING"
    else "INFO",
  entityID: "example-alert-1",
  entityDisplayName: "Example Alert 1",
  stateMessage: "Last reported cpu_idle was ${string(v: r._value)}."
)
```
