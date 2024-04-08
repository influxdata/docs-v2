---
title: debug.null() function
description: >
  `debug.null()` returns the null value with a given type.
menu:
  flux_v0_ref:
    name: debug.null
    parent: internal/debug
    identifier: internal/debug/null
weight: 201

introduced: 0.179.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/debug/debug.flux#L86-L86

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`debug.null()` returns the null value with a given type.



##### Function type signature

```js
(?type: string) => A where A: Basic
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### type

Null type.

**Supported types**:
- string
- bytes
- int
- uint
- float
- bool
- time
- duration
- regexp


## Examples

### Include null values in an ad hoc stream of tables

```js
import "array"
import "internal/debug"

array.from(rows: [{a: 1, b: 2, c: 3}, {a: debug.null(type: "int"), b: 5, c: 6}])

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| a  | b  | c  |
| -- | -- | -- |
| 1  | 2  | 3  |
|    | 5  | 6  |

{{% /expand %}}
{{< /expand-wrapper >}}
