---
title: float() function
description: >
  `float()` converts a value to a float type.
menu:
  flux_v0_ref:
    name: float
    parent: universe
    identifier: universe/float
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3254-L3254

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`float()` converts a value to a float type.



##### Function type signature

```js
(v: A) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to convert.




## Examples

- [Convert a string to a float](#convert-a-string-to-a-float)
- [Convert a scientific notation string to a float](#convert-a-scientific-notation-string-to-a-float)
- [Convert an integer to a float](#convert-an-integer-to-a-float)
- [Convert all values in a column to floats](#convert-all-values-in-a-column-to-floats)

### Convert a string to a float

```js
float(v: "3.14")// Returns 3.14


```


### Convert a scientific notation string to a float

```js
float(v: "1.23e+20")// Returns 1.23e+20 (float)


```


### Convert an integer to a float

```js
float(v: "10")// Returns 10.0


```


### Convert all values in a column to floats

If converting the `_value` column to float types, use `toFloat()`.
If converting columns other than `_value`, use `map()` to iterate over each
row and `float()` to covert a column value to a float type.

```js
data
    |> map(fn: (r) => ({r with exampleCol: float(v: r.exampleCol)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | exampleCol  | *tag |
| -------------------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | -2          | t1   |
| 2021-01-01T00:00:10Z | 10          | t1   |
| 2021-01-01T00:00:20Z | 7           | t1   |
| 2021-01-01T00:00:30Z | 17          | t1   |
| 2021-01-01T00:00:40Z | 15          | t1   |
| 2021-01-01T00:00:50Z | 4           | t1   |

| _time                | exampleCol  | *tag |
| -------------------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | 19          | t2   |
| 2021-01-01T00:00:10Z | 4           | t2   |
| 2021-01-01T00:00:20Z | -3          | t2   |
| 2021-01-01T00:00:30Z | 19          | t2   |
| 2021-01-01T00:00:40Z | 13          | t2   |
| 2021-01-01T00:00:50Z | 1           | t2   |


#### Output data

| _time                | exampleCol  | *tag |
| -------------------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | -2          | t1   |
| 2021-01-01T00:00:10Z | 10          | t1   |
| 2021-01-01T00:00:20Z | 7           | t1   |
| 2021-01-01T00:00:30Z | 17          | t1   |
| 2021-01-01T00:00:40Z | 15          | t1   |
| 2021-01-01T00:00:50Z | 4           | t1   |

| _time                | exampleCol  | *tag |
| -------------------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | 19          | t2   |
| 2021-01-01T00:00:10Z | 4           | t2   |
| 2021-01-01T00:00:20Z | -3          | t2   |
| 2021-01-01T00:00:30Z | 19          | t2   |
| 2021-01-01T00:00:40Z | 13          | t2   |
| 2021-01-01T00:00:50Z | 1           | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
