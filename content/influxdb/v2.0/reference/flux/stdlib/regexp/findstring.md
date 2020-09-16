---
title: regexp.findString() function
description: The `regexp.findString()` function returns the left-most regular expression match in a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/regexp/findstring/
menu:
  influxdb_2_0_ref:
    name: regexp.findString
    parent: Regular expressions
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/regexp/splitregexp
---

The `regexp.findString()` function returns the left-most regular expression match in a string.

_**Output data type:** String_

```js
import "regexp"

findString(r: /foo.?/, v: "seafood fool")

// Returns "food"
```

## Parameters

### r
The regular expression used to search `v`.

_**Data type:** Regexp_

### v
The string value to search.

_**Data type:** String_

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
