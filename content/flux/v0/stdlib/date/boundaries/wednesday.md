---
title: boundaries.wednesday() function
description: >
  `boundaries.wednesday()` returns a record with `start` and `stop` boundary timestamps for last Wednesday.
menu:
  flux_v0_ref:
    name: boundaries.wednesday
    parent: date/boundaries
    identifier: date/boundaries/wednesday
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

https://github.com/influxdata/flux/blob/master/stdlib/date/boundaries/boundaries.flux#L196-L200

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`boundaries.wednesday()` returns a record with `start` and `stop` boundary timestamps for last Wednesday.

Last Wednesday is relative to `now()`. If today is Wednesday, the function returns boundaries for the previous Wednesday.

##### Function type signature

```js
() => {stop: time, start: time}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}


## Examples

### Query data collected last Wednesday

```js
import "date/boundaries"

day = boundaries.wednesday()

from(bucket: "example-bucket")
    |> range(start: day.start, stop: day.stop)

```

