---
title: time() function
description: >
  `time()` converts a value to a time type.
menu:
  flux_0_x_ref:
    name: time
    parent: universe
    identifier: universe/time
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3381-L3381

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`time()` converts a value to a time type.



##### Function type signature

```js
(v: A) => time
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to convert.

Strings must be valid [RFC3339 timestamps](/influxdb/cloud/reference/glossary/#rfc3339-timestamp).
Integer and unsigned integer values are parsed as nanosecond epoch timestamps.


## Examples

- [Convert a string to a time value](#convert-a-string-to-a-time-value)
- [Convert an integer to a time value](#convert-an-integer-to-a-time-value)
- [Convert all values in a column to time](#convert-all-values-in-a-column-to-time)

### Convert a string to a time value

```js
time(v: "2021-01-01T00:00:00Z")// Returns 2021-01-01T00:00:00Z (time)


```


### Convert an integer to a time value

```js
time(v: 1640995200000000000)// Returns 2022-01-01T00:00:00Z


```


### Convert all values in a column to time

If converting the `_value` column to time types, use `toTime()`.
If converting columns other than `_value`, use `map()` to iterate over each
row and `time()` to covert a column value to a time type.

```js
data
    |> map(fn: (r) => ({r with exampleCol: time(v: r.exampleCol)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value  | *tag | exampleCol  |
| -------------------- | ------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | -2      | t1   | -2000000000 |
| 2021-01-01T00:00:10Z | 10      | t1   | 10000000000 |
| 2021-01-01T00:00:20Z | 7       | t1   | 7000000000  |
| 2021-01-01T00:00:30Z | 17      | t1   | 17000000000 |
| 2021-01-01T00:00:40Z | 15      | t1   | 15000000000 |
| 2021-01-01T00:00:50Z | 4       | t1   | 4000000000  |

| _time                | _value  | *tag | exampleCol  |
| -------------------- | ------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | 19      | t2   | 19000000000 |
| 2021-01-01T00:00:10Z | 4       | t2   | 4000000000  |
| 2021-01-01T00:00:20Z | -3      | t2   | -3000000000 |
| 2021-01-01T00:00:30Z | 19      | t2   | 19000000000 |
| 2021-01-01T00:00:40Z | 13      | t2   | 13000000000 |
| 2021-01-01T00:00:50Z | 1       | t2   | 1000000000  |


#### Output data

| _time                | _value  | exampleCol           | *tag |
| -------------------- | ------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | -2      | 1969-12-31T23:59:58Z | t1   |
| 2021-01-01T00:00:10Z | 10      | 1970-01-01T00:00:10Z | t1   |
| 2021-01-01T00:00:20Z | 7       | 1970-01-01T00:00:07Z | t1   |
| 2021-01-01T00:00:30Z | 17      | 1970-01-01T00:00:17Z | t1   |
| 2021-01-01T00:00:40Z | 15      | 1970-01-01T00:00:15Z | t1   |
| 2021-01-01T00:00:50Z | 4       | 1970-01-01T00:00:04Z | t1   |

| _time                | _value  | exampleCol           | *tag |
| -------------------- | ------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 19      | 1970-01-01T00:00:19Z | t2   |
| 2021-01-01T00:00:10Z | 4       | 1970-01-01T00:00:04Z | t2   |
| 2021-01-01T00:00:20Z | -3      | 1969-12-31T23:59:57Z | t2   |
| 2021-01-01T00:00:30Z | 19      | 1970-01-01T00:00:19Z | t2   |
| 2021-01-01T00:00:40Z | 13      | 1970-01-01T00:00:13Z | t2   |
| 2021-01-01T00:00:50Z | 1       | 1970-01-01T00:00:01Z | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
