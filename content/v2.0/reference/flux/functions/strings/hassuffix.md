---
title: strings.hasSuffix() function
description: The strings.hasSuffix() function tests if a string ends with a specific suffix.
menu:
  v2_0_ref:
    name: strings.hasSuffix
    parent: Strings
weight: 301
---

The `strings.hasSuffix()` function tests if a string ends with a specific suffix.

_**Output data type:** Boolean_

```js
import "strings"

strings.hasSuffix(v: "go gopher", t: "go")

// returns false
```

## Parameters

### v
The string value to test.

_**Data type:** String_

### t
The suffix to test for.

_**Data type:** String_

###### Filter based on the presence of a suffix in a column value
```js
import "strings"

data
  |> filter(fn:(r) => strings.hasSuffix(v: r.metric, t: "_count" ))
```
