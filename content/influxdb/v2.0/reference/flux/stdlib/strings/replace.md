---
title: strings.replace() function
description: >
  The strings.replace() function replaces the first `i` non-overlapping instances
  of a substring with a specified replacement.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/replace/
menu:
  influxdb_2_0_ref:
    name: strings.replace
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/replaceall
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

_**Data type:** String_

### t
The substring value to replace.

_**Data type:** String_

### u
The replacement for `i` instances of `t`.

_**Data type:** String_

### i
The number of non-overlapping `t` matches to replace.

_**Data type:** Integer_

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
