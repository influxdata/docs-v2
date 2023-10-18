---
title: bool() function
description: >
  `bool()` converts a value to a boolean type.
menu:
  flux_v0_ref:
    name: bool
    parent: universe
    identifier: universe/bool
weight: 101
flux/v0.x/tags: [type-conversions]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3142-L3142

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bool()` converts a value to a boolean type.



##### Function type signature

```js
(v: A) => bool
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to convert.




## Examples

- [Convert strings to booleans](#convert-strings-to-booleans)
- [Convert numeric values to booleans](#convert-numeric-values-to-booleans)
- [Convert all values in a column to booleans](#convert-all-values-in-a-column-to-booleans)

### Convert strings to booleans

```js
bool(v: "true")

// Returns true
bool(v: "false")// Returns false


```


### Convert numeric values to booleans

```js
bool(v: 1.0)

// Returns true
bool(v: 0.0)

// Returns false
bool(v: 1)

// Returns true
bool(v: 0)

// Returns false
bool(v: uint(v: 1))

// Returns true
bool(v: uint(v: 0))// Returns false


```


### Convert all values in a column to booleans

If converting the `_value` column to boolean types, use `toBool()`.
If converting columns other than `_value`, use `map()` to iterate over each
row and `bool()` to covert a column value to a boolean type.

```js
data
    |> map(fn: (r) => ({r with powerOn: bool(v: r.powerOn)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | powerOn  | *tag |
| -------------------- | -------- | ---- |
| 2021-01-01T00:00:00Z | 1        | t1   |
| 2021-01-01T00:00:10Z | 1        | t1   |
| 2021-01-01T00:00:20Z | 0        | t1   |
| 2021-01-01T00:00:30Z | 1        | t1   |
| 2021-01-01T00:00:40Z | 0        | t1   |
| 2021-01-01T00:00:50Z | 0        | t1   |

| _time                | powerOn  | *tag |
| -------------------- | -------- | ---- |
| 2021-01-01T00:00:00Z | 0        | t2   |
| 2021-01-01T00:00:10Z | 1        | t2   |
| 2021-01-01T00:00:20Z | 0        | t2   |
| 2021-01-01T00:00:30Z | 1        | t2   |
| 2021-01-01T00:00:40Z | 1        | t2   |
| 2021-01-01T00:00:50Z | 0        | t2   |


#### Output data

| _time                | powerOn  | *tag |
| -------------------- | -------- | ---- |
| 2021-01-01T00:00:00Z | true     | t1   |
| 2021-01-01T00:00:10Z | true     | t1   |
| 2021-01-01T00:00:20Z | false    | t1   |
| 2021-01-01T00:00:30Z | true     | t1   |
| 2021-01-01T00:00:40Z | false    | t1   |
| 2021-01-01T00:00:50Z | false    | t1   |

| _time                | powerOn  | *tag |
| -------------------- | -------- | ---- |
| 2021-01-01T00:00:00Z | false    | t2   |
| 2021-01-01T00:00:10Z | true     | t2   |
| 2021-01-01T00:00:20Z | false    | t2   |
| 2021-01-01T00:00:30Z | true     | t2   |
| 2021-01-01T00:00:40Z | true     | t2   |
| 2021-01-01T00:00:50Z | false    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
