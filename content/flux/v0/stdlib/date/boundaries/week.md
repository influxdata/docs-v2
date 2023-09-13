---
title: boundaries.week() function
description: >
  `boundaries.week()` returns a record with `start` and `stop` boundary timestamps of the current week.
  By default, weeks start on Monday.
menu:
  flux_v0_ref:
    name: boundaries.week
    parent: date/boundaries
    identifier: date/boundaries/week
weight: 201
flux/v0.x/tags: [date/time]
deprecated: 0.177.1
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/boundaries/boundaries.flux#L479-L495

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`boundaries.week()` returns a record with `start` and `stop` boundary timestamps of the current week.
By default, weeks start on Monday.



##### Function type signature

```js
(?start_sunday: bool, ?week_offset: int) => {stop: time, start: time}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### start_sunday

Indicate if the week starts on Sunday. Default is `false`.

When set to `false`, the week starts on Monday.

### week_offset

Number of weeks to offset from the current week. Default is `0`.

Use a negative offset to return boundaries from previous weeks.
Use a positive offset to return boundaries for future weeks.


## Examples

- [Return start and stop timestamps of the current week starting on Monday](#return-start-and-stop-timestamps-of-the-current-week-starting-on-monday)
- [Return start and stop timestamps of the current week starting on Sunday](#return-start-and-stop-timestamps-of-the-current-week-starting-on-sunday)
- [Query data from the current week](#query-data-from-the-current-week)
- [Query data from last week](#query-data-from-last-week)

### Return start and stop timestamps of the current week starting on Monday

```js
import "date/boundaries"

option now = () => 2022-05-10T00:00:00.00001Z

boundaries.week(

)// Returns {start: 2022-05-09T00:00:00.000000000Z, stop: 2022-05-16T00:00:00.000000000Z}


```


### Return start and stop timestamps of the current week starting on Sunday

```js
import "date/boundaries"

option now = () => 2022-05-10T10:10:00Z

boundaries.week(
    start_sunday: true,
)// Returns {start: 2022-05-08T00:00:00.000000000Z, stop: 2022-05-14T00:00:00.000000000Z}


```


### Query data from the current week

```js
import "date/boundaries"

thisWeek = boundaries.week()

from(bucket: "example-bucket")
    |> range(start: thisWeek.start, stop: thisWeek.stop)

```


### Query data from last week

```js
import "date/boundaries"

lastWeek = boundaries.week(week_offset: -1)

from(bucket: "example-bucket")
    |> range(start: lastWeek.start, stop: lastWeek.stop)

```

