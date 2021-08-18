---
title: tickscript.alert() function
description: >
  The `tickscript.alert()` function function identifies events of varying severity levels
  and writes them to the `statuses` measurement in the InfluxDB
  `_monitoring` system bucket.
menu:
  influxdb_2_0_ref:
    name: tickscript.alert
    parent: TICKscript
weight: 302
related:
  - /{{< latest "kapacitor" >}}/nodes/alert_node/, Kapacitor AlertNode
introduced: 0.111.0
---

The `tickscript.alert()` function identifies events of varying severity levels
and writes them to the `statuses` measurement in the InfluxDB
[`_monitoring` system bucket](/influxdb/v2.0/reference/internals/system-buckets/).

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

### check
({{< req >}})
InfluxDB check data.
_See [`tickscript.defineCheck()`](/influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/definecheck/)._

_**Data type:** Record_

### id
Function that returns the InfluxDB check ID provided by the [`check` record](#check).
Default is `(r) => "${r._check_id}"`.

_**Data type:** Function_

### details
Function to return the InfluxDB check details using data from input rows.
Default is `(r) => ""`.

_**Data type:** Function_

### message
Function to return the InfluxDB check message using data from input rows.
Default is `(r) => "Threshold Check: ${r._check_name} is: ${r._level}"`.

_**Data type:** Function_

### crit
Predicate function to determine `crit` status.
Default is `(r) => false`

_**Data type:** Function_

### warn
Predicate function to determine `warn` status.
Default is `(r) => false`

_**Data type:** Function_

### info
Predicate function to determine `info` status.
Default is `(r) => false`

_**Data type:** Function_

### ok
Predicate function to determine `ok` status.
Default is `(r) => true`

_**Data type:** Function_

### topic
Check topic.
Default is `""`

_**Data type:** String_

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

{{% note %}}
#### Package author and maintainer
**Github:** [@bonitoo-io](https://github.com/bonitoo-io), [@alespour](https://github.com/alespour)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}
