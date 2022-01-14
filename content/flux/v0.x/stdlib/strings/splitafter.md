---
title: strings.splitAfter() function
description: >
  The strings.splitAfter() function splits a string after a specified separator and returns
  an array of substrings.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/splitafter/
  - /influxdb/v2.0/reference/flux/stdlib/strings/splitafter/
  - /influxdb/cloud/reference/flux/stdlib/strings/splitafter/
menu:
  flux_0_x_ref:
    name: strings.splitAfter
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/split
  - /flux/v0.x/stdlib/strings/splitaftern
  - /flux/v0.x/stdlib/strings/splitn
introduced: 0.18.0
---

The `strings.splitAfter()` function splits a string after a specified separator and returns
an array of substrings.
Split substrings include the separator, `t`.

_**Output data type:** Array of strings_

```js
import "strings"

strings.splitAfter(v: "a flux of foxes", t: " ")

// returns ["a ", "flux ", "of ", "foxes"]
```

## Parameters

### v {data-type="string"}
The string value to split.

### t {data-type="string"}
The string value that acts as the separator.

## Examples

###### Split a string into an array of substrings
```js
import "strings"

data
  |> map (fn:(r) => strings.splitAfter(v: r.searchTags, t: ","))
```
