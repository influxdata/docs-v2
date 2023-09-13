---
title: runtime.version() function
description: >
  `runtime.version()` returns the current Flux version.
menu:
  flux_v0_ref:
    name: runtime.version
    parent: runtime
    identifier: runtime/version
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/runtime/runtime.flux#L19-L19

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`runtime.version()` returns the current Flux version.



##### Function type signature

```js
() => string
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}


## Examples

### Return the Flux version in a stream of tables

```js
import "array"
import "runtime"

array.from(rows: [{version: runtime.version()}])

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| version  |
| -------- |
| (devel)  |

{{% /expand %}}
{{< /expand-wrapper >}}
