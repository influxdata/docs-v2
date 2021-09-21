---
title: strings.containsAny() function
description: >
  The strings.containsAny() function reports whether a specified string contains
  any characters from from another string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/containsany/
  - /influxdb/v2.0/reference/flux/stdlib/strings/containsany/
  - /influxdb/cloud/reference/flux/stdlib/strings/containsany/
menu:
  flux_0_x_ref:
    name: strings.containsAny
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/containsstr
introduced: 0.18.0
---

The `strings.containsAny()` function reports whether a specified string contains
characters from another string.

_**Output data type:** Boolean_

```js
import "strings"

strings.containsAny(v: "abc", chars: "and")

// returns true
```

## Parameters

### v {data-type="string"}
The string value to search.

### chars {data-type="string"}
Characters to search for.

## Examples

###### Report if a string contains specific characters
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      _value: strings.containsAny(v: r.price, chars: "£$¢")
    })
  )
```
