---
title: strings.replaceAll() function
description: >
  The strings.replaceAll() function replaces all non-overlapping instances of a
  substring with a specified replacement.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/replaceall/
  - /influxdb/v2.0/reference/flux/stdlib/strings/replaceall/
  - /influxdb/cloud/reference/flux/stdlib/strings/replaceall/
menu:
  flux_0_x_ref:
    name: strings.replaceAll
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/replace
introduced: 0.18.0
---

The `strings.replaceAll()` function replaces all non-overlapping instances of a
substring with a specified replacement.

_**Output data type:** String_

```js
import "strings"

strings.replaceAll(v: "oink oink oink", t: "oink", u: "moo")

// returns "moo moo moo"
```

## Parameters

### v {data-type="string"}
The string value to search.

### t {data-type="string"}
The substring to replace.

### u {data-type="string"}
The replacement for all instances of `t`.

## Examples

###### Replace string matches
```js
import "strings"

data
    |> map(fn: (r) => ({r with content: strings.replaceAll(v: r.content, t: "he", u: "her")}))
```
