---
title: date.time() function
description: >
  `date.time()` returns the time value of a specified relative duration or time.
menu:
  flux_v0_ref:
    name: date.time
    parent: date
    identifier: date/time
weight: 101

introduced: 0.172.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L93-L93

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.time()` returns the time value of a specified relative duration or time.

`date.time` assumes duration values are relative to `now()`.

##### Function type signature

```js
(t: A, ?location: {zone: string, offset: duration}) => time where A: Timeable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### t
({{< req >}})
Duration or time value.

Use an absolute time or relative duration.
Durations are relative to `now()`.

### location

Location used to determine timezone.
Default is the `location` option.




## Examples

- [Return the time for a given time](#return-the-time-for-a-given-time)
- [Return the time for a given relative duration](#return-the-time-for-a-given-relative-duration)

### Return the time for a given time

```js
import "date"

date.time(t: 2020-02-11T12:21:03.29353494Z)// Returns 2020-02-11T12:21:03.293534940Z


```


### Return the time for a given relative duration

```js
import "date"

option now = () => 2022-01-01T00:00:00Z

date.time(t: -1h)// Returns 2021-12-31T23:00:00.000000000Z


```

