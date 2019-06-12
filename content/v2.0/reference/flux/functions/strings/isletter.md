---
title: strings.isLetter() function
description: The strings.isLetter() function tests if a single character string is a letter (a-z, A-Z).
menu:
  v2_0_ref:
    name: strings.isLetter
    parent: Strings
weight: 301
related:
  - /v2.0/reference/flux/functions/strings/isdigit/
---

The `strings.isLetter()` function tests if a single character string is a letter (a-z, A-Z).

_**Output data type:** Boolean_

```js
import "strings"

strings.isLetter(v: "A")

// returns true
```

## Parameters

### v
The single character string value to test.

_**Data type:** String_

## Examples

###### Filter by records that by columns with letter string values
```js
import "strings"

data
  |> filter(fn: (r) => strings.isLetter(v: r.serverRef))
```
