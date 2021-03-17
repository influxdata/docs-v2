---
title: victorops.event() function
description: >
  The `victorops.event()` function sends an event to VictorOps.
menu:
  influxdb_2_0_ref:
    name: victorops.event
    parent: VictorOps
weight: 202
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

### url
({{< req >}})
[VictorOps REST endpoint integration URL](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/).

_**Data type:** String_

##### VictorOps URL example
```
https://alert.victorops.com/integrations/generic/00000000/alert/<api_key>/<routing_key>
```

_Replace `<api_key>` and `<routing_key>` with valid VictorOps API and routing keys._

### monitoringTool
Monitoring agent name.
Default is `""`.

_**Data type:** String_

### messageType
({{< req >}})
VictorOps [message type](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/#recommended-rest-endpoint-integration-fields)
(alert behavior).

_**Data type:** String_

**Valid values:**

- `CRITICAL`
- `WARNING`
- `INFO`

### entityID
[Incident ID](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/#recommended-rest-endpoint-integration-fields).
Default is `""`.

_**Data type:** String_

### entityDisplayName
[Incident display name or summary](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/#recommended-rest-endpoint-integration-fields).
Default is `""`.

_**Data type:** String_

### stateMessage
[Verbose incident message](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/#recommended-rest-endpoint-integration-fields).
Default is `""`.

_**Data type:** String_

### timestamp
[Incident start time](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/#recommended-rest-endpoint-integration-fields).
Default is `now()`.

_**Data type:** Time_

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

{{% note %}}
#### Package author and maintainer
**Github:** [@alespour](https://github.com/alespour), [@bonitoo-io](https://github.com/bonitoo-io)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}
