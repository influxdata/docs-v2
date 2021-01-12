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
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/totitle
  - /influxdb/v2.0/reference/flux/stdlib/strings/toupper
  - /influxdb/v2.0/reference/flux/stdlib/strings/title
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

### v
The string value to convert.

_**Data type:** String_

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
