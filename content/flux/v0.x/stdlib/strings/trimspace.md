---
title: strings.trimSpace() function
description: The strings.trimSpace() function removes leading and trailing spaces from a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/trimspace/
  - /influxdb/v2.0/reference/flux/stdlib/strings/trimspace/
  - /influxdb/cloud/reference/flux/stdlib/strings/trimspace/
menu:
  flux_0_x_ref:
    name: strings.trimSpace
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/trim
  - /flux/v0.x/stdlib/strings/trimleft
  - /flux/v0.x/stdlib/strings/trimright
  - /flux/v0.x/stdlib/strings/trimprefix
  - /flux/v0.x/stdlib/strings/trimsuffix
introduced: 0.18.0
---

The `strings.trimSpace()` function removes leading and trailing spaces from a string.

_**Output data type:** String_

```js
import "strings"

strings.trimSpace(v: "  abc  ")

// returns "abc"
```

## Parameters

### v
String to remove spaces from.

_**Data type:** String_

## Examples

###### Trim leading and trailing spaces from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => ({ r with userInput: strings.trimSpace(v: r.userInput) }))
```
