---
title: regexp.findStringIndex() function
description: >
  The `regexp.findStringIndex()` function returns a two-element array of integers defining
  the beginning and ending indexes of the left-most regular expression match in a string.
aliases:
  - /influxdb/cloud/reference/flux/functions/regexp/findstringindex/
menu:
  influxdb_cloud_ref:
    name: regexp.findStringIndex
    parent: Regular expressions
weight: 301
related:
  - /influxdb/cloud/reference/flux/stdlib/regexp/compile
---

The `regexp.findStringIndex()` function returns a two-element array of integers defining
the beginning and ending indexes of the left-most regular expression match in a string.

_**Output data type:** Array of Integers_

```js
import "regexp"

regexp.findStringIndex(r: /ab?/, v: "tablet")

// Returns [1, 3]
```

## Parameters

### r
The regular expression used to search `v`.

_**Data type:** Regexp_

### v
The string value to search.

_**Data type:** String_

## Examples

###### Index the bounds of first regular expression match in each row
```js
import "regexp"

data
  |> map(fn: (r) => ({
      r with
      regexStr: r.regexStr,
      _value: r._value,
      matchIndex: regexp.findStringIndex(
        r: regexp.compile(r.regexStr),
        v: r._value
      )
    })
  )
```
