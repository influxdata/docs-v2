---
title: timezone package
description: >
  The `timezone` package defines functions for setting timezones
  on the location option in package universe.
menu:
  flux_v0_ref:
    name: timezone 
    parent: stdlib
    identifier: timezone
weight: 11
cascade:

  introduced: 0.134.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/timezone/timezone.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `timezone` package defines functions for setting timezones
on the location option in package universe.
Import the `timezone` package:

```js
import "timezone"
```

## Constants

```js
timezone.utc = {zone: "UTC", offset: 0h}
```

- **timezone.utc** is the default location with a completely linear clock and no offset.
It is used as the default for location-related options.


## Functions

{{< children type="functions" show="pages" >}}
