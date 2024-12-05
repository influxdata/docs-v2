---
title: timezone.location() function
description: >
  `timezone.location()` returns a location record based on a location or timezone name.
menu:
  flux_v0_ref:
    name: timezone.location
    parent: timezone
    identifier: timezone/location
weight: 101
flux/v0/tags: [date/time, location]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/timezone/timezone.flux#L70-L70

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`timezone.location()` returns a location record based on a location or timezone name.



##### Function type signature

```js
(name: string) => {zone: string, offset: duration}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### name
({{< req >}})
Location name (as defined by your operating system timezone database).




## Examples

- [Return a timezone-based location record](#return-a-timezone-based-location-record)
- [Set the location option using a timezone-based location](#set-the-location-option-using-a-timezone-based-location)

### Return a timezone-based location record

```js
import "timezone"

timezone.location(name: "America/Los_Angeles")// Returns {offset: 0ns, zone: "America/Los_Angeles"}


```


### Set the location option using a timezone-based location

```js
import "timezone"

option location = timezone.location(name: "America/Los_Angeles")

```

> [!Note]
> The `location` option only affects boundaries used for windowing, specifically around time shifts
> like daylight savings. It does not change timestamps in the `_time` column, which are always UTC.
