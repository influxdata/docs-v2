---
title: strings.containsStr() function
description: The strings.containsStr() function reports whether a string contains a specified substring.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/containsstr/
menu:
  influxdb_2_0_ref:
    name: strings.containsStr
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/containsany
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
