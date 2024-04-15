---
title: int() function
description: >
  `int()` converts a value to an integer type.
menu:
  flux_v0_ref:
    name: int
    parent: universe
    identifier: universe/int
weight: 101
flux/v0/tags: [type-conversions]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3314-L3314

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`int()` converts a value to an integer type.

`int()` behavior depends on the input data type:

| Input type | Returned value                                  |
| :--------- | :---------------------------------------------- |
| string     | Integer equivalent of the numeric string        |
| bool       | 1 (true) or 0 (false)                           |
| duration   | Number of nanoseconds in the specified duration |
| time       | Equivalent nanosecond epoch timestamp           |
| float      | Value truncated at the decimal                  |
| uint       | Integer equivalent of the unsigned integer      |

##### Function type signature

```js
(v: A) => int
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to convert.




## Examples

- [Convert basic types to integers](#convert-basic-types-to-integers)
- [Convert all values in a column to integers](#convert-all-values-in-a-column-to-integers)

### Convert basic types to integers

```js
int(v: 10.12)

// Returns 10
int(v: "3")

// Returns 3
int(v: true)

// Returns 1
int(v: 1m)

// Returns 160000000000
int(v: 2022-01-01T00:00:00Z)// Returns 1640995200000000000


```


### Convert all values in a column to integers

If converting the `_value` column to integer types, use `toInt()`.
If converting columns other than `_value`, use `map()` to iterate over each
row and `int()` to convert a column value to a integer type.

```js
data
    |> map(fn: (r) => ({r with exampleCol: int(v: r.exampleCol)}))

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
