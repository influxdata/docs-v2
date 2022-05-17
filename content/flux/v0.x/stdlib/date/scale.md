---
title: date.scale() function
description: >
  `date.scale()` multiplies a duration by a specified value.
menu:
  flux_0_x_ref:
    name: date.scale
    parent: date
weight: 301
introduced: 0.167.0
flux/v0.x/tags: [date/time]
---

`date.scale()` multiplies a duration by a specified value.

This function lets you dynamically scale a duration value.

```js
import "date"

date.scale(d: 1h, n: 12)

// Returns 12h
```

## Parameters

### d {data-type="duration"}
({{< req >}}) Duration to scale.

### n {data-type="int"}
({{< req >}} Amount to scale the duration (`d`) by.

## Examples

### Add n hours to a time
```js
import "date"

n = 5
d = date.scale(d: 1h, n: n)

date.add(d: d, to: 2022-05-10T00:00:00Z)

// Returns 2022-05-10T00:00:00.000000000Z
```

### Add scaled mixed duration to a time

```js
import "date"

n = 5
d = date.scale(d: 1mo1h, n: 5)

date.add(d: d, to: 2022-01-01T00:00:00Z)

// Returns 2022-06-01T05:00:00.000000000Z
```
