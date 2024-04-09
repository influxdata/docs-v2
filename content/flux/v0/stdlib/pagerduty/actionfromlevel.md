---
title: pagerduty.actionFromLevel() function
description: >
  `pagerduty.actionFromLevel()` converts a monitoring level to a PagerDuty action.
menu:
  flux_v0_ref:
    name: pagerduty.actionFromLevel
    parent: pagerduty
    identifier: pagerduty/actionFromLevel
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pagerduty/pagerduty.flux#L121-L121

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pagerduty.actionFromLevel()` converts a monitoring level to a PagerDuty action.

- `ok` converts to `resolve`.
- All other levels convert to `trigger`.

##### Function type signature

```js
(level: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### level
({{< req >}})
Monitoring level to convert to a PagerDuty action.




## Examples

### Convert a monitoring level to a PagerDuty action

```js
import "pagerduty"

pagerduty.actionFromLevel(level: "crit")// Returns trigger


```

