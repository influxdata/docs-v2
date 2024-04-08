---
title: date.minute() function
description: >
  `date.minute()` returns the minute of a specified time. Results range from `[0 - 59]`.
menu:
  flux_v0_ref:
    name: date.minute
    parent: date
    identifier: date/minute
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L140-L140

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.minute()` returns the minute of a specified time. Results range from `[0 - 59]`.



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

- [Return the minute of a time value](#return-the-minute-of-a-time-value)
- [Return the minute of a relative duration](#return-the-minute-of-a-relative-duration)
- [Return the current minute](#return-the-current-minute)

### Return the minute of a time value

```js
import "date"

date.minute(t: 2020-02-11T12:21:03.29353494Z)// Returns 21


```


### Return the minute of a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.minute(t: -45m)// Returns 6


```


### Return the current minute

```js
import "date"

date.minute(t: now())

```

