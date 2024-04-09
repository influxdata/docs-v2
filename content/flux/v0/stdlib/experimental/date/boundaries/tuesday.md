---
title: boundaries.tuesday() function
description: >
  `boundaries.tuesday()` returns a record with `start` and `stop` boundary timestamps of last Tuesday.
menu:
  flux_v0_ref:
    name: boundaries.tuesday
    parent: experimental/date/boundaries
    identifier: experimental/date/boundaries/tuesday
weight: 301
flux/v0/tags: [date/time]
introduced: 0.177.1
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/date/boundaries/boundaries.flux#L149-L151

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`boundaries.tuesday()` returns a record with `start` and `stop` boundary timestamps of last Tuesday.

Last Tuesday is relative to `now()`. If today is Tuesday, the function returns boundaries for the previous Tuesday.

##### Function type signature

```js
() => {stop: time, start: time}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}


## Examples

- [Return start and stop timestamps of last Tuesday](#return-start-and-stop-timestamps-of-last-tuesday)
- [Query data collected last Tuesday](#query-data-collected-last-tuesday)

### Return start and stop timestamps of last Tuesday

```js
import "experimental/date/boundaries"

option location = timezone.fixed(offset: -8h)
option now = () => 2021-12-30T00:40:44Z

boundaries.tuesday()// Returns {start: 2021-12-28T08:00:00Z, stop:2021-12-29T08:00:00Z }


```


### Query data collected last Tuesday

```js
import "experimental/date/boundaries"

day = boundaries.tuesday()

from(bucket: "example-bucket")
    |> range(start: day.start, stop: day.stop)

```

