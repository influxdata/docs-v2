---
title: tickscript.defineCheck() function
description: >
  `tickscript.defineCheck()` creates custom check data required by `alert()` and `deadman()`.
menu:
  flux_v0_ref:
    name: tickscript.defineCheck
    parent: contrib/bonitoo-io/tickscript
    identifier: contrib/bonitoo-io/tickscript/defineCheck
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/tickscript/tickscript.flux#L49-L51

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`tickscript.defineCheck()` creates custom check data required by `alert()` and `deadman()`.



##### Function type signature

```js
(id: A, name: B, ?type: C) => {tags: {}, _type: C, _check_name: B, _check_id: A}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### id
({{< req >}})
InfluxDB check ID.



### name
({{< req >}})
InfluxDB check name.



### type

InfluxDB check type. Default is `custom`.

**Valid values**:
- `threshold`
-`deadman`
-`custom`


## Examples

### Generate InfluxDB check data

```js
import "contrib/bonitoo-io/tickscript"

tickscript.defineCheck(id: "000000000000", name: "Example check name")// Returns:
// {
//     _check_id: 000000000000,
//     _check_name: Example check name,
//     _type: custom,
//     tags: {}
// }


```

