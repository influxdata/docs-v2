---
title: tickscript.deadman() function
description: >
  The `tickscript.deadman()` function detects low data throughput and writes a point
  with a critical status to the InfluxDB `_monitoring` system bucket.
menu:
  flux_0_x_ref:
    name: tickscript.deadman
    parent: tickscript
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/deadman/
  - /influxdb/cloud/reference/flux/stdlib/contrib/tickscript/deadman/
related:
  - /{{< latest "kapacitor" >}}/nodes/batch_node/#deadman, Kapacitor BatchNode – Deadman
flux/v0.x/tags: [transformations]
introduced: 0.111.0
---

The `tickscript.deadman()` function detects low data throughput and writes a point
with a critical status to the InfluxDB [`_monitoring` system bucket](/{{< latest "influxdb" >}}/reference/internals/system-buckets/).
For each input table containing a number of rows less than or equal to the specified
[threshold](#threshold), the function assigns a `crit` value to the `_level` column.

_This function is comparable to the [Kapacitor AlertNode deadman](/{{< latest "kapacitor" >}}/nodes/alert_node/#deadman)._

```js
import "contrib/bonitoo-io/tickscript"

tickscript.deadman(
  check: {},
  measurement: "example-measurement",
  threshold: 0,
  id: (r)=>"${r._check_id}",
  message: (r) => "Deadman Check: ${r._check_name} is: " + (if r.dead then "dead" else "alive"),
  topic: ""
)
```

## Parameters

### check {data-type="record"}
({{< req >}})
InfluxDB check data.
_See [`tickscript.defineCheck()`](/flux/v0.x/stdlib/contrib/bonitoo-io/tickscript/definecheck/)._

### measurement {data-type="string"}
({{< req >}})
Measurement name.
Should match the queried measurement.

### threshold {data-type="int"}
Count threshold.
The function assigns a `crit` status to input tables with a number of rows less
than or equal to the threshold.
Default is `0`.

### id {data-type="function"}
Function that returns the InfluxDB check ID provided by the [`check` record](#check).
Default is `(r) => "${r._check_id}"`.

### message {data-type="function"}
Function that returns the InfluxDB check message using data from input rows.
Default is `(r) => "Deadman Check: ${r._check_name} is: " + (if r.dead then "dead" else "alive")`.

### topic {data-type="string"}
Check topic.
Default is `""`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Flux](#)
[TICKscript](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```javascript
import "contrib/bonitoo-io/tickscript"

option task = {name: "Example task", every: 1m;}

from(bucket: "example-bucket")
  |> range(start: -task.every)
  |> filter(fn: (r) => r._measurement == "pulse" and r._field == "value")
  |> tickscript.deadman(
    check: tickscript.defineCheck(id: "000000000000", name: "task/${r.service}"),
    measurement: "pulse",
    threshold: 2
  )
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```javascript
data = batch
  |query('SELECT value from pulse')
    .every(1m)

data
  |deadman(2.0, 1m)
    .id('kapacitor/{{ index .Tags "service" }}')
    .message('{{ .ID }} is {{ .Level }} value:{{ index .Fields "value" }}')
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
