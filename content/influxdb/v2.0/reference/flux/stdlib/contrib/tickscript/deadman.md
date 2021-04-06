---
title: tickscript.deadman() function
description: >
  The `tickscript.deadman()` function detects low data throughput and writes a point
  with a critical status to the InfluxDB `_monitoring` system bucket.
menu:
  influxdb_2_0_ref:
    name: tickscript.deadman
    parent: TICKscript
weight: 302
related:
  - /{{< latest "kapacitor" >}}/nodes/batch_node/#deadman, Kapacitor BatchNode – Deadman
---

The `tickscript.deadman()` function detects low data throughput and writes a point
with a critical status to the InfluxDB [`_monitoring` system bucket](/influxdb/v2.0/reference/internals/system-buckets/).
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

### check
({{< req >}})
InfluxDB check data.
_See [`tickscript.defineCheck()`](/influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/definecheck/)._

_**Data type:** Record_

### measurement
({{< req >}})
Measurement name.
Should match the queried measurement.

_**Data type:** String_

### threshold
Count threshold.
The function assigns a `crit` status to input tables with a number of rows less
than or equal to the threshold.
Default is `0`.

_**Data type:** Integer_

### id
Function to return the InfluxDB check ID provided by the [`check` record](#check).
Default is `(r) => "${r._check_id}"`.

_**Data type:** Function_

### message
Function to return the InfluxDB check message using data from input rows.
Default is `(r) => "Deadman Check: ${r._check_name} is: " + (if r.dead then "dead" else "alive")`.

_**Data type:** Function_

### topic
Check topic.
Default is `""`.

_**Data type:** String_

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

{{% note %}}
#### Package author and maintainer
**Github:** [@bonitoo-io](https://github.com/bonitoo-io), [@alespour](https://github.com/alespour)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}

