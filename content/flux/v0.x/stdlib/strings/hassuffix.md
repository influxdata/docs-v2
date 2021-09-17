---
title: strings.hasSuffix() function
description: The strings.hasSuffix() function indicates if a string ends with a specified suffix.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/hassuffix/
  - /influxdb/v2.0/reference/flux/stdlib/strings/hassuffix/
  - /influxdb/cloud/reference/flux/stdlib/strings/hassuffix/
menu:
  flux_0_x_ref:
    name: strings.hasSuffix
    parent: strings
weight: 301
flux/v0.x/tags: [tests]
related:
  - /flux/v0.x/stdlib/strings/hasprefix
introduced: 0.18.0
---

The `strings.hasSuffix()` function indicates if a string ends with a specified suffix.

_**Output data type:** Boolean_

```js
import "strings"

strings.hasSuffix(v: "go gopher", suffix: "go")

// returns false
```

## Parameters

### v {data-type="string"}
The string value to search.

### suffix {data-type="string"}
The suffix to search for.

###### Filter based on the presence of a suffix in a column value
```js
import "strings"

data
  |> filter(fn:(r) => strings.hasSuffix(v: r.metric, suffix: "_count" ))
```
