---
title: strings.split() function
description: The strings.split() function ...
menu:
  v2_0_ref:
    name: strings.split
    parent: Strings
weight: 301
---

The `strings.split()` function ...

_**Output data type:** String_

```js
import "strings"

strings.split(v: "a flux of foxes")

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
  |> map(fn:(r) => strings.split(v: r.pageTitle))
```
