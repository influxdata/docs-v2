---
title: strings.containsStr() function
description: The strings.containsStr() function reports whether a string is contained in another string.
menu:
  v2_0_ref:
    name: strings.containsStr
    parent: Strings
weight: 301
---

The `strings.containsStr()` function reports whether a string is contained in another string.

_**Output data type:** Boolean_

```js
import "strings"

strings.containsStr(v: "This and that", substr: "and")

// returns true
```

## Parameters

### v
The string value to search for a substring.

_**Data type:** String_

### substr
The substring value to search for.

_**Data type:** String_

## Examples

###### Report if a string contains a specific substring
```js
import "strings"

data
  |> map(fn:(r) => ({
      _value: strings.containsStr(v: r.author, substr: "John")
    })
  )
```
