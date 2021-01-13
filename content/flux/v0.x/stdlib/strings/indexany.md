---
title: strings.indexAny() function
description: >
  The strings.indexAny() function returns the index of the first instance of specified characters in a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/indexany/
  - /influxdb/v2.0/reference/flux/stdlib/strings/indexany/
  - /influxdb/cloud/reference/flux/stdlib/strings/indexany/
menu:
  flux_0_x_ref:
    name: strings.indexAny
    parent: strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/index-func/
  - /influxdb/v2.0/reference/flux/stdlib/strings/lastindex/
  - /influxdb/v2.0/reference/flux/stdlib/strings/lastindexany/
introduced: 0.18.0
---

The `strings.indexAny()` function returns the index of the first instance of specified characters in a string.
If none of the specified characters are present, it returns `-1`.

_**Output data type:** Integer_

```js
import "strings"

strings.indexAny(v: "chicken", chars: "aeiouy")

// returns 2
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### chars
Characters to search for.

_**Data type:** String_

## Examples

###### Find the first occurrence of characters from a string
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      charIndex: strings.indexAny(v: r._field, chars: "_-")
    })
  )
```
