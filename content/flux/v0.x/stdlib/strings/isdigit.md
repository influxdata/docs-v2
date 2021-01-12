---
title: strings.isDigit() function
description: The strings.isDigit() function tests if a single character string is a digit (0-9).
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/isdigit/
  - /influxdb/v2.0/reference/flux/stdlib/strings/isdigit/
  - /influxdb/cloud/reference/flux/stdlib/strings/isdigit/
menu:
  flux_0_x_ref:
    name: strings.isDigit
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/isletter/
introduced: 0.18.0
---

The `strings.isDigit()` function tests if a single-character string is a digit (0-9).

_**Output data type:** Boolean_

```js
import "strings"

strings.isDigit(v: "A")

// returns false
```

## Parameters

### v
The single-character string to test.

_**Data type:** String_

## Examples

###### Filter by columns with digits as values
```js
import "strings"

data
  |> filter(fn: (r) => strings.isDigit(v: r.serverRef))
```
