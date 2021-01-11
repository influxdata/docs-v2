---
title: math.nextafter() function
description: The math.nextafter() function returns the next representable float value after `x` towards `y`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/nextafter/
  - /influxdb/v2.0/reference/flux/stdlib/math/nextafter/
  - /influxdb/cloud/reference/flux/stdlib/math/nextafter/
menu:
  influxdb_2_0_ref:
    name: math.nextafter
    parent: Math
weight: 301
---

The `math.nextafter()` function returns the next representable float value after `x` towards `y`.

_**Output data type:** Float_

```js
import "math"

math.nextafter(x: 1.23, y: 4.56)

// Returns 1.2300000000000002
```

## Parameters

### x
The X value used in the operation.

_**Data type:** Float_

### y
The Y value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.nextafter(x:x, y:x)    // Returns x
math.nextafter(x: NaN, y:y) // Returns NaN
math.nextafter(x:x, y:NaN)  // Returns NaN
```
