---
title: strings.title() function
description: The strings.title() function converts a string to title case.
aliases:
  - /v2.0/reference/flux/functions/strings/title/
  - /v2.0/reference/flux/stdlib/strings/title
menu:
  influxdb_2_0_ref:
    name: strings.title
    parent: Strings
weight: 301
related:
  - /v2.0/reference/flux/stdlib/strings/tolower
  - /v2.0/reference/flux/stdlib/strings/totitle
  - /v2.0/reference/flux/stdlib/strings/toupper
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
