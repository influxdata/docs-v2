---
title: date.millisecond() function
description: >
  `date.millisecond()` returns the milliseconds for a specified time.
  Results range from `[0-999]`.
menu:
  flux_v0_ref:
    name: date.millisecond
    parent: date
    identifier: date/millisecond
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L596-L596

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.millisecond()` returns the milliseconds for a specified time.
Results range from `[0-999]`.



##### Function type signature

```js
(t: A) => int where A: Timeable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### t
({{< req >}})
Time to operate on.

Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.


## Examples

- [Return the millisecond of the time value](#return-the-millisecond-of-the-time-value)
- [Return the millisecond of a relative duration](#return-the-millisecond-of-a-relative-duration)
- [Return the current millisecond unit](#return-the-current-millisecond-unit)

### Return the millisecond of the time value

```js
import "date"

date.millisecond(t: 2020-02-11T12:21:03.29353494Z)// Returns 293


```


### Return the millisecond of a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.millisecond(t: -150ms)// Returns 127


```


### Return the current millisecond unit

```js
import "date"

date.millisecond(t: now())

```

