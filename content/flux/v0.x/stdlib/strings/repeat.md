---
title: strings.repeat() function
description: The strings.repeat() function returns a string consisting of `i` copies of a specified string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/repeat/
  - /influxdb/v2.0/reference/flux/stdlib/strings/repeat/
  - /influxdb/cloud/reference/flux/stdlib/strings/repeat/
menu:
  flux_0_x_ref:
    name: strings.repeat
    parent: strings
weight: 301
introduced: 0.18.0
---

The `strings.repeat()` function returns a string consisting of `i` copies of a specified string.

_**Output data type:** String_

```js
import "strings"

strings.repeat(v: "ha", i: 3)

// returns "hahaha"
```

## Parameters

### v {data-type="string"}
The string value to repeat.

### i {data-type="int"}
The number of times to repeat `v`.

## Examples

###### Repeat a string based on existing columns
```js
import "strings"

data
  |> map(fn: (r) => ({
      laugh: r.laugh
      intensity: r.intensity
      laughter: strings.repeat(v: r.laugh, i: r.intensity)
    })
  )
```
