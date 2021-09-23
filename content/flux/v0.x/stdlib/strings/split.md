---
title: strings.split() function
description: >
  The strings.split() function splits a string on a specified separator and returns
  an array of substrings.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/split/
  - /influxdb/v2.0/reference/flux/stdlib/strings/split/
  - /influxdb/cloud/reference/flux/stdlib/strings/split/
menu:
  flux_0_x_ref:
    name: strings.split
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/splitafter
  - /flux/v0.x/stdlib/strings/splitaftern
  - /flux/v0.x/stdlib/strings/splitn
introduced: 0.18.0
---

The `strings.split()` function splits a string on a specified separator and returns
an array of substrings.

_**Output data type:** Array of strings_

```js
import "strings"

strings.split(v: "a flux of foxes", t: " ")

// returns ["a", "flux", "of", "foxes"]
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
  |> map (fn:(r) => strings.split(v: r.searchTags, t: ","))
```
