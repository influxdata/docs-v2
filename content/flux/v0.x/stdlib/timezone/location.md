---
title: timezone.location() function
description: >
  `timezone.location()` loads a timezone based on a location name.
menu:
  flux_0_x_ref:
    name: timezone.location
    parent: timezone
weight: 101
flux/v0.x/tags: [timezone, location, data/time]
---

`timezone.location()` constructs a timezone record based on a specific location.
Setting the timezone by location accounts for location-based time shifts in the
clock such as daylight savings time or summertime.

```js
import "timezone"

timezone.location(name: "America/Los_Angeles")

// Returns {offset: 0ns, zone: "America/Los_Angeles"}
```

## Parameters

### name {data-type="string"}
({{< req >}})
Location name _(as defined by your operating system timezone database)_.
