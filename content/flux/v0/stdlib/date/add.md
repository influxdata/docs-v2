---
title: date.add() function
description: >
  `date.add()` adds a duration to a time value and returns the resulting time value.
menu:
  flux_v0_ref:
    name: date.add
    parent: date
    identifier: date/add
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

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L744-L744

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.add()` adds a duration to a time value and returns the resulting time value.



##### Function type signature

```js
(d: duration, to: A, ?location: {zone: string, offset: duration}) => time where A: Timeable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### d
({{< req >}})
Duration to add.



### to
({{< req >}})
Time to add the duration to.



### location

Location to use for the time value.

Use an absolute time or a relative duration.
Durations are relative to `now()`.


## Examples

- [Add six hours to a timestamp](#add-six-hours-to-a-timestamp)
- [Add one month to yesterday](#add-one-month-to-yesterday)
- [Add six hours to a relative duration](#add-six-hours-to-a-relative-duration)

### Add six hours to a timestamp

```js
import "date"

date.add(d: 6h, to: 2019-09-16T12:00:00Z)// Returns 2019-09-16T18:00:00.000000000Z


```


### Add one month to yesterday

A time may be represented as either an explicit timestamp
or as a relative time from the current `now` time. add can
support either type of value.

```js
import "date"

option now = () => 2021-12-10T16:27:40Z

date.add(d: 1mo, to: -1d)// Returns 2022-01-09T16:27:40Z


```


### Add six hours to a relative duration

```js
import "date"

option now = () => 2022-01-01T12:00:00Z

date.add(d: 6h, to: 3h)// Returns 2022-01-01T21:00:00.000000000Z


```

