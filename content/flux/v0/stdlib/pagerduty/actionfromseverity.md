---
title: pagerduty.actionFromSeverity() function
description: >
  `pagerduty.actionFromSeverity()` converts a severity to a PagerDuty action.
menu:
  flux_v0_ref:
    name: pagerduty.actionFromSeverity
    parent: pagerduty
    identifier: pagerduty/actionFromSeverity
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pagerduty/pagerduty.flux#L98-L102

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pagerduty.actionFromSeverity()` converts a severity to a PagerDuty action.

- `ok` converts to `resolve`.
- All other severities convert to `trigger`.

##### Function type signature

```js
(severity: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### severity
({{< req >}})
Severity to convert to a PagerDuty action.




## Examples

### Convert a severity to a PagerDuty action

```js
import "pagerduty"

pagerduty.actionFromSeverity(severity: "crit")// Returns trigger


```

