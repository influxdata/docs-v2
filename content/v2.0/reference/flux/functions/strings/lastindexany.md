---
title: strings.lastIndexAny() function
description: The `strings.lastIndexAny()` function returns the index of the last instance of any specified characters in a string.
menu:
  v2_0_ref:
    name: strings.lastIndexAny
    parent: Strings
weight: 301
related:
  - /v2.0/reference/flux/functions/strings/index/
  - /v2.0/reference/flux/functions/strings/indexany/
  - /v2.0/reference/flux/functions/strings/lastindex/
---

The `strings.lastIndexAny()` function returns the index of the last instance of any specified characters in a string.
If none of the specified characters are present, it returns `-1`.

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
The string value that contains characters to search for.

_**Data type:** String_

## Examples

###### Find the last occurrence of characters from a string
```js
import "strings"

data
  |> map(fn:(r) => strings.lastIndexAny(v: r._field, chars: "_-"))
```
