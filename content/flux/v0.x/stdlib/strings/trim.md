---
title: strings.trim() function
description: >
  The strings.trim() function removes leading and trailing characters specified
  in the cutset from a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/trim/
  - /influxdb/v2.0/reference/flux/stdlib/strings/trim/
  - /influxdb/cloud/reference/flux/stdlib/strings/trim/
menu:
  flux_0_x_ref:
    name: strings.trim
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/trimleft
  - /influxdb/v2.0/reference/flux/stdlib/strings/trimright
  - /influxdb/v2.0/reference/flux/stdlib/strings/trimprefix
  - /influxdb/v2.0/reference/flux/stdlib/strings/trimsuffix
  - /influxdb/v2.0/reference/flux/stdlib/strings/trimspace
introduced: 0.18.0
---

The `strings.trim()` function removes leading and trailing characters specified
in the [`cutset`](#cutset) from a string.

_**Output data type:** String_

```js
import "strings"

strings.trim(v: ".abc.", cutset: ".")

// returns "abc"
```

## Parameters

### v
String to remove characters from.

_**Data type:** String_

### cutset
The leading and trailing characters to remove from the string.
Only characters that match the `cutset` string exactly are trimmed.

_**Data type:** String_

## Examples

###### Trim leading and trailing periods from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      variables: strings.trim(v: r.variables, cutset: ".")
    })
  )
```
