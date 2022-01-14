---
title: strings.lastIndex() function
description: >
  The strings.lastIndex() function returns the index of the last instance of a substring
  in a string or `-1` if substring is not present.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/lastindex/
  - /influxdb/v2.0/reference/flux/stdlib/strings/lastindex/
  - /influxdb/cloud/reference/flux/stdlib/strings/lastindex/
menu:
  flux_0_x_ref:
    name: strings.lastIndex
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/index/
  - /flux/v0.x/stdlib/strings/indexany/
  - /flux/v0.x/stdlib/strings/lastindexany/
introduced: 0.18.0
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

### v {data-type="string"}
The string value to search.

### substr {data-type="string"}
The substring to search for.

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
