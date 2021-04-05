---
title: tickscript.deadman() function
description: >
  The `tickscript.deadman()` function ...
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
Default is `""`

_**Data type:** String_

## Examples

{{% note %}}
#### Package author and maintainer
**Github:** [@bonitoo-io](https://github.com/bonitoo-io), [@alespour](https://github.com/alespour)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}

