---
title: strings.lastIndexAny() function
description: The `strings.lastIndexAny()` function returns the index of the last instance of any specified characters in a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/lastindexany/
menu:
  influxdb_2_0_ref:
    name: strings.lastIndexAny
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/index/
  - /influxdb/v2.0/reference/flux/stdlib/strings/indexany/
  - /influxdb/v2.0/reference/flux/stdlib/strings/lastindex/
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

### v
The string value to search.

_**Data type:** String_

### chars
Characters to search for.

_**Data type:** String_

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
