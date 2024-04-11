---
title: date.weekDay() function
description: >
  `date.weekDay()` returns the day of the week for a specified time.
  Results range from `[0 - 6]`.
menu:
  flux_v0_ref:
    name: date.weekDay
    parent: date
    identifier: date/weekDay
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L247-L247

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.weekDay()` returns the day of the week for a specified time.
Results range from `[0 - 6]`.

| Returned value | Day of the week |
| :------------: | :-------------- |
|       0        | Sunday          |
|       1        | Monday          |
|       2        | Tuesday         |
|       3        | Wednesday       |
|       4        | Thursday        |
|       5        | Friday          |
|       6        | Saturday        |

##### Function type signature

```js
(t: A, ?location: {zone: string, offset: duration}) => int where A: Timeable
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

### location

Location used to determine timezone.
Default is the `location` option.




## Examples

- [Return the day of the week for a time value](#return-the-day-of-the-week-for-a-time-value)
- [Return the day of the week for a relative duration](#return-the-day-of-the-week-for-a-relative-duration)
- [Return the current day of the week](#return-the-current-day-of-the-week)

### Return the day of the week for a time value

```js
import "date"

date.weekDay(t: 2020-02-11T12:21:03.29353494Z)// Returns 2


```


### Return the day of the week for a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.weekDay(t: -84h)// Returns 6


```


### Return the current day of the week

```js
import "date"

date.weekDay(t: now())

```

