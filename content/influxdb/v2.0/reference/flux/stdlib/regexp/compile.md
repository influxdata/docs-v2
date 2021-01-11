---
title: regexp.compile() function
description: >
  The `regexp.compile()` function parses a regular expression and, if successful,
  returns a Regexp object that can be used to match against text.
aliases:
  - /influxdb/v2.0/reference/flux/functions/regexp/compile/
  - /influxdb/v2.0/reference/flux/stdlib/regexp/compile/
  - /influxdb/cloud/reference/flux/stdlib/regexp/compile/
menu:
  influxdb_2_0_ref:
    name: regexp.compile
    parent: Regular expressions
weight: 301
---

The `regexp.compile()` function parses a regular expression and, if successful,
returns a Regexp object that can be used to match against text.

_**Output data type:** Regexp_

```js
import "regexp"

regexp.compile(v: "abcd")

// Returns the regexp object `abcd`
```

## Parameters

### v
The string value to parse into a regular expression.

_**Data type:** String_

## Examples

###### Use a string value as a regular expression
```js
import "regexp"

data
  |> map(fn: (r) => ({
      r with
      regexStr: r.regexStr,
      _value: r._value,
      firstRegexMatch: findString(
        r: regexp.compile(v: regexStr),
        v: r._value
      )
    })
  )
```
