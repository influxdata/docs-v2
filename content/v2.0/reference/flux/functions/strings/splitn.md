---
title: strings.functionName() function
description: The strings.functionName() function ...
menu:
  v2_0_ref:
    name: strings.functionName
    parent: Strings
weight: 301
---

The `strings.functionName()` function ...

_**Output data type:** String_

```js
import "strings"

strings.functionName(v: "a flux of foxes")

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
  |> map(fn:(r) => strings.functionName(v: r.pageTitle))
```
