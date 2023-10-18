---
title: date.monthDay() function
description: >
  `date.monthDay()` returns the day of the month for a specified time.
  Results range from `[1 - 31]`.
menu:
  flux_v0_ref:
    name: date.monthDay
    parent: date
    identifier: date/monthDay
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L296-L296

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.monthDay()` returns the day of the month for a specified time.
Results range from `[1 - 31]`.



##### Function type signature

```js
(t: A, ?location: {zone: string, offset: duration}) => int where A: Timeable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### t
({{< req >}})
Time to operate on.

Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

### location

Location used to determine timezone.
Default is the `location` option.




## Examples

- [Return the day of the month for a time value](#return-the-day-of-the-month-for-a-time-value)
- [Return the day of the month for a relative duration](#return-the-day-of-the-month-for-a-relative-duration)
- [Return the current day of the month](#return-the-current-day-of-the-month)

### Return the day of the month for a time value

```js
import "date"

date.monthDay(t: 2020-02-11T12:21:03.29353494Z)// Returns 11


```


### Return the day of the month for a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.monthDay(t: -8d)// Returns 25


```


### Return the current day of the month

```js
import "date"

date.monthDay(t: now())

```

