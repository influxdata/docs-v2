---
title: strings.trimPrefix() function
description: >
  The `strings.trimPrefix()` function removes a prefix from a string.
  Strings that do not start with the prefix are returned unchanged.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/trimprefix/
  - /influxdb/v2.0/reference/flux/stdlib/strings/trimprefix/
  - /influxdb/cloud/reference/flux/stdlib/strings/trimprefix/
menu:
  flux_0_x_ref:
    name: strings.trimPrefix
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/trim
  - /flux/v0.x/stdlib/strings/trimleft
  - /flux/v0.x/stdlib/strings/trimright
  - /flux/v0.x/stdlib/strings/trimsuffix
  - /flux/v0.x/stdlib/strings/trimspace
introduced: 0.27.0
---

The `strings.trimPrefix()` function removes a prefix from a string.
Strings that do not start with the prefix are returned unchanged.

_**Output data type:** String_

```js
import "strings"

strings.trimPrefix(v: "123_abc", prefix: "123")

// returns "_abc"
```

## Parameters

### v {data-type="string"}
The string value to trim.

### prefix {data-type="string"}
The prefix to remove.

## Examples

###### Remove a prefix from all values in a column
```js
import "strings"

data
    |> map(fn: (r) => ({r with sensorID: strings.trimPrefix(v: r.sensorId, prefix: "s12_")}))
```
