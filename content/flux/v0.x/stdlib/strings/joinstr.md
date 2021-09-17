---
title: strings.joinStr() function
description: >
  The strings.joinStr() function concatenates the elements of a string array into
  a single string using a specified separator.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/joinstr/
  - /influxdb/v2.0/reference/flux/stdlib/strings/joinstr/
  - /influxdb/cloud/reference/flux/stdlib/strings/joinstr/
menu:
  flux_0_x_ref:
    name: strings.joinStr
    parent: strings
weight: 301
introduced: 0.18.0
---

The `strings.joinStr()` function concatenates elements of a string array into
a single string using a specified separator.

_**Output data type:** String_

```js
import "strings"

strings.joinStr(arr: ["a", "b", "c"], v: ",")

// returns "a,b,c"
```

## Parameters

### arr {data-type="array of strings"}
The array of strings to concatenate.

### v {data-type="string"}
The separator to use in the concatenated value.

## Examples

###### Join a list of strings into a single string
```js
import "strings"

searchTags = ["tag1", "tag2", "tag3"]

strings.joinStr(arr: searchTags, v: ","))
```
