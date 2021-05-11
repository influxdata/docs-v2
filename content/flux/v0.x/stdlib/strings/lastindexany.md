---
title: strings.lastIndexAny() function
description: The `strings.lastIndexAny()` function returns the index of the last instance of any specified characters in a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/lastindexany/
  - /influxdb/v2.0/reference/flux/stdlib/strings/lastindexany/
  - /influxdb/cloud/reference/flux/stdlib/strings/lastindexany/
menu:
  flux_0_x_ref:
    name: strings.lastIndexAny
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/index/
  - /flux/v0.x/stdlib/strings/indexany/
  - /flux/v0.x/stdlib/strings/lastindex/
introduced: 0.18.0
---

The `strings.lastIndexAny()` function returns the index of the last instance of any specified characters in a string.
If none of the specified characters are present, the function returns `-1`.

_**Output data type:** Integer_

```js
import "strings"

strings.lastIndexAny(v: "chicken", chars: "aeiouy")

// returns 5
```

## Parameters

### v {data-type="string"}
The string value to search.

### chars {data-type="string"}
Characters to search for.

## Examples

###### Find the last occurrence of characters from a string
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      charLastIndex: strings.lastIndexAny(v: r._field, chars: "_-")
    })
  )
```
