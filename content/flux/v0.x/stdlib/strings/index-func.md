---
title: strings.index() function
description: >
  The strings.index() function returns the index of the first instance of a substring
  in another string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/index-func/
  - /influxdb/v2.0/reference/flux/stdlib/strings/index-func/
  - /influxdb/cloud/reference/flux/stdlib/strings/index-func/
menu:
  flux_0_x_ref:
    name: strings.index
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/indexany/
  - /flux/v0.x/stdlib/strings/lastindex/
  - /flux/v0.x/stdlib/strings/lastindexany/
introduced: 0.18.0
---

The `strings.index()` function returns the index of the first instance of a substring
in a string. If the substring is not present, it returns `-1`.

_**Output data type:** Integer_

```js
import "strings"

strings.index(v: "go gopher", substr: "go")

// returns 0
```

## Parameters

### v {data-type="string"}
The string value to search.

### substr {data-type="string"}
The substring to search for.

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
