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
  influxdb_2_0_ref:
    name: strings.splitAfter
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/split
  - /influxdb/v2.0/reference/flux/stdlib/strings/splitaftern
  - /influxdb/v2.0/reference/flux/stdlib/strings/splitn
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

### v
The string value to split.

_**Data type:** String_

### t
The string value that acts as the separator.

_**Data type:** String_

## Examples

###### Split a string into an array of substrings
```js
import "strings"

data
  |> map (fn:(r) => strings.splitAfter(v: r.searchTags, t: ","))
```
