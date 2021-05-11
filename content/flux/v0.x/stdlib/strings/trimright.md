---
title: strings.trimRight() function
description: >
  The strings.trimRight() function removes trailing characters specified in the cutset from a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/trimright/
  - /influxdb/v2.0/reference/flux/stdlib/strings/trimright/
  - /influxdb/cloud/reference/flux/stdlib/strings/trimright/
menu:
  flux_0_x_ref:
    name: strings.trimRight
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/trim
  - /flux/v0.x/stdlib/strings/trimleft
  - /flux/v0.x/stdlib/strings/trimprefix
  - /flux/v0.x/stdlib/strings/trimsuffix
  - /flux/v0.x/stdlib/strings/trimspace
introduced: 0.18.0
---

The `strings.trimRight()` function removes trailing characters specified in the
[`cutset`](#cutset) from a string.

_**Output data type:** String_

```js
import "strings"

strings.trimRight(v: ".abc.", cutset: ".")

// returns ".abc"
```

## Parameters

### v {data-type="string"}
String to remove characters from.

### cutset {data-type="string"}
The trailing characters to trim from the string.
Only characters that match the `cutset` string exactly are trimmed.

## Examples

###### Trim trailing periods from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      variables: strings.trimRight(v: r.variables, cutset: ".")
    })
  )
```
