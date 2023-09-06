---
title: date.nanosecond() function
description: >
  `date.nanosecond()` returns the nanoseconds for a specified time.
  Results range from `[0-999999999]`.
menu:
  flux_v0_ref:
    name: date.nanosecond
    parent: date
    identifier: date/nanosecond
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L682-L682

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.nanosecond()` returns the nanoseconds for a specified time.
Results range from `[0-999999999]`.



##### Function type signature

```js
(t: A) => int where A: Timeable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### t
({{< req >}})
Time to operate on.

Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.


## Examples

- [Return the nanosecond for a time value](#return-the-nanosecond-for-a-time-value)
- [Return the nanosecond for a relative duration](#return-the-nanosecond-for-a-relative-duration)
- [Return the current nanosecond unit](#return-the-current-nanosecond-unit)

### Return the nanosecond for a time value

```js
import "date"

date.nanosecond(t: 2020-02-11T12:21:03.29353494Z)// Returns 293534940


```


### Return the nanosecond for a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.nanosecond(t: -2111984ns)// Returns 128412016


```


### Return the current nanosecond unit

```js
import "date"

date.nanosecond(t: now())

```

