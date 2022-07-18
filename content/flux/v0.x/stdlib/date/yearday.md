---
title: date.yearDay() function
description: >
  `date.yearDay()` returns the day of the year for a specified time.
  Results can include leap days and range from `[1 - 366]`.
menu:
  flux_0_x_ref:
    name: date.yearDay
    parent: date
    identifier: date/yearDay
weight: 101
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/yearday/
  - /influxdb/v2.0/reference/flux/stdlib/date/yearday/
  - /influxdb/cloud/reference/flux/stdlib/date/yearday/
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L281-L281

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.yearDay()` returns the day of the year for a specified time.
Results can include leap days and range from `[1 - 366]`.



##### Function type signature

```js
(t: A, ?location: {zone: string, offset: duration}) => int where A: Timeable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

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

- [Return the day of the year for a time value](#return-the-day-of-the-year-for-a-time-value)
- [Return the day of the year for a relative duration](#return-the-day-of-the-year-for-a-relative-duration)

### Return the day of the year for a time value

```js
import "date"

date.yearDay(t: 2020-02-11T12:21:03.29353494Z)// Returns 42


```


### Return the day of the year for a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.yearDay(t: -1mo)// Returns 276


```

