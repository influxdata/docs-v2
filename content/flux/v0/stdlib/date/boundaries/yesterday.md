---
title: boundaries.yesterday() function
description: >
  `boundaries.yesterday()` returns a record with `start` and `stop` boundary timestamps for yesterday.
menu:
  flux_v0_ref:
    name: boundaries.yesterday
    parent: date/boundaries
    identifier: date/boundaries/yesterday
weight: 201
flux/v0/tags: [date/time]
introduced: 0.172.0
deprecated: 0.177.1
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/boundaries/boundaries.flux#L48-L52

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`boundaries.yesterday()` returns a record with `start` and `stop` boundary timestamps for yesterday.

Yesterday is relative to `now()`.

##### Function type signature

```js
() => {stop: time, start: time}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}


## Examples

- [Return start and stop timestamps of yesterday](#return-start-and-stop-timestamps-of-yesterday)
- [Query data from yesterday](#query-data-from-yesterday)

### Return start and stop timestamps of yesterday

```js
import "date/boundaries"

option now = () => 2022-01-02T13:45:28Z

boundaries.yesterday(

)// Returns {start: 2022-01-01T00:00:00.000000000Z, stop: 2022-01-02T00:00:00.000000000Z}


```


### Query data from yesterday

```js
import "date/boundaries"

day = boundaries.yesterday()

from(bucket: "example-bucket")
    |> range(start: day.start, stop: day.stop)

```

