---
title: strings.trim() function
description: >
  The strings.trim() function removes leading and trailing characters specified
  in the cutset from a string.
menu:
  v2_0_ref:
    name: strings.trim
    parent: Strings
weight: 301
related:
  - /v2.0/reference/flux/functions/strings/trimleft
  - /v2.0/reference/flux/functions/strings/trimright
  - /v2.0/reference/flux/functions/strings/trimprefix
  - /v2.0/reference/flux/functions/strings/trimsuffix
  - /v2.0/reference/flux/functions/strings/trimspace
---

The `strings.trim()` function removes leading and trailing characters specified
in the [`cutset`](#cutset) from a string.

_**Output data type:** String_

```js
import "strings"

strings.trim(v: ".abc.", cutset: ".")

// returns "abc"
```

## Parameters

### v
The string value from which to trim characters.

_**Data type:** String_

### cutset
The leading and trailing characters to trim from the string value.
Only characters that match the `cutset` string exactly are trimmed.

_**Data type:** String_

## Examples

###### Trim leading and trailing periods from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => strings.trim(v: r.variables, cutset: "."))
```
