---
title: pagerduty.severityFromLevel() function
description: >
  The `pagerduty.severityFromLevel()` function converts an InfluxDB status level to
  a PagerDuty severity.
aliases:
  - /influxdb/v2.0/reference/flux/functions/pagerduty/severityfromlevel/
  - /influxdb/v2.0/reference/flux/stdlib/pagerduty/severityfromlevel/
  - /influxdb/cloud/reference/flux/stdlib/pagerduty/severityfromlevel/
menu:
  flux_0_x_ref:
    name: pagerduty.severityFromLevel
    parent: pagerduty
weight: 202
introduced: 0.43.0
---

The `pagerduty.severityFromLevel()` function converts an InfluxDB status level to
a PagerDuty severity.

_**Function type:** Transformation_

```js
import "pagerduty"

pagerduty.severityFromLevel(
  level: "crit"
)

// Returns "critical"
```

| Status level | PagerDuty severity |
|:------------:|:------------------:|
| `crit`       | `critical`         |
| `warn`       | `warning`          |
| `info`       | `info`             |
| `ok`         | `info`             |

## Parameters

### level
The InfluxDB status level to convert to a PagerDuty severity.

_**Data type:** String_

## Function definition
```js
import "strings"

severityFromLevel = (level) => {
  lvl = strings.toLower(v:level)
  sev = if lvl == "warn" then "warning"
      else if lvl == "crit" then "critical"
      else if lvl == "info" then "info"
      else if lvl == "ok" then "info"
      else "error"
  return sev
}
```
