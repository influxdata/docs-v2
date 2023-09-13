---
title: uint() function
description: >
  `uint()` converts a value to an unsigned integer type.
menu:
  flux_v0_ref:
    name: uint
    parent: universe
    identifier: universe/uint
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3442-L3442

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`uint()` converts a value to an unsigned integer type.

`uint()` behavior depends on the input data type:

| Input type | Returned value                                                  |
| :--------- | :-------------------------------------------------------------- |
| bool       | 1 (true) or 0 (false)                                           |
| duration   | Number of nanoseconds in the specified duration                 |
| float      | UInteger equivalent of the float value truncated at the decimal |
| int        | UInteger equivalent of the integer                              |
| string     | UInteger equivalent of the numeric string                       |
| time       | Equivalent nanosecond epoch timestamp                           |

##### Function type signature

```js
(v: A) => uint
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to convert.




## Examples

- [Convert basic types to unsigned integers](#convert-basic-types-to-unsigned-integers)
- [Convert all values in a column to unsigned integers](#convert-all-values-in-a-column-to-unsigned-integers)

### Convert basic types to unsigned integers

```js
uint(v: "3")

// Returns 3
uint(v: 1m)

// Returns 160000000000
uint(v: 2022-01-01T00:00:00Z)

// Returns 1640995200000000000
uint(v: 10.12)

// Returns 10
uint(v: -100)// Returns 18446744073709551516


```


### Convert all values in a column to unsigned integers

If converting the `_value` column to uint types, use `toUInt()`.
If converting columns other than `_value`, use `map()` to iterate over each
row and `uint()` to covert a column value to a uint type.

```js
data
    |> map(fn: (r) => ({r with exampleCol: uint(v: r.exampleCol)}))

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

| _time                | exampleCol           | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 18446744073709551614 | t1   |
| 2021-01-01T00:00:10Z | 10                   | t1   |
| 2021-01-01T00:00:20Z | 7                    | t1   |
| 2021-01-01T00:00:30Z | 17                   | t1   |
| 2021-01-01T00:00:40Z | 15                   | t1   |
| 2021-01-01T00:00:50Z | 4                    | t1   |

| _time                | exampleCol           | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 19                   | t2   |
| 2021-01-01T00:00:10Z | 4                    | t2   |
| 2021-01-01T00:00:20Z | 18446744073709551613 | t2   |
| 2021-01-01T00:00:30Z | 19                   | t2   |
| 2021-01-01T00:00:40Z | 13                   | t2   |
| 2021-01-01T00:00:50Z | 1                    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
