---
title: strings.equalFold() function
description: >
  The strings.equalFold() function reports whether two UTF-8 strings are equal
  under Unicode case-folding.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/equalfold/
  - /influxdb/v2.0/reference/flux/stdlib/strings/equalfold/
  - /influxdb/cloud/reference/flux/stdlib/strings/equalfold/
menu:
  flux_0_x_ref:
    name: strings.equalFold
    parent: strings
weight: 301
introduced: 0.18.0
---

The `strings.equalFold()` function reports whether two UTF-8 strings are equal
under Unicode case-folding.

_**Output data type:** Boolean_

```js
import "strings"

strings.equalFold(v: "Go", t: "go")

// returns true
```

## Parameters

### v
The string value to compare.

_**Data type:** String_

### t
The string value to compare against.

_**Data type:** String_

## Examples

###### Ignore case when testing if two strings are the same
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      string1: r.string1,
      string2: r.string2,
      same: strings.equalFold(v: r.string1, t: r.string2)
    })
  )
```
