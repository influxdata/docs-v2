---
title: Flux timezone package
list_title: timezone package
description: >
  The Flux `timezone` package provide functions for timezones on the
  [location option](/flux/v0.x/stdlib/universe/#location).
  Import the `timezone` package.
menu:
  flux_0_x_ref:
    name: timezone
    parent: Standard library
weight: 11
flux/v0.x/tags: [timezone, location, functions, package]
cascade:
  introduced: 0.134.0
---

The Flux `timezone` package provide functions for timezones on the
[location option](/flux/v0.x/stdlib/universe/#location).
Import the `timezone` package.

```
import "timezone"
```

## Constants
```js
timezone.utc = {zone: "UTC", offset: 0h}
```

## Functions
{{< children type="functions" show="pages" >}}