---
title: strings.trimRight() function
description: >
  The strings.trimRight() function removes trailing characters specified in the cutset from a string.
aliases:
  - /influxdb/cloud/reference/flux/functions/strings/trimright/
menu:
  influxdb_cloud_ref:
    name: strings.trimRight
    parent: Strings
weight: 301
related:
  - /influxdb/cloud/reference/flux/stdlib/strings/trim
  - /influxdb/cloud/reference/flux/stdlib/strings/trimleft
  - /influxdb/cloud/reference/flux/stdlib/strings/trimprefix
  - /influxdb/cloud/reference/flux/stdlib/strings/trimsuffix
  - /influxdb/cloud/reference/flux/stdlib/strings/trimspace
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

### v
String to remove characters from.

_**Data type:** String_

### cutset
The trailing characters to trim from the string.
Only characters that match the `cutset` string exactly are trimmed.

_**Data type:** String_

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
