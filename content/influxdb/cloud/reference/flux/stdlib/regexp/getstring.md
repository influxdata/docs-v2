---
title: regexp.getString() function
description: The `regexp.getString()` function returns the source string used to compile a regular expression.
aliases:
  - /influxdb/cloud/reference/flux/functions/regexp/getstring/
menu:
  influxdb_cloud_ref:
    name: regexp.getString
    parent: Regular expressions
weight: 301
related:
  - /influxdb/cloud/reference/flux/stdlib/regexp/compile
---

The `regexp.getString()` function returns the source string used to compile a regular expression.

_**Output data type:** String_

```js
import "regexp"

regexp.getString(r: /[a-zA-Z]/)

// Returns "[a-zA-Z]"
```

## Parameters

### r
The regular expression object to convert to a string.

_**Data type:** Regexp_

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
