---
title: strings.substring() function
description: >
  The strings.substring() function returns a substring based on `start` and `end` parameters.
  Indices are based on UTF code points.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/substring/
  - /influxdb/v2.0/reference/flux/stdlib/strings/substring/
  - /influxdb/cloud/reference/flux/stdlib/strings/substring/
menu:
  flux_0_x_ref:
    name: strings.substring
    parent: Strings
weight: 301
introduced: 0.35.0
---

The `strings.substring()` function returns a substring based on `start` and `end` parameters.
These parameters are represent indices of UTF code points in the string.

_**Output data type:** String_

```js
import "strings"

strings.substring(v: "influx", start: 0, end: 4)

// returns "infl"
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### start
The starting inclusive index of the substring.

_**Data type:** Integer_

### end
The ending exclusive index of the substring.

_**Data type:** Integer_

## Examples

###### Store the first four characters of a string
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      abbr: strings.substring(v: r.name, start: 0, end: 4)
    })
  )
```
