---
title: string() function
description: >
  `string()` converts a value to a string type.
menu:
  flux_0_x_ref:
    name: string
    parent: universe
    identifier: universe/string
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3351-L3351

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`string()` converts a value to a string type.



##### Function type signature

```js
(v: A) => string
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to convert.




## Examples

- [Convert basic types to strings](#convert-basic-types-to-strings)
- [Convert all values in a column to strings](#convert-all-values-in-a-column-to-strings)

### Convert basic types to strings

```js
string(v: true)
// Returns "true"

string(v: 1m)
// Returns "1m"

string(v: 2021-01-01T00:00:00Z)
// Returns "2021-01-01T00:00:00Z"

string(v: 10.12)
// Returns "10.12"
```


### Convert all values in a column to strings

If converting the `_value` column to string types, use `toString()`.
If converting columns other than `_value`, use `map()` to iterate over each
row and `string()` to covert a column value to a string type.

```js
data
    |> map(fn: (r) => ({r with exampleCol: string(v: r.exampleCol)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | exampleCol  |
| -------------------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | t1   | -2.18       |
| 2021-01-01T00:00:10Z | t1   | 10.92       |
| 2021-01-01T00:00:20Z | t1   | 7.35        |
| 2021-01-01T00:00:30Z | t1   | 17.53       |
| 2021-01-01T00:00:40Z | t1   | 15.23       |
| 2021-01-01T00:00:50Z | t1   | 4.43        |

| _time                | *tag | exampleCol  |
| -------------------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | t2   | 19.85       |
| 2021-01-01T00:00:10Z | t2   | 4.97        |
| 2021-01-01T00:00:20Z | t2   | -3.75       |
| 2021-01-01T00:00:30Z | t2   | 19.77       |
| 2021-01-01T00:00:40Z | t2   | 13.86       |
| 2021-01-01T00:00:50Z | t2   | 1.86        |


#### Output data

| _time                | exampleCol  | *tag |
| -------------------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | -2.18       | t1   |
| 2021-01-01T00:00:10Z | 10.92       | t1   |
| 2021-01-01T00:00:20Z | 7.35        | t1   |
| 2021-01-01T00:00:30Z | 17.53       | t1   |
| 2021-01-01T00:00:40Z | 15.23       | t1   |
| 2021-01-01T00:00:50Z | 4.43        | t1   |

| _time                | exampleCol  | *tag |
| -------------------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | 19.85       | t2   |
| 2021-01-01T00:00:10Z | 4.97        | t2   |
| 2021-01-01T00:00:20Z | -3.75       | t2   |
| 2021-01-01T00:00:30Z | 19.77       | t2   |
| 2021-01-01T00:00:40Z | 13.86       | t2   |
| 2021-01-01T00:00:50Z | 1.86        | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
