---
title: strings.split() function
description: >
  The strings.split() function splits a string on a specified separator and returns
  an array of substrings.
aliases:
  - /influxdb/cloud/reference/flux/functions/strings/split/
menu:
  influxdb_cloud_ref:
    name: strings.split
    parent: Strings
weight: 301
related:
  - /influxdb/cloud/reference/flux/stdlib/strings/splitafter
  - /influxdb/cloud/reference/flux/stdlib/strings/splitaftern
  - /influxdb/cloud/reference/flux/stdlib/strings/splitn
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
  |> map (fn:(r) => strings.split(v: r.searchTags, t: ","))
```
