---
title: regexp.findStringIndex() function
description: >
  The `regexp.findStringIndex()` function returns a two-element array of integers defining
  the beginning and ending indexes of the left-most regular expression match in a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/regexp/findstringindex/
  - /influxdb/v2.0/reference/flux/stdlib/regexp/findstringindex/
  - /influxdb/cloud/reference/flux/stdlib/regexp/findstringindex/
menu:
  flux_0_x_ref:
    name: regexp.findStringIndex
    parent: regexp
weight: 301
related:
  - /flux/v0.x/stdlib/regexp/compile
  - /flux/v0.x/data-types/regexp/
introduced: 0.33.2
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

### r {data-type="regexp"}
The regular expression used to search `v`.

### v {data-type="string"}
The string value to search.

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
