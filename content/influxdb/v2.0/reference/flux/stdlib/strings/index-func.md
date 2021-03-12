---
title: strings.index() function
description: >
  The strings.index() function returns the index of the first instance of a substring
  in another string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/index-func/
menu:
  influxdb_2_0_ref:
    name: strings.index
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/indexany/
  - /influxdb/v2.0/reference/flux/stdlib/strings/lastindex/
  - /influxdb/v2.0/reference/flux/stdlib/strings/lastindexany/
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
