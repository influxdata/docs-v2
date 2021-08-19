---
title: tickscript.alert() function
description: >
  The `tickscript.alert()` function function identifies events of varying severity levels
  and writes them to the `statuses` measurement in the InfluxDB
  `_monitoring` system bucket.
menu:
  flux_0_x_ref:
    name: tickscript.alert
    parent: tickscript
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/alert/
  - /influxdb/cloud/reference/flux/stdlib/contrib/tickscript/alert/
related:
  - /{{< latest "kapacitor" >}}/nodes/alert_node/, Kapacitor AlertNode
flux/v0.x/tags: [transformations]
introduced: 0.111.0
---

The `tickscript.alert()` function identifies events of varying severity levels
and writes them to the `statuses` measurement in the InfluxDB
[`_monitoring` system bucket](/{{< latest "influxdb" >}}/reference/internals/system-buckets/).

_This function is comparable to the [Kapacitor AlertNode](/{{< latest "kapacitor" >}}/nodes/alert_node/)._

```js
import "contrib/bonitoo-io/tickscript"

tickscript.alert(
    check: {id: "000000000000", name: "Example check name", type: "threshold", tags: {}},
    id: (r) => "000000000000",
    details: (r) => "",
    message: (r) => "Threshold Check: ${r._check_name} is: ${r._level}",
    crit: (r) => false,
    warn: (r) => false,
    info: (r) => false,
    ok: (r) => true,
    topic: ""
)
```

## Parameters

### check {data-type="record"}
({{< req >}})
InfluxDB check data.
_See [`tickscript.defineCheck()`](/flux/v0.x/stdlib/contrib/bonitoo-io/tickscript/definecheck/)._

### id {data-type="function"}
Function that returns the InfluxDB check ID provided by the [`check` record](#check).
Default is `(r) => "${r._check_id}"`.

### details {data-type="function"}
Function to return the InfluxDB check details using data from input rows.
Default is `(r) => ""`.

### message {data-type="function"}
Function to return the InfluxDB check message using data from input rows.
Default is `(r) => "Threshold Check: ${r._check_name} is: ${r._level}"`.

### crit {data-type="function"}
Predicate function to determine `crit` status.
Default is `(r) => false`

### warn {data-type="function"}
Predicate function to determine `warn` status.
Default is `(r) => false`

### info {data-type="function"}
Predicate function to determine `info` status.
Default is `(r) => false`

### ok {data-type="function"}
Predicate function to determine `ok` status.
Default is `(r) => true`

### topic {data-type="string"}
Check topic.
Default is `""`

## Examples

##### Store alert statuses for error counts
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Flux](#)
[TICKscript](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```javascript
import "contrib/bonitoo-io/tickscript"

option task = {name: "Example task", every: 1m;}

check = tickscript.defineCheck(
  id: "000000000000",
  name: "Errors",
  type: "threshold"
)

from(bucket: "example-bucket")
  |> range(start: -task.every)
  |> filter(fn: (r) => r._measurement == "errors" and r._field == "value")
  |> count()
  |> tickscript.alert(
    check: {check with _check_id: "task/${r.service}"},
    message: "task/${r.service} is ${r._level} value: ${r._value}",
    crit: (r) => r._value > 30,
    warn: (r) => r._value > 20,
    info: (r) => r._value > 10    
  )
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```javascript
data = batch
  |query('SELECT count(value) from errors')
    .every(1m)

data
  |alert()
    .id('kapacitor/{{ index .Tags "service" }}')
    .message('{{ .ID }} is {{ .Level }} value:{{ index .Fields "value" }}')
    .info(lambda: "value" > 10)
    .warn(lambda: "value" > 20)
    .crit(lambda: "value" > 30)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
