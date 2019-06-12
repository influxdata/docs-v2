---
title: strings.countStr() function
description: >
  The strings.countStr() function counts the number of non-overlapping instances
  one string appears in another string.
menu:
  v2_0_ref:
    name: strings.countStr
    parent: Strings
weight: 301
---

The `strings.countStr()` function counts the number of non-overlapping instances
one string appears in another string.

_**Output data type:** Integer_

```js
import "strings"

strings.countStr(v: "Hello mellow fellow", substr: "ello")

// returns 3
```

## Parameters

### v
The string value in which to count non-overlapping instances of `substr`.

_**Data type:** String_

### substr
The substring value to count.

_**Data type:** String_

## Examples

###### Count instances of a substring within a string
```js
import "strings"

data
  |> map(fn:(r) => ({
      _value: strings.countStr(v: r.message, substr: "uh")
    })
  )
```
