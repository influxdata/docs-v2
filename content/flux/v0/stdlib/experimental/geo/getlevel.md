---
title: geo.getLevel() function
description: >
  `geo.getLevel()` returns the S2 cell level of specified cell ID token.
menu:
  flux_v0_ref:
    name: geo.getLevel
    parent: experimental/geo
    identifier: experimental/geo/getLevel
weight: 201
flux/v0.x/tags: [geotemporal]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L415-L415

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.getLevel()` returns the S2 cell level of specified cell ID token.



##### Function type signature

```js
(token: string) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### token
({{< req >}})
S2 cell ID token.




## Examples

### Return the S2 cell level of an S2 cell ID token

```js
import "experimental/geo"

geo.getLevel(token: "166b59")// Returns 10


```

