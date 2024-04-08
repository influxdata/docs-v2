---
title: date.month() function
description: >
  `date.month()` returns the month of a specified time. Results range from `[1 - 12]`.
menu:
  flux_v0_ref:
    name: date.month
    parent: date
    identifier: date/month
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L408-L408

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.month()` returns the month of a specified time. Results range from `[1 - 12]`.

| Returned value | Month     |
| :------------: | :-------- |
|       1        | January   |
|       2        | February  |
|       3        | March     |
|       4        | April     |
|       5        | May       |
|       6        | June      |
|       7        | July      |
|       8        | August    |
|       9        | September |
|       10       | October   |
|       11       | November  |
|       12       | December  |

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

- [Return the month of a time value](#return-the-month-of-a-time-value)
- [Return the month of a relative duration](#return-the-month-of-a-relative-duration)
- [Return the current numeric month](#return-the-current-numeric-month)

### Return the month of a time value

```js
import "date"

date.month(t: 2020-02-11T12:21:03.29353494Z)// Returns 2


```


### Return the month of a relative duration

```js
import "date"

option now = () => 2020-02-11T12:21:03.29353494Z

date.month(t: -3mo)// Returns 8


```


### Return the current numeric month

```js
import "date"

date.month(t: now())

```

