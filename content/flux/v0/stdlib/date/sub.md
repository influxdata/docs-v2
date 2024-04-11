---
title: date.sub() function
description: >
  `date.sub()` subtracts a duration from a time value and returns the resulting time value.
menu:
  flux_v0_ref:
    name: date.sub
    parent: date
    identifier: date/sub
weight: 101
flux/v0/tags: [date/time]
introduced: 0.162.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L807-L807

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.sub()` subtracts a duration from a time value and returns the resulting time value.



##### Function type signature

```js
(d: duration, from: A, ?location: {zone: string, offset: duration}) => time where A: Timeable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### from
({{< req >}})
Time to subtract the duration from.

Use an absolute time or a relative duration.
Durations are relative to `now()`.

### d
({{< req >}})
Duration to subtract.



### location

Location to use for the time value.




## Examples

- [Subtract six hours from a timestamp](#subtract-six-hours-from-a-timestamp)
- [Subtract six hours from a relative duration](#subtract-six-hours-from-a-relative-duration)
- [Subtract two days from one hour ago](#subtract-two-days-from-one-hour-ago)

### Subtract six hours from a timestamp

```js
import "date"

date.sub(from: 2019-09-16T12:00:00Z, d: 6h)// Returns 2019-09-16T06:00:00.000000000Z


```


### Subtract six hours from a relative duration

```js
import "date"

option now = () => 2022-01-01T12:00:00Z

date.sub(d: 6h, from: -3h)// Returns 2022-01-01T03:00:00.000000000Z


```


### Subtract two days from one hour ago

A time may be represented as either an explicit timestamp
or as a relative time from the current `now` time. sub can
support either type of value.

```js
import "date"

option now = () => 2021-12-10T16:27:40Z

date.sub(from: -1h, d: 2d)// Returns 2021-12-08T15:27:40Z


```

