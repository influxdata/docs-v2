---
title: strings.toUpper() function
description: The strings.toUpper() function converts a string to uppercase.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/toupper/
  - /influxdb/v2.0/reference/flux/stdlib/strings/toupper/
  - /influxdb/cloud/reference/flux/stdlib/strings/toupper/
menu:
  flux_0_x_ref:
    name: strings.toUpper
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/totitle
  - /flux/v0.x/stdlib/strings/tolower
  - /flux/v0.x/stdlib/strings/title
introduced: 0.18.0
---

The `strings.toUpper()` function converts a string to uppercase.

_**Output data type:** String_

```js
import "strings"

strings.toUpper(v: "koala")

// returns "KOALA"
```

## Parameters

### v {data-type="string"}
The string value to convert.

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
