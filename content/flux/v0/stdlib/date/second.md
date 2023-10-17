---
title: date.second() function
description: >
  `date.second()` returns the second of a specified time. Results range from `[0 - 59]`.
menu:
  flux_v0_ref:
    name: date.second
    parent: date
    identifier: date/second
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L49-L49

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.second()` returns the second of a specified time. Results range from `[0 - 59]`.



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

- [Return the second of a time value](#return-the-second-of-a-time-value)
- [Return the second of a relative duration](#return-the-second-of-a-relative-duration)
- [Return the current second](#return-the-current-second)

### Return the second of a time value

```js
import "date"

date.second(t: 2020-02-11T12:21:03.29353494Z)// Returns 3


```


### Return the second of a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.second(t: -50s)// Returns 28


```


### Return the current second

```js
import "date"

date.second(t: now())

```

