---
title: regexp.getString() function
description: >
  `regexp.getString()` returns the source string used to compile a regular expression.
menu:
  flux_v0_ref:
    name: regexp.getString
    parent: regexp
    identifier: regexp/getString
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/regexp/regexp.flux#L190-L190

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`regexp.getString()` returns the source string used to compile a regular expression.



##### Function type signature

```js
(r: regexp) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### r
({{< req >}})
Regular expression object to convert to a string.



