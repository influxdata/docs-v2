---
title: strings.title() function
description: The strings.title() function converts a string to title case.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/title/
  - /influxdb/v2.0/reference/flux/stdlib/strings/title/
  - /influxdb/cloud/reference/flux/stdlib/strings/title/
menu:
  flux_0_x_ref:
    name: strings.title
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/tolower
  - /flux/v0.x/stdlib/strings/totitle
  - /flux/v0.x/stdlib/strings/toupper
introduced: 0.18.0
---

The `strings.title()` function converts a string to title case.

_**Output data type:** String_

```js
import "strings"

strings.title(v: "a flux of foxes")

// returns "A Flux Of Foxes"
```

## Parameters

### v {data-type="string"}
The string value to convert.

## Examples

###### Convert all values of a column to title case
```js
import "strings"

data
  |> map(fn: (r) => ({ r with pageTitle: strings.title(v: r.pageTitle) }))
```
