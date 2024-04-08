---
title: date.hour() function
description: >
  `date.hour()` returns the hour of a specified time. Results range from `[0 - 23]`.
menu:
  flux_v0_ref:
    name: date.hour
    parent: date
    identifier: date/hour
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L188-L188

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.hour()` returns the hour of a specified time. Results range from `[0 - 23]`.



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

- [Return the hour of a time value](#return-the-hour-of-a-time-value)
- [Return the hour of a relative duration](#return-the-hour-of-a-relative-duration)
- [Return the current hour](#return-the-current-hour)

### Return the hour of a time value

```js
import "date"

date.hour(t: 2020-02-11T12:21:03.29353494Z)// Returns 12


```


### Return the hour of a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.hour(t: -8h)// Returns 7


```


### Return the current hour

```js
import "date"

date.hour(t: now())

```

