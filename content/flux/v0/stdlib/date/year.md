---
title: date.year() function
description: >
  `date.year()` returns the year of a specified time.
menu:
  flux_v0_ref:
    name: date.year
    parent: date
    identifier: date/year
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L456-L456

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.year()` returns the year of a specified time.



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

- [Return the year for a time value](#return-the-year-for-a-time-value)
- [Return the year for a relative duration](#return-the-year-for-a-relative-duration)
- [Return the current year](#return-the-current-year)

### Return the year for a time value

```js
import "date"

date.year(t: 2020-02-11T12:21:03.29353494Z)// Returns 2020


```


### Return the year for a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.year(t: -14y)// Returns 2007


```


### Return the current year

```js
import "date"

date.year(t: now())

```

