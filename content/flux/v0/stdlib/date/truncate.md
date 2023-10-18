---
title: date.truncate() function
description: >
  `date.truncate()` returns a time truncated to the specified duration unit.
menu:
  flux_v0_ref:
    name: date.truncate
    parent: date
    identifier: date/truncate
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L894-L894

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.truncate()` returns a time truncated to the specified duration unit.



##### Function type signature

```js
(t: A, unit: duration, ?location: {zone: string, offset: duration}) => time where A: Timeable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### t
({{< req >}})
Time to operate on.

Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

### unit
({{< req >}})
Unit of time to truncate to.

Only use 1 and the unit of time to specify the unit.
For example: `1s`, `1m`, `1h`.

### location

Location used to determine timezone.
Default is the `location` option.




## Examples

- [Truncate time values](#truncate-time-values)
- [Truncate time values using relative durations](#truncate-time-values-using-relative-durations)
- [Query data from this year](#query-data-from-this-year)
- [Query data from this calendar month](#query-data-from-this-calendar-month)

### Truncate time values

```js
import "date"
import "timezone"

option location = timezone.location(name: "Europe/Madrid")

date.truncate(t: 2019-06-03T13:59:01Z, unit: 1s)

// Returns 2019-06-03T13:59:01.000000000Z
date.truncate(t: 2019-06-03T13:59:01Z, unit: 1m)

// Returns 2019-06-03T13:59:00.000000000Z
date.truncate(t: 2019-06-03T13:59:01Z, unit: 1h)

// Returns 2019-06-03T13:00:00.000000000Z
date.truncate(t: 2019-06-03T13:59:01Z, unit: 1d)

// Returns 2019-06-02T22:00:00.000000000Z
date.truncate(t: 2019-06-03T13:59:01Z, unit: 1mo)

// Returns 2019-05-31T22:00:00.000000000Z
date.truncate(t: 2019-06-03T13:59:01Z, unit: 1y)// Returns 2018-12-31T23:00:00.000000000Z


```


### Truncate time values using relative durations

```js
import "date"

option now = () => 2020-01-01T00:00:30.5Z

date.truncate(t: -30s, unit: 1s)

// Returns 2019-12-31T23:59:30.000000000Z
date.truncate(t: -1m, unit: 1m)

// Returns 2019-12-31T23:59:00.000000000Z
date.truncate(t: -1h, unit: 1h)// Returns 2019-12-31T23:00:00.000000000Z


```


### Query data from this year

```js
import "date"

from(bucket: "example-bucket")
    |> range(start: date.truncate(t: now(), unit: 1y))

```


### Query data from this calendar month

```js
import "date"

from(bucket: "example-bucket")
    |> range(start: date.truncate(t: now(), unit: 1mo))

```

