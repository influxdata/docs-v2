---
title: strings.toUpper() function
description: The strings.toUpper() function converts a string to uppercase.
aliases:
  - /influxdb/cloud/reference/flux/functions/strings/toupper/
menu:
  influxdb_cloud_ref:
    name: strings.toUpper
    parent: Strings
weight: 301
related:
  - /influxdb/cloud/reference/flux/stdlib/strings/totitle
  - /influxdb/cloud/reference/flux/stdlib/strings/tolower
  - /influxdb/cloud/reference/flux/stdlib/strings/title
---

The `strings.toUpper()` function converts a string to uppercase.

_**Output data type:** String_

```js
import "strings"

strings.toUpper(v: "koala")

// returns "KOALA"
```

## Parameters

### v
The string value to convert.

_**Data type:** String_

## Examples

###### Convert all values of a column to upper case
```js
import "strings"

data
  |> map(fn: (r) => ({ r with envVars: strings.toUpper(v: r.envVars) }))
```

{{% note %}}
#### The difference between toTitle and toUpper
The results of `toUpper()` and `toTitle` are often the same, however the difference
is visible when using special characters:

```js
str = "ǳ"

strings.toUpper(v: str) // Returns Ǳ
strings.toTitle(v: str) // Returns ǲ
```
{{% /note %}}
