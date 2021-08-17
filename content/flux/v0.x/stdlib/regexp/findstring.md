---
title: regexp.findString() function
description: The `regexp.findString()` function returns the left-most regular expression match in a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/regexp/findstring/
  - /influxdb/v2.0/reference/flux/stdlib/regexp/findstring/
  - /influxdb/cloud/reference/flux/stdlib/regexp/findstring/
menu:
  flux_0_x_ref:
    name: regexp.findString
    parent: regexp
weight: 301
related:
  - /flux/v0.x/stdlib/regexp/splitregexp
  - /flux/v0.x/data-types/regexp/
introduced: 0.33.1
---

The `regexp.findString()` function returns the left-most regular expression match in a string.

_**Output data type:** String_

```js
import "regexp"

regexp.findString(r: /foo.?/, v: "seafood fool")

// Returns "food"
```

## Parameters

### r {data-type="regexp"}
The regular expression used to search `v`.

### v {data-type="string"}
The string value to search.

## Examples

###### Find the first regular expression match in each row
```js
import "regexp"

data
  |> map(fn: (r) => ({
      r with
      message: r.message,
      regexp: r.regexp,
      match: regexp.findString(r: r.regexp, v: r.message)
    })
  )
```
