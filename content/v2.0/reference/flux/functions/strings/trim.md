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
---

The `strings.trim()` function removes leading and trailing characters specified
in the [`cutset`](#cutset) from a string.

_**Output data type:** String_

```js
import "strings"

strings.trim(v: ".abc.", cutset: ".")

// returns "abc"
```

## Paramters

### v
The string value from which to trim characters.

_**Data type:** String_

### cutset
The leading and trailing characters from trim from the string value.

_**Data type:** String_

## Examples

###### Trim leading and trailing periods from all values in a column
```js
import "strings"

data
  |> map(fn:(r) => strings.trim(v: r.variables, cutset: "."))
```
