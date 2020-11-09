---
title: pagerduty.actionFromSeverity() function
description: >
  The `pagerduty.actionFromSeverity()` function converts a severity to a PagerDuty action.
aliases:
  - /influxdb/cloud/reference/flux/functions/pagerduty/actionfromseverity/
menu:
  influxdb_cloud_ref:
    name: pagerduty.actionFromSeverity
    parent: PagerDuty
weight: 202
---

The `pagerduty.actionFromSeverity()` function converts a severity to a PagerDuty action.
`ok` converts to `resolve`.
All other severities convert to `trigger`.

_**Function type:** Transformation_

```js
import "pagerduty"

pagerduty.actionFromSeverity(
  severity: "ok"
)

// Returns "resolve"
```

## Parameters

### severity
The severity to convert to a PagerDuty action.

_**Data type:** String_

## Function definition
```js
import "strings"

actionFromSeverity = (severity) =>
  if strings.toLower(v: severity) == "ok" then "resolve"
  else "trigger"
```
