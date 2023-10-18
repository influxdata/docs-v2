---
title: regexp.quoteMeta() function
description: >
  `regexp.quoteMeta()` escapes all regular expression metacharacters in a string.
menu:
  flux_v0_ref:
    name: regexp.quoteMeta
    parent: regexp
    identifier: regexp/quoteMeta
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/regexp/regexp.flux#L45-L45

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`regexp.quoteMeta()` escapes all regular expression metacharacters in a string.



##### Function type signature

```js
(v: string) => string
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
String that contains regular expression metacharacters to escape.




## Examples

### Escape regular expression metacharacters in a string

```js
import "regexp"

regexp.quoteMeta(v: ".+*?()|[]{}^$")// Returns "\.\+\*\?\(\)\|\[\]\{\}\^\$"


```

