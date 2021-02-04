---
title: Flux date package
list_title: Date package
description: >
  The Flux date package provides date and time constants and functions.
  Import the `date` package.
aliases:
  - /influxdb/v2.0/reference/flux/language/built-ins/time-constants/
  - /influxdb/v2.0/reference/flux/functions/date/
  - /influxdb/v2.0/reference/flux/stdlib/date/
  - /influxdb/cloud/reference/flux/stdlib/date/
menu:
  flux_0_x_ref:
    name: date
    parent: Standard library
weight: 11
cascade:
  flux/v0.x/tags: [date/time]
---

The Flux date package provides date and time constants and functions.
Import the `date` package.

```js
import "date"
```

## Date and time constants
That `date` package includes the following date and time constants.

### Days of the week
Days of the week are represented as integers in the range `[0-6]`.

```js
date.Sunday    = 0
date.Monday    = 1
date.Tuesday   = 2
date.Wednesday = 3
date.Thursday  = 4
date.Friday    = 5
date.Saturday  = 6
```

### Months of the year
Months are represented as integers in the range `[1-12]`.

```js
date.January   = 1
date.February  = 2
date.March     = 3
date.April     = 4
date.May       = 5
date.June      = 6
date.July      = 7
date.August    = 8
date.September = 9
date.October   = 10
date.November  = 11
date.December  = 12
```

## Date and time functions
{{< children type="functions" show="pages" >}}
