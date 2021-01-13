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
  - /influxdb/v2.0/reference/flux/stdlib/strings/tolower
  - /influxdb/v2.0/reference/flux/stdlib/strings/totitle
  - /influxdb/v2.0/reference/flux/stdlib/strings/toupper
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

### v
The string value to convert.

_**Data type:** String_

## Examples

###### Convert all values of a column to title case
```js
import "strings"

data
  |> map(fn: (r) => ({ r with pageTitle: strings.title(v: r.pageTitle) }))
```
