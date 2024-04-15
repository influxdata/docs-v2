---
title: dict.fromList() function
description: >
  `dict.fromList()` creates a dictionary from a list of records with `key` and `value`
  properties.
menu:
  flux_v0_ref:
    name: dict.fromList
    parent: dict
    identifier: dict/fromList
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/dict/dict.flux#L31-L31

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`dict.fromList()` creates a dictionary from a list of records with `key` and `value`
properties.



##### Function type signature

```js
(pairs: [{value: B, key: A}]) => [A:B] where A: Comparable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### pairs
({{< req >}})
List of records with `key` and `value` properties.




## Examples

### Create a dictionary from a list of records

```js
import "dict"

d =
    dict.fromList(
        pairs: [{key: 1, value: "foo"}, {key: 2, value: "bar"}],
    )// Returns [1: "foo", 2: "bar"]


```

