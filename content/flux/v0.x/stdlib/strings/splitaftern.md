---
title: strings.splitAfterN() function
description: >
  The strings.splitAfterN() function splits a string after a specified separator and returns
  an array of `i` substrings.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/splitaftern/
  - /influxdb/v2.0/reference/flux/stdlib/strings/splitaftern/
  - /influxdb/cloud/reference/flux/stdlib/strings/splitaftern/
menu:
  flux_0_x_ref:
    name: strings.splitAfterN
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/split
  - /flux/v0.x/stdlib/strings/splitafter
  - /flux/v0.x/stdlib/strings/splitn
introduced: 0.18.0
---

The `strings.splitAfterN()` function splits a string after a specified separator and returns
an array of `i` substrings.
Split substrings include the separator `t`.

_**Output data type:** Array of strings_

```js
import "strings"

strings.splitAfterN(v: "a flux of foxes", t: " ", i: 3)

// returns ["a ", "flux ", "of foxes"]
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
  |> map (fn:(r) => strings.splitAfterN(v: r.searchTags, t: ","))
```
