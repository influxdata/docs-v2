---
title: boundaries.thursday() function
description: >
  `boundaries.thursday()` returns a record with `start` and `stop` boundary timestamps for last Thursday.
menu:
  flux_v0_ref:
    name: boundaries.thursday
    parent: date/boundaries
    identifier: date/boundaries/thursday
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

https://github.com/influxdata/flux/blob/master/stdlib/date/boundaries/boundaries.flux#L234-L238

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`boundaries.thursday()` returns a record with `start` and `stop` boundary timestamps for last Thursday.

Last Thursday is relative to `now()`. If today is Thursday, the function returns boundaries for the previous Thursday.

##### Function type signature

```js
() => {stop: time, start: time}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}


## Examples

- [Return start and stop timestamps of last Thursday](#return-start-and-stop-timestamps-of-last-thursday)
- [Query data collected last Thursday](#query-data-collected-last-thursday)

### Return start and stop timestamps of last Thursday

```js
import "date/boundaries"

option location = timezone.fixed(offset: -8h)
option now = () => 2021-12-30T00:40:44Z

boundaries.thursday()// Returns {start: 2021-12-23T08:00:00Z, stop:2021-12-24T08:00:00Z }


```


### Query data collected last Thursday

```js
import "date/boundaries"

day = boundaries.thursday()

from(bucket: "example-bucket")
    |> range(start: day.start, stop: day.stop)

```

