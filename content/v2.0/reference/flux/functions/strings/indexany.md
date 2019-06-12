---
title: strings.indexAny() function
description: >
  The strings.indexAny() function returns the index of the first instance of any specified characters in a string.
menu:
  v2_0_ref:
    name: strings.indexAny
    parent: Strings
weight: 301
related:
  - /v2.0/reference/flux/functions/strings/index/
  - /v2.0/reference/flux/functions/strings/lastindex/
  - /v2.0/reference/flux/functions/strings/lastindexany/
---

The `strings.indexAny()` function returns the index of the first instance of any specified characters in a string.
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
The string value that contains characters to search for.

_**Data type:** String_

## Examples

###### Find the first occurrence of characters from a string
```js
import "strings"

data
  |> map(fn:(r) => strings.indexAny(v: r._field, chars: "_-"))
```
