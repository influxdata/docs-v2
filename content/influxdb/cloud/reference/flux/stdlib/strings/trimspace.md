---
title: strings.trimSpace() function
description: The strings.trimSpace() function removes leading and trailing spaces from a string.
aliases:
  - /influxdb/cloud/reference/flux/functions/strings/trimspace/
menu:
  influxdb_cloud_ref:
    name: strings.trimSpace
    parent: Strings
weight: 301
related:
  - /influxdb/cloud/reference/flux/stdlib/strings/trim
  - /influxdb/cloud/reference/flux/stdlib/strings/trimleft
  - /influxdb/cloud/reference/flux/stdlib/strings/trimright
  - /influxdb/cloud/reference/flux/stdlib/strings/trimprefix
  - /influxdb/cloud/reference/flux/stdlib/strings/trimsuffix
---

The `strings.trimSpace()` function removes leading and trailing spaces from a string.

_**Output data type:** String_

```js
import "strings"

strings.trimSpace(v: "  abc  ")

// returns "abc"
```

## Parameters

### v
String to remove spaces from.

_**Data type:** String_

## Examples

###### Trim leading and trailing spaces from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => ({ r with userInput: strings.trimSpace(v: r.userInput) }))
```
