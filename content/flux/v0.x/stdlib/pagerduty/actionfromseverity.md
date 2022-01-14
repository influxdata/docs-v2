---
title: pagerduty.actionFromSeverity() function
description: >
  The `pagerduty.actionFromSeverity()` function converts a severity to a PagerDuty action.
aliases:
  - /influxdb/v2.0/reference/flux/functions/pagerduty/actionfromseverity/
  - /influxdb/v2.0/reference/flux/stdlib/pagerduty/actionfromseverity/
  - /influxdb/cloud/reference/flux/stdlib/pagerduty/actionfromseverity/
menu:
  flux_0_x_ref:
    name: pagerduty.actionFromSeverity
    parent: pagerduty
weight: 202
introduced: 0.43.0
---

The `pagerduty.actionFromSeverity()` function converts a severity to a PagerDuty action.
`ok` converts to `resolve`.
All other severities convert to `trigger`.

```js
import "pagerduty"

pagerduty.actionFromSeverity(
  severity: "ok"
)

// Returns "resolve"
```

## Parameters

### severity {data-type="float"}
The severity to convert to a PagerDuty action.

## Function definition
```js
import "strings"

actionFromSeverity = (severity) =>
  if strings.toLower(v: severity) == "ok" then "resolve"
  else "trigger"
```
