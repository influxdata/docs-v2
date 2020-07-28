---
title: strings.trimPrefix() function
description: >
  The `strings.trimPrefix()` function removes a prefix from a string.
  Strings that do not start with the prefix are returned unchanged.
aliases:
  - /v2.0/reference/flux/functions/strings/trimprefix/
menu:
  v2_0_ref:
    name: strings.trimPrefix
    parent: Strings
weight: 301
related:
  - /v2.0/reference/flux/stdlib/strings/trim
  - /v2.0/reference/flux/stdlib/strings/trimleft
  - /v2.0/reference/flux/stdlib/strings/trimright
  - /v2.0/reference/flux/stdlib/strings/trimsuffix
  - /v2.0/reference/flux/stdlib/strings/trimspace
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

### v
The string value to trim.

_**Data type:** String_

### prefix
The prefix to remove.

_**Data type:** String_

## Examples

###### Remove a prefix from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      sensorID: strings.trimPrefix(v: r.sensorId, prefix: "s12_")
    })
  )
```
