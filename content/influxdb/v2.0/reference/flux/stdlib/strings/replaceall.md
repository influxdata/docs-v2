---
title: strings.replaceAll() function
description: >
  The strings.replaceAll() function replaces all non-overlapping instances of a
  substring with a specified replacement.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/replaceall/
menu:
  influxdb_2_0_ref:
    name: strings.replaceAll
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/replace
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

### v
The string value to search.

_**Data type:** String_

### t
The substring to replace.

_**Data type:** String_

### u
The replacement for all instances of `t`.

_**Data type:** String_

## Examples

###### Replace string matches
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      content: strings.replaceAll(v: r.content, t: "he", u: "her")
    })
  )
```
