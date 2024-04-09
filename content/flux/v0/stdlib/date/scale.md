---
title: date.scale() function
description: >
  `date.scale()` will multiply the duration by the given value.
menu:
  flux_v0_ref:
    name: date.scale
    parent: date
    identifier: date/scale
weight: 101
flux/v0/tags: [date/time]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux#L931-L931

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`date.scale()` will multiply the duration by the given value.



##### Function type signature

```js
(d: duration, n: int) => duration
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### d
({{< req >}})
Duration to scale.



### n
({{< req >}})
Amount to scale the duration by.




## Examples

- [Add n hours to a time](#add-n-hours-to-a-time)
- [Add scaled mixed duration to a time](#add-scaled-mixed-duration-to-a-time)

### Add n hours to a time

```js
import "date"

n = 5
d = date.scale(d: 1h, n: n)

date.add(d: d, to: 2022-05-10T00:00:00Z)// Returns 2022-05-10T00:00:00.000000000Z


```


### Add scaled mixed duration to a time

```js
import "date"

n = 5
d = date.scale(d: 1mo1h, n: 5)

date.add(d: d, to: 2022-01-01T00:00:00Z)// Returns 2022-06-01T05:00:00.000000000Z


```

