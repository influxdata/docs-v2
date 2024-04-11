---
title: date.microsecond() function
description: >
  `date.microsecond()` returns the microseconds for a specified time.
  Results range `from [0-999999]`.
menu:
  flux_v0_ref:
    name: date.microsecond
    parent: date
    identifier: date/microsecond
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L639-L639

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.microsecond()` returns the microseconds for a specified time.
Results range `from [0-999999]`.



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

- [Return the microsecond of a time value](#return-the-microsecond-of-a-time-value)
- [Return the microsecond of a relative duration](#return-the-microsecond-of-a-relative-duration)
- [Return the current microsecond unit](#return-the-current-microsecond-unit)

### Return the microsecond of a time value

```js
import "date"

date.microsecond(t: 2020-02-11T12:21:03.29353494Z)// Returns 293534


```


### Return the microsecond of a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.microsecond(t: -1890us)// Returns 322661


```


### Return the current microsecond unit

```js
import "date"

date.microsecond(t: now())

```

