---
title: strings.trimLeft() function
description: >
  The strings.trimLeft() function removes specified leading characters from a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/trimleft/
  - /influxdb/v2.0/reference/flux/stdlib/strings/trimleft/
  - /influxdb/cloud/reference/flux/stdlib/strings/trimleft/
menu:
  flux_0_x_ref:
    name: strings.trimLeft
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/trim
  - /flux/v0.x/stdlib/strings/trimright
  - /flux/v0.x/stdlib/strings/trimprefix
  - /flux/v0.x/stdlib/strings/trimsuffix
  - /flux/v0.x/stdlib/strings/trimspace
introduced: 0.18.0
---

The `strings.trimLeft()` function removes specified leading characters from a string.

_**Output data type:** String_

```js
import "strings"

strings.trimLeft(v: ".abc.", cutset: ".")

// returns "abc."
```

## Parameters

### v
String to remove characters from.

_**Data type:** String_

### cutset
The leading characters to remove from the string.
Only characters that match the `cutset` string exactly are removed.

_**Data type:** String_

## Examples

###### Trim leading periods from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      variables: strings.trimLeft(v: r.variables, cutset: ".")
    })
  )
```
