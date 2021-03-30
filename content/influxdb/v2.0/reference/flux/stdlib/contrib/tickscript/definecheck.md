---
title: tickscript.defineCheck() function
description: >
  The `tickscript.defineCheck()` function creates and returns a record with custom
  check data required by `tickscript.alert()` and `tickscript.deadman()`.
menu:
  influxdb_2_0_ref:
    name: tickscript.defineCheck
    parent: TICKscript
weight: 302
---

The `tickscript.defineCheck()` function creates and returns a record with custom check data required by
[`tickscript.alert()`](/influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/alert/) and
[`tickscript.deadman()`](/influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/deadman/).
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

## id
({{< req >}})
InfluxDB check ID.

_**Data type:** String_

## name
({{< req >}})
InfluxDB check name.

_**Data type:** String_

## type
InfluxDB check type.
Default is `custom`.

_**Data type:** String_

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

// Returns: {
//   _check_id: "000000000000",
//   _check_name: "Example check name",
//   _type: "custom",
//   tags: {}
//  }
```

{{% note %}}
#### Package author and maintainer
**Github:** [@bonitoo-io](https://github.com/bonitoo-io), [@alespour](https://github.com/alespour)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}
