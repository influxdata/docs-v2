---
title: duration() function
description: >
  `duration()` converts a value to a duration type.
menu:
  flux_v0_ref:
    name: duration
    parent: universe
    identifier: universe/duration
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3210-L3210

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`duration()` converts a value to a duration type.

`duration()` treats integers and unsigned integers as nanoseconds.
For a string to be converted to a duration type, the string must use
duration literal representation.

##### Function type signature

```js
(v: A) => duration
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to convert.




## Examples

- [Convert a string to a duration](#convert-a-string-to-a-duration)
- [Convert numeric types to durations](#convert-numeric-types-to-durations)
- [Convert values in a column to durations](#convert-values-in-a-column-to-durations)

### Convert a string to a duration

```js
duration(v: "1h20m")// Returns 1h20m


```


### Convert numeric types to durations

```js
duration(v: 4800000000000)

// Returns 1h20m
duration(v: uint(v: 9600000000000))// Returns 2h40m


```


### Convert values in a column to durations

Flux does not support duration column types.
To store durations in a column, convert duration types to strings.

```js
data
    |> map(fn: (r) => ({r with _value: string(v: duration(v: r._value))}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | tag  | _value    |
| -------------------- | ---- | --------- |
| 2022-01-01T05:00:00Z | t1   | -27000000 |
| 2022-01-01T09:00:10Z | t1   | 12000000  |
| 2022-01-01T11:00:20Z | t1   | 78000000  |
| 2022-01-01T16:00:30Z | t1   | 17000000  |
| 2022-01-01T19:00:40Z | t1   | 15000000  |
| 2022-01-01T20:00:50Z | t1   | -42000000 |


#### Output data

| _time                | _value  | tag  |
| -------------------- | ------- | ---- |
| 2022-01-01T05:00:00Z | -27ms   | t1   |
| 2022-01-01T09:00:10Z | 12ms    | t1   |
| 2022-01-01T11:00:20Z | 78ms    | t1   |
| 2022-01-01T16:00:30Z | 17ms    | t1   |
| 2022-01-01T19:00:40Z | 15ms    | t1   |
| 2022-01-01T20:00:50Z | -42ms   | t1   |

{{% /expand %}}
{{< /expand-wrapper >}}
