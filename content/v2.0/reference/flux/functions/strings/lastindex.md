---
title: strings.lastIndex() function
description: >
  The strings.lastIndex() function returns the index of the last instance of a substring
  in another string or `-1` if substring is not present.
menu:
  v2_0_ref:
    name: strings.lastIndex
    parent: Strings
weight: 301
related:
  - /v2.0/reference/flux/functions/strings/index/
  - /v2.0/reference/flux/functions/strings/indexany/
  - /v2.0/reference/flux/functions/strings/lastindexany/
---

The `strings.lastIndex()` function returns the index of the last instance of a substring
in another string. If the substring is not present, it returns `-1`.

_**Output data type:** Integer_

```js
import "strings"

strings.lastIndex(v: "go gopher", t: "go")

// returns 3
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### substr
The substring to search for.

_**Data type:** String_

## Examples

###### Find the last occurrence of a substring
```js
import "strings"

data
  |> map(fn:(r) => ({
      the_index: strings.lastIndex(v: r.pageTitle, substr: "the")
    })
  )
```
