---
title: strings.isLetter() function
description: The strings.isLetter() function tests if a single character string is a letter (a-z, A-Z).
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/isletter/
  - /influxdb/v2.0/reference/flux/stdlib/strings/isletter/
  - /influxdb/cloud/reference/flux/stdlib/strings/isletter/
menu:
  flux_0_x_ref:
    name: strings.isLetter
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/isdigit/
introduced: 0.18.0
---

The `strings.isLetter()` function tests if a single character string is a letter (a-z, A-Z).

_**Output data type:** Boolean_

```js
import "strings"

strings.isLetter(v: "A")

// returns true
```

## Parameters

### v
The single character string to test.

_**Data type:** String_

## Examples

###### Filter by columns with single-letter values
```js
import "strings"

data
  |> filter(fn: (r) => strings.isLetter(v: r.serverRef))
```
