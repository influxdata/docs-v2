---
title: regexp.getString() function
description: The `regexp.getString()` function returns the source string used to compile a regular expression.
aliases:
  - /influxdb/v2.0/reference/flux/functions/regexp/getstring/
  - /influxdb/v2.0/reference/flux/stdlib/regexp/getstring/
  - /influxdb/cloud/reference/flux/stdlib/regexp/getstring/
menu:
  flux_0_x_ref:
    name: regexp.getString
    parent: regexp
weight: 301
related:
  - /flux/v0.x/stdlib/regexp/compile
  - /flux/v0.x/data-types/regexp/
introduced: 0.33.3
---

The `regexp.getString()` function returns the source string used to compile a regular expression.

_**Output data type:** String_

```js
import "regexp"

regexp.getString(r: /[a-zA-Z]/)

// Returns "[a-zA-Z]"
```

## Parameters

### r {data-type="regexp"}
The regular expression object to convert to a string.

## Examples

###### Convert regular expressions into strings in each row
```js
import "regexp"

data
  |> map(fn: (r) => ({
      r with
      regex: r.regex,
      regexStr: regexp.getString(r: r.regex)
    })
  )
```
