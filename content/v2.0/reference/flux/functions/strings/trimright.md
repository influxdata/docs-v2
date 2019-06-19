---
title: strings.trimRight() function
description: >
  The strings.trimRight() function removes trailing characters specified in the cutset from a string.
menu:
  v2_0_ref:
    name: strings.trimRight
    parent: Strings
weight: 301
related:
  - /v2.0/reference/flux/functions/strings/trim
  - /v2.0/reference/flux/functions/strings/trimleft
  - /v2.0/reference/flux/functions/strings/trimprefix
  - /v2.0/reference/flux/functions/strings/trimsuffix
  - /v2.0/reference/flux/functions/strings/trimspace
---

The `strings.trimRight()` function removes trailing characters specified in the
[`cutset`](#cutset) from a string.

_**Output data type:** String_

```js
import "strings"

strings.trimRight(v: ".abc.", cutset: ".")

// returns "abc."
```

## Parameters

### v
String to remove characters from.

_**Data type:** String_

### cutset
The trailing characters to trim from the string.
Only characters that match the `cutset` string exactly are trimmed.

_**Data type:** String_

## Examples

###### Trim trailing periods from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => strings.trimRight(v: r.variables, cutset: "."))
```
