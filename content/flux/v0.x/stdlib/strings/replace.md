---
title: strings.replace() function
description: >
  The strings.replace() function replaces the first `i` non-overlapping instances
  of a substring with a specified replacement.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/replace/
  - /influxdb/v2.0/reference/flux/stdlib/strings/replace/
  - /influxdb/cloud/reference/flux/stdlib/strings/replace/
menu:
  flux_0_x_ref:
    name: strings.replace
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/replaceall
introduced: 0.18.0
---

The `strings.replace()` function replaces the first `i` non-overlapping instances
of a substring with a specified replacement.

_**Output data type:** String_

```js
import "strings"

strings.replace(v: "oink oink oink", t: "oink", u: "moo", i: 2)

// returns "moo moo oink"
```

## Parameters

### v
The string value to search.

### t {data-type="string"}
The substring value to replace.

### u {data-type="string"}
The replacement for `i` instances of `t`.

### i {data-type="int"}
The number of non-overlapping `t` matches to replace.

## Examples

###### Replace a specific number of string matches
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      content: strings.replace(v: r.content, t: "he", u: "her", i: 3)
    })
  )
```
