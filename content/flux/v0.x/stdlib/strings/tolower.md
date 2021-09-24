---
title: strings.toLower() function
description: The strings.toLower() function converts a string to lowercase.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/tolower/
  - /influxdb/v2.0/reference/flux/stdlib/strings/tolower/
  - /influxdb/cloud/reference/flux/stdlib/strings/tolower/
menu:
  flux_0_x_ref:
    name: strings.toLower
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/totitle
  - /flux/v0.x/stdlib/strings/toupper
  - /flux/v0.x/stdlib/strings/title
introduced: 0.18.0
---

The `strings.toLower()` function converts a string to lowercase.

_**Output data type:** String_

```js
import "strings"

strings.toLower(v: "KOALA")

// returns "koala"
```

## Parameters

### v {data-type="string"}
The string value to convert.

## Examples

###### Convert all values of a column to lower case
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with exclamation: strings.toLower(v: r.exclamation)
    })
  )
```
