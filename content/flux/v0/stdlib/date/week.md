---
title: date.week() function
description: >
  `date.week()` returns the ISO week of the year for a specified time.
  Results range from `[1 - 53]`.
menu:
  flux_v0_ref:
    name: date.week
    parent: date
    identifier: date/week
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L505-L505

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.week()` returns the ISO week of the year for a specified time.
Results range from `[1 - 53]`.



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

- [Return the week of the year](#return-the-week-of-the-year)
- [Return the week of the year using a relative duration](#return-the-week-of-the-year-using-a-relative-duration)
- [Return the current week of the year](#return-the-current-week-of-the-year)

### Return the week of the year

```js
import "date"

date.week(t: 2020-02-11T12:21:03.29353494Z)// Returns 7


```


### Return the week of the year using a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.week(t: -12d)// Returns 42


```


### Return the current week of the year

```js
import "date"

date.week(t: now())

```

