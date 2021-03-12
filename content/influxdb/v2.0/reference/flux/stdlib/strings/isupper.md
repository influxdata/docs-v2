---
title: strings.isUpper() function
description: The strings.isUpper() function tests if a single character string is uppercase.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/isupper/
menu:
  influxdb_2_0_ref:
    name: strings.isUpper
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/islower
---

The `strings.isUpper()` function tests if a single character string is uppercase.

_**Output data type:** Boolean_

```js
import "strings"

strings.isUpper(v: "A")

// returns true
```

## Parameters

### v
The single-character string value to test.

_**Data type:** String_

## Examples

###### Filter by columns with single-letter uppercase values
```js
import "strings"

data
  |> filter(fn: (r) => strings.isUpper(v: r.host))
```
