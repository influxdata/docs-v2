---
title: pagerduty.severityFromLevel() function
description: >
  `pagerduty.severityFromLevel()` converts an InfluxDB status level to a PagerDuty severity.
menu:
  flux_0_x_ref:
    name: pagerduty.severityFromLevel
    parent: pagerduty
    identifier: pagerduty/severityFromLevel
weight: 101
aliases:
  - /influxdb/v2.0/reference/flux/functions/pagerduty/severityfromlevel/
  - /influxdb/v2.0/reference/flux/stdlib/pagerduty/severityfromlevel/
  - /influxdb/cloud/reference/flux/stdlib/pagerduty/severityfromlevel/
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pagerduty/pagerduty.flux#L61-L76

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pagerduty.severityFromLevel()` converts an InfluxDB status level to a PagerDuty severity.

| Status level | PagerDuty severity |
| :----------- | :----------------- |
| crit         | critical           |
| warn         | warning            |
| info         | info               |
| ok           | info               |

##### Function type signature

```js
(level: string) => string
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### level
({{< req >}})
InfluxDB status level to convert to a PagerDuty severity.




## Examples

### Convert a status level to a PagerDuty serverity

```js
import "pagerduty"

pagerduty.severityFromLevel(level: "crit")// Returns critical


```

