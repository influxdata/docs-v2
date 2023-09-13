---
title: boundaries.saturday() function
description: >
  `boundaries.saturday()` returns a record with `start` and `stop` boundary timestamps for last Saturday.
menu:
  flux_v0_ref:
    name: boundaries.saturday
    parent: experimental/date/boundaries
    identifier: experimental/date/boundaries/saturday
weight: 301
flux/v0.x/tags: [date/time]
introduced: 0.177.1
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/date/boundaries/boundaries.flux#L296-L298

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`boundaries.saturday()` returns a record with `start` and `stop` boundary timestamps for last Saturday.

Last Saturday is relative to `now()`. If today is Saturday, the function returns boundaries for the previous Saturday.

##### Function type signature

```js
() => {stop: time, start: time}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}


## Examples

- [Return start and stop timestamps of last Saturday](#return-start-and-stop-timestamps-of-last-saturday)
- [Query data collected last Saturday](#query-data-collected-last-saturday)

### Return start and stop timestamps of last Saturday

```js
import "experimental/date/boundaries"

option location = timezone.fixed(offset: -8h)
option now = () => 2021-12-30T00:40:44Z

boundaries.saturday()// Returns {start: 2022-12-25T08:00:00Z, stop:2022-12-26T08:00:00Z }


```


### Query data collected last Saturday

```js
import "experimental/date/boundaries"

day = boundaries.saturday()

from(bucket: "example-bucket")
    |> range(start: day.start, stop: day.stop)

```

