---
title: strings.splitN() function
description: >
  The strings.splitN() function splits a string on a specified separator and returns
  an array of `i` substrings.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/splitn/
  - /influxdb/v2.0/reference/flux/stdlib/strings/splitn/
  - /influxdb/cloud/reference/flux/stdlib/strings/splitn/
menu:
  flux_0_x_ref:
    name: strings.splitN
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/split
  - /flux/v0.x/stdlib/strings/splitafter
  - /flux/v0.x/stdlib/strings/splitaftern
introduced: 0.18.0
---

The `strings.splitN()` function splits a string on a specified separator and returns
an array of `i` substrings.

_**Output data type:** Array of strings_

```js
import "strings"

strings.splitN(v: "a flux of foxes", t: " ", i: 3)

// returns ["a", "flux", "of foxes"]
```

## Parameters

### v {data-type="string"}
The string value to split.

### t {data-type="string"}
The string value that acts as the separator.

### i {data-type="int"}
The maximum number of split substrings to return.
`-1` returns all matching substrings.
The last substring is the unsplit remainder.

## Examples

###### Split a string into an array of substrings
```js
import "strings"

data
  |> map (fn:(r) => strings.splitN(v: r.searchTags, t: ","))
```
