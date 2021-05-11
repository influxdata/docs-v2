---
title: strings.strlen() function
description: >
  The strings.strlen() function returns the length of a string.
  String length is determined by the number of UTF code points a string contains.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/strlen/
  - /influxdb/v2.0/reference/flux/stdlib/strings/strlen/
  - /influxdb/cloud/reference/flux/stdlib/strings/strlen/
menu:
  flux_0_x_ref:
    name: strings.strlen
    parent: strings
weight: 301
introduced: 0.35.0
---

The `strings.strlen()` function returns the length of a string.
String length is determined by the number of UTF code points a string contains.

_**Output data type:** Integer_

```js
import "strings"

strings.strlen(v: "apple")

// returns 5
```

## Parameters

### v {data-type="string"}
The string value to measure.

## Examples

###### Filter based on string value length
```js
import "strings"

data
  |> filter(fn: (r) => strings.strlen(v: r._measurement) <= 4)
```

###### Store the length of string values
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      length: strings.strlen(v: r._value)
    })
  )
```
