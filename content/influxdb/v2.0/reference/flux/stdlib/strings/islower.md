---
title: strings.isLower() function
description: The strings.isLower() function tests if a single-character string is lowercase.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/islower/
  - /influxdb/v2.0/reference/flux/stdlib/strings/islower/
  - /influxdb/cloud/reference/flux/stdlib/strings/islower/
menu:
  influxdb_2_0_ref:
    name: strings.isLower
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/isupper
introduced: 0.18.0
---

The `strings.isLower()` function tests if a single-character string is lowercase.

_**Output data type:** Boolean_

```js
import "strings"

strings.isLower(v: "a")

// returns true
```

## Parameters

### v
The single-character string value to test.

_**Data type:** String_

## Examples

###### Filter by columns with single-letter lowercase values
```js
import "strings"

data
  |> filter(fn: (r) => strings.isLower(v: r.host))
```
