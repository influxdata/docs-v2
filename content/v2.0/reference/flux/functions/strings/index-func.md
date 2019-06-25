---
title: strings.index() function
description: >
  The strings.index() function returns the index of the first instance of a substring
  in another string.
menu:
  v2_0_ref:
    name: strings.index
    parent: Strings
weight: 301
related:
  - /v2.0/reference/flux/functions/strings/indexany/
  - /v2.0/reference/flux/functions/strings/lastindex/
  - /v2.0/reference/flux/functions/strings/lastindexany/
---

The `strings.index()` function returns the index of the first instance of a substring
in another string. If the substring is not present, it returns `-1`.

_**Output data type:** Integer_

```js
import "strings"

strings.index(v: "go gopher", substr: "go")

// returns 0
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### substr
The substring to search for.

_**Data type:** String_

## Examples

###### Find the first occurrence of a substring
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      the_index: strings.index(v: r.pageTitle, substr: "the")
    })
  )
```
