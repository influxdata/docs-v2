---
title: strings.trimSpace() function
description: The strings.trimSpace() function removes leading and trailing spaces from a string.
menu:
  v2_0_ref:
    name: strings.trimSpace
    parent: Strings
weight: 301
related:
  - /v2.0/reference/flux/functions/strings/trim
  - /v2.0/reference/flux/functions/strings/trimleft
  - /v2.0/reference/flux/functions/strings/trimright
  - /v2.0/reference/flux/functions/strings/trimprefix
  - /v2.0/reference/flux/functions/strings/trimsuffix
---

The `strings.trimSpace()` function removes leading and trailing spaces from a string.

_**Output data type:** String_

```js
import "strings"

strings.trimSpace(v: "  abc  ")

// returns "abc"
```

## Parameters

### v
String to remove spaces from.

_**Data type:** String_

## Examples

###### Trim leading and trailing spaces from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => ({ r with userInput: strings.trimSpace(v: r.userInput) }))
```
