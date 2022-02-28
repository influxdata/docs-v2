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
    parent: strings
weight: 301
flux/v0.x/tags: [tests]
related:
  - /flux/v0.x/stdlib/strings/isletter/
introduced: 0.18.0
---

The `strings.isDigit()` function tests if a single-character string is a digit (0-9).

_**Output data type:** Boolean_

```js
import "strings"

strings.isDigit(v: "A")

// Returns false
```

## Parameters

### v {data-type="string"}
The single-character string to test.

## Examples

###### Filter by columns with digits as values
```js
import "strings"

data
    |> filter(fn: (r) => strings.isDigit(v: r.serverRef))
```
