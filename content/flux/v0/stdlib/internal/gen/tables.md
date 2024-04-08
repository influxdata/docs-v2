---
title: gen.tables() function
description: >
  `gen.tables()` generates a stream of table data.
menu:
  flux_v0_ref:
    name: gen.tables
    parent: internal/gen
    identifier: internal/gen/tables
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/gen/gen.flux#L15-L20

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`gen.tables()` generates a stream of table data.



##### Function type signature

```js
(
    n: int,
    ?nulls: float,
    ?seed: int,
    ?tags: [{name: string, cardinality: int}],
) => stream[{A with _value: float, _time: time}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### n
({{< req >}})
Number of rows to generate.



### nulls

Percentage chance that a null value will be used in the input. Valid value range is `[0.0 - 1.0]`.



### tags

Set of tags with their cardinality to generate.



### seed

Pass seed to tables generator to get the very same sequence each time.



