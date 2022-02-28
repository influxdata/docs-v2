---
title: strings.trimSuffix() function
description: >
  The `strings.trimSuffix()` function removes a suffix from a string.
  Strings that do not end with the suffix are returned unchanged.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/trimsuffix/
  - /influxdb/v2.0/reference/flux/stdlib/strings/trimsuffix/
  - /influxdb/cloud/reference/flux/stdlib/strings/trimsuffix/
menu:
  flux_0_x_ref:
    name: strings.trimSuffix
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/trim
  - /flux/v0.x/stdlib/strings/trimleft
  - /flux/v0.x/stdlib/strings/trimright
  - /flux/v0.x/stdlib/strings/trimprefix
  - /flux/v0.x/stdlib/strings/trimspace
introduced: 0.27.0
---

The `strings.trimSuffix()` function removes a suffix from a string.
Strings that do not end with the suffix are returned unchanged.

_**Output data type:** String_

```js
import "strings"

strings.trimSuffix(v: "123_abc", suffix: "abc")

// returns "123_"
```

## Parameters

### v {data-type="string"}
The string value to trim.

### suffix {data-type="string"}
The suffix to remove.

## Examples

###### Remove a suffix from all values in a column
```js
import "strings"

data
    |> map(fn: (r) => ({r with sensorID: strings.trimSuffix(v: r.sensorId, suffix: "_s12")}))
```
