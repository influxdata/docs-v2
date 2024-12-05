---
title: timezone.fixed() function
description: >
  `timezone.fixed()` returns a location record with a fixed offset.
menu:
  flux_v0_ref:
    name: timezone.fixed
    parent: timezone
    identifier: timezone/fixed
weight: 101
flux/v0/tags: [date/time, location]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/timezone/timezone.flux#L42-L42

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`timezone.fixed()` returns a location record with a fixed offset.



##### Function type signature

```js
(offset: A) => {zone: string, offset: A}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### offset
({{< req >}})
Fixed duration for the location offset.
This duration is the offset from UTC.




## Examples

- [Return a fixed location record](#return-a-fixed-location-record)
- [Set the location option using a fixed location](#set-the-location-option-using-a-fixed-location)

### Return a fixed location record

```js
import "timezone"

timezone.fixed(offset: -8h)// Returns {offset: -8h, zone: "UTC"}


```


### Set the location option using a fixed location

```js
import "timezone"

// This results in midnight at 00:00:00-08:00 on any day.
option location = timezone.fixed(offset: -8h)

```

>  [!Note]
> The `location` option only affects boundaries used for windowing, specifically around time shifts
> like daylight savings. It does not change timestamps in the `_time` column, which are always UTC.

