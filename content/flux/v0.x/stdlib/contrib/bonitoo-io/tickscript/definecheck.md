---
title: tickscript.defineCheck() function
description: >
  The `tickscript.defineCheck()` function creates and returns a record with custom
  check data required by `tickscript.alert()` and `tickscript.deadman()`.
menu:
  flux_0_x_ref:
    name: tickscript.defineCheck
    parent: tickscript
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/definecheck/
  - /influxdb/cloud/reference/flux/stdlib/contrib/tickscript/definecheck/
introduced: 0.111.0
---

The `tickscript.defineCheck()` function creates and returns a record with custom check data required by
[`tickscript.alert()`](/flux/v0.x/stdlib/contrib/bonitoo-io/tickscript/alert/) and
[`tickscript.deadman()`](/flux/v0.x/stdlib/contrib/bonitoo-io/tickscript/deadman/).
This check data specifies information about the check in the InfluxDB monitoring system.

```js
import "contrib/bonitoo-io/tickscript"

tickscript.defineCheck(
  id: "000000000000",
  name: "Example check name",
  type: "custom"
)
```

## Parameters

## id {data-type="string"}
({{< req >}})
InfluxDB check ID.

## name {data-type="string"}
({{< req >}})
InfluxDB check name.

## type {data-type="string"}
InfluxDB check type.
Default is `custom`.

**Supported values:**

- threshold
- deadman
- custom

## Examples

##### Generate InfluxDB check data
```javascript
import "contrib/bonitoo-io/tickscript"

tickscript.defineCheck(
  id: "000000000000",
  name: "Example check name",
)

// The function above returns: {
//   _check_id: "000000000000",
//   _check_name: "Example check name",
//   _type: "custom",
//   tags: {}
//  }
```
