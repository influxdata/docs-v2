---
title: strings.isLower() function
description: The strings.isLower() function tests if a single-character string is lowercase.
menu:
  v2_0_ref:
    name: strings.isLower
    parent: Strings
weight: 301
---

The `strings.isLower()` function tests if a single-character string is lowercase.

_**Output data type:** Boolean_

```js
import "strings"

strings.isLower(v: "a flux of foxes")

// returns true
```

## Parameters

### v
The single-character string value to test.

_**Data type:** String_

## Examples

###### Filter based on lowercase column values
```js
import "strings"

data
  |> filter(fn: (r) => strings.isLower(v: r.host))
```
