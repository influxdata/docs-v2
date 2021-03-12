---
title: strings.lastIndex() function
description: >
  The strings.lastIndex() function returns the index of the last instance of a substring
  in a string or `-1` if substring is not present.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/lastindex/
menu:
  influxdb_2_0_ref:
    name: strings.lastIndex
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/index/
  - /influxdb/v2.0/reference/flux/stdlib/strings/indexany/
  - /influxdb/v2.0/reference/flux/stdlib/strings/lastindexany/
---

The `strings.lastIndex()` function returns the index of the last instance of a substring
in a string. If the substring is not present, the function returns `-1`.

_**Output data type:** Integer_

```js
import "strings"

strings.lastIndex(v: "go gopher", substr: "go")

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
  |> map(fn: (r) => ({
      r with
      the_index: strings.lastIndex(v: r.pageTitle, substr: "the")
    })
  )
```
