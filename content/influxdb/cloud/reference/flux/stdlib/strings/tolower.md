---
title: strings.toLower() function
description: The strings.toLower() function converts a string to lowercase.
aliases:
  - /influxdb/cloud/reference/flux/functions/strings/tolower/
menu:
  influxdb_cloud_ref:
    name: strings.toLower
    parent: Strings
weight: 301
related:
  - /influxdb/cloud/reference/flux/stdlib/strings/totitle
  - /influxdb/cloud/reference/flux/stdlib/strings/toupper
  - /influxdb/cloud/reference/flux/stdlib/strings/title
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
