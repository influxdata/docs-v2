---
title: strings.containsStr() function
description: The strings.containsStr() function reports whether a string contains a specified substring.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/containsstr/
  - /influxdb/v2.0/reference/flux/stdlib/strings/containsstr/
  - /influxdb/cloud/reference/flux/stdlib/strings/containsstr/
menu:
  flux_0_x_ref:
    name: strings.containsStr
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/containsany
introduced: 0.18.0
---

The `strings.containsStr()` function reports whether a string contains a specified substring.

_**Output data type:** Boolean_

```js
import "strings"

strings.containsStr(v: "This and that", substr: "and")

// returns true
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### substr
The substring value to search for.

_**Data type:** String_

## Examples

###### Report if a string contains a specific substring
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      _value: strings.containsStr(v: r.author, substr: "John")
    })
  )
```
