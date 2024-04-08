---
title: boundaries.friday() function
description: >
  `boundaries.friday()` returns a record with `start` and `stop` boundary timestamps for last Friday.
menu:
  flux_v0_ref:
    name: boundaries.friday
    parent: date/boundaries
    identifier: date/boundaries/friday
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

https://github.com/influxdata/flux/blob/master/stdlib/date/boundaries/boundaries.flux#L273-L277

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`boundaries.friday()` returns a record with `start` and `stop` boundary timestamps for last Friday.

Last Friday is relative to `now()`. If today is Friday, the function returns boundaries for the previous Friday.

##### Function type signature

```js
() => {stop: time, start: time}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}


## Examples

- [Return start and stop timestamps of last Friday](#return-start-and-stop-timestamps-of-last-friday)
- [Query data collected last Friday](#query-data-collected-last-friday)

### Return start and stop timestamps of last Friday

```js
import "date/boundaries"

option location = timezone.fixed(offset: -8h)
option now = () => 2021-12-30T00:40:44Z

boundaries.friday()// Returns {start: 2021-12-24T08:00:00Z, stop:2022-12-25T08:00:00Z }


```


### Query data collected last Friday

```js
import "date/boundaries"

day = boundaries.friday()

from(bucket: "example-bucket")
    |> range(start: day.start, stop: day.stop)

```

