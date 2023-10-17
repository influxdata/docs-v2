---
title: boundaries.sunday() function
description: >
  `boundaries.sunday()` returns a record with `start` and `stop` boundary timestamps for last Sunday.
menu:
  flux_v0_ref:
    name: boundaries.sunday
    parent: date/boundaries
    identifier: date/boundaries/sunday
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

https://github.com/influxdata/flux/blob/master/stdlib/date/boundaries/boundaries.flux#L351-L355

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`boundaries.sunday()` returns a record with `start` and `stop` boundary timestamps for last Sunday.

Last Sunday is relative to `now()`. If today is Sunday, the function returns boundaries for the previous Sunday.

##### Function type signature

```js
() => {stop: time, start: time}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}


## Examples

- [Return start and stop timestamps of last Sunday](#return-start-and-stop-timestamps-of-last-sunday)
- [Query data collected last Sunday](#query-data-collected-last-sunday)

### Return start and stop timestamps of last Sunday

```js
import "date/boundaries"

option location = timezone.fixed(offset: -8h)
option now = () => 2021-12-30T00:40:44Z

boundaries.sunday()// Returns {start: 2021-12-26T08:00:00Z, stop:2021-12-27T08:00:00Z }


```


### Query data collected last Sunday

```js
import "date/boundaries"

day = boundaries.sunday()

from(bucket: "example-bucket")
    |> range(start: day.start, stop: day.stop)

```

