---
title: contains() function
description: >
  `contains()` tests if an array contains a specified value and returns `true` or `false`.
menu:
  flux_0_x_ref:
    name: contains
    parent: universe
    identifier: universe/contains
weight: 101

introduced: 0.19.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3436-L3436

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`contains()` tests if an array contains a specified value and returns `true` or `false`.



##### Function type signature

```js
(set: [A], value: A) => bool where A: Nullable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### value
({{< req >}})
Value to search for.



### set
({{< req >}})
Array to search.




## Examples

### Filter on a set of specific fields

```js
fields = ["f1", "f2"]

data
    |> filter(fn: (r) => contains(value: r._field, set: fields))
```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| *_field | _measurement  | _time                | _value  | *tag |
| ------- | ------------- | -------------------- | ------- | ---- |
| f1      | m             | 2021-01-01T00:00:00Z | -2      | t1   |
| f1      | m             | 2021-01-01T00:00:50Z | 4       | t1   |

| *_field | _measurement  | _time                | _value  | *tag |
| ------- | ------------- | -------------------- | ------- | ---- |
| f1      | m             | 2021-01-01T00:00:10Z | 4       | t2   |
| f1      | m             | 2021-01-01T00:00:20Z | -3      | t2   |
| f1      | m             | 2021-01-01T00:00:50Z | 1       | t2   |

| *_field | _measurement  | _time                | _value  | *tag |
| ------- | ------------- | -------------------- | ------- | ---- |
| f2      | m             | 2021-01-01T00:00:10Z | 10      | t1   |
| f2      | m             | 2021-01-01T00:00:20Z | 7       | t1   |

| *_field | _measurement  | _time                | _value  | *tag |
| ------- | ------------- | -------------------- | ------- | ---- |
| f3      | m             | 2021-01-01T00:00:30Z | 17      | t1   |
| f3      | m             | 2021-01-01T00:00:40Z | 15      | t1   |

| *_field | _measurement  | _time                | _value  | *tag |
| ------- | ------------- | -------------------- | ------- | ---- |
| f3      | m             | 2021-01-01T00:00:00Z | 19      | t2   |
| f3      | m             | 2021-01-01T00:00:30Z | 19      | t2   |
| f3      | m             | 2021-01-01T00:00:40Z | 13      | t2   |


#### Output data

| *_field | _measurement  | _time                | _value  | *tag |
| ------- | ------------- | -------------------- | ------- | ---- |
| f1      | m             | 2021-01-01T00:00:00Z | -2      | t1   |
| f1      | m             | 2021-01-01T00:00:50Z | 4       | t1   |

| *_field | _measurement  | _time                | _value  | *tag |
| ------- | ------------- | -------------------- | ------- | ---- |
| f1      | m             | 2021-01-01T00:00:10Z | 4       | t2   |
| f1      | m             | 2021-01-01T00:00:20Z | -3      | t2   |
| f1      | m             | 2021-01-01T00:00:50Z | 1       | t2   |

| *_field | _measurement  | _time                | _value  | *tag |
| ------- | ------------- | -------------------- | ------- | ---- |
| f2      | m             | 2021-01-01T00:00:10Z | 10      | t1   |
| f2      | m             | 2021-01-01T00:00:20Z | 7       | t1   |

{{% /expand %}}
{{< /expand-wrapper >}}
