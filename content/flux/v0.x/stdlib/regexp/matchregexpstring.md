---
title: regexp.matchRegexpString() function
description: >
  The `regexp.matchRegexpString()` function tests if a string contains any match
  to a regular expression.
aliases:
  - /influxdb/v2.0/reference/flux/functions/regexp/matchregexpstring/
  - /influxdb/v2.0/reference/flux/stdlib/regexp/matchregexpstring/
  - /influxdb/cloud/reference/flux/stdlib/regexp/matchregexpstring/
menu:
  flux_0_x_ref:
    name: regexp.matchRegexpString
    parent: Regular expressions
weight: 301
introduced: 0.33.4
---

The `regexp.matchRegexpString()` function tests if a string contains any match
to a regular expression.

_**Output data type:** Boolean_

```js
import "regexp"

regexp.matchRegexpString(r: /(gopher){2}/, v: "gophergophergopher")

// Returns true
```

## Parameters

### r
The regular expression used to search `v`.

_**Data type:** Regexp_

### v
The string value to search.

_**Data type:** String_

## Examples

###### Filter by columns that contain matches to a regular expression
```js
import "regexp"

data
  |> filter(fn: (r) =>
    regexp.matchRegexpString(
      r: /Alert\:/,
      v: r.message
    )
  )
```
