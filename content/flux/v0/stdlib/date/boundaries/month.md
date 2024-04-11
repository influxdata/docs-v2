---
title: boundaries.month() function
description: >
  `boundaries.month()` returns a record with `start` and `stop` boundary timestamps for the current month.
menu:
  flux_v0_ref:
    name: boundaries.month
    parent: date/boundaries
    identifier: date/boundaries/month
weight: 201
flux/v0/tags: [date/time]
deprecated: 0.177.1
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/boundaries/boundaries.flux#L406-L414

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`boundaries.month()` returns a record with `start` and `stop` boundary timestamps for the current month.

`now()` determines the current month.

##### Function type signature

```js
(?month_offset: int) => {stop: time, start: time}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### month_offset

Number of months to offset from the current month. Default is `0`.

Use a negative offset to return boundaries from previous months.
Use a positive offset to return boundaries for future months.


## Examples

- [Return start and stop timestamps for the current month](#return-start-and-stop-timestamps-for-the-current-month)
- [Query data from this month](#query-data-from-this-month)
- [Query data from last month](#query-data-from-last-month)

### Return start and stop timestamps for the current month

```js
import "date/boundaries"

option now = () => 2022-05-10T10:10:00Z

boundaries.month(

)// Returns {start:2022-05-01T00:00:00.000000000Z, stop:2022-06-01T00:00:00.000000000Z}


```


### Query data from this month

```js
import "date/boundaries"

thisMonth = boundaries.month()

from(bucket: "example-bucket")
    |> range(start: thisMonth.start, stop: thisMonth.stop)

```


### Query data from last month

```js
import "date/boundaries"

lastMonth = boundaries.month(month_offset: -1)

from(bucket: "example-bucket")
    |> range(start: lastMonth.start, stop: lastMonth.stop)

```

