---
title: strings.toTitle() function
description: The strings.toTitle() function ...
menu:
  v2_0_ref:
    name: strings.toTitle
    parent: Strings
weight: 301
---

The `strings.toTitle()` function ...

_**Output data type:** String_

```js
import "strings"

strings.toTitle(v: "a flux of foxes")

// returns "A Flux Of Foxes"
```

## Parameters

### v
The string value to convert.

_**Data type:** String_

## Examples

###### ...
```js
import "strings"

data
  |> map(fn:(r) => strings.toTitle(v: r.pageTitle))
```
