---
title: boundaries.monday() function
description: >
  `boundaries.monday()` returns a record with `start` and `stop` boundary timestamps of last Monday.
  Last Monday is relative to `now()`. If today is Monday, the function returns boundaries for the previous Monday.
menu:
  flux_v0_ref:
    name: boundaries.monday
    parent: date/boundaries
    identifier: date/boundaries/monday
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

https://github.com/influxdata/flux/blob/master/stdlib/date/boundaries/boundaries.flux#L118-L122

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`boundaries.monday()` returns a record with `start` and `stop` boundary timestamps of last Monday.
Last Monday is relative to `now()`. If today is Monday, the function returns boundaries for the previous Monday.



##### Function type signature

```js
() => {stop: time, start: time}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}


## Examples

- [Return start and stop timestamps of last Monday](#return-start-and-stop-timestamps-of-last-monday)
- [Query data collected last Monday](#query-data-collected-last-monday)

### Return start and stop timestamps of last Monday

```js
import "date/boundaries"

option location = timezone.fixed(offset: -8h)
option now = () => 2021-12-30T00:40:44Z

boundaries.monday()// Returns {start: 2021-12-27T08:00:00Z, stop:2021-12-28T08:00:00Z }


```


### Query data collected last Monday

```js
import "date/boundaries"

day = boundaries.monday()

from(bucket: "example-bucket")
    |> range(start: day.start, stop: day.stop)

```

