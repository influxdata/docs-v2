---
title: date.quarter() function
description: >
  `date.quarter()` returns the quarter for a specified time. Results range from `[1-4]`.
menu:
  flux_v0_ref:
    name: date.quarter
    parent: date
    identifier: date/quarter
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L553-L553

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.quarter()` returns the quarter for a specified time. Results range from `[1-4]`.



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

- [Return the quarter for a time value](#return-the-quarter-for-a-time-value)
- [Return the quarter for a relative duration](#return-the-quarter-for-a-relative-duration)
- [Return the current quarter](#return-the-current-quarter)

### Return the quarter for a time value

```js
import "date"

date.quarter(t: 2020-02-11T12:21:03.29353494Z)// Returns 1


```


### Return the quarter for a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.quarter(t: -7mo)// Returns 2


```


### Return the current quarter

```js
import "date"

date.quarter(t: now())

```

