---
title: strings.isDigit() function
description: The strings.isDigit() function tests if a single character string is a digit (0-9).
menu:
  v2_0_ref:
    name: strings.isDigit
    parent: Strings
weight: 301
related:
  - /v2.0/reference/flux/functions/strings/isletter/
---

The `strings.isDigit()` function tests if a single character string is a digit (0-9).

_**Output data type:** Boolean_

```js
import "strings"

strings.isDigit(v: "A")

// returns false
```

## Parameters

### v
The single character string value to test.

_**Data type:** String_

## Examples

###### Filter by records that by columns with digit string values
```js
import "strings"

data
  |> filter(fn: (r) => strings.isDigit(v: r.serverRef))
```
