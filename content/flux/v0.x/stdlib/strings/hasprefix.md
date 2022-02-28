---
title: strings.hasPrefix() function
description: The strings.hasPrefix() function indicates if a string begins with a specific prefix.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/hasprefix/
  - /influxdb/v2.0/reference/flux/stdlib/strings/hasprefix/
  - /influxdb/cloud/reference/flux/stdlib/strings/hasprefix/
menu:
  flux_0_x_ref:
    name: strings.hasPrefix
    parent: strings
weight: 301
related:
  - /flux/v0.x/stdlib/strings/hassuffix
introduced: 0.18.0
---

The `strings.hasPrefix()` function indicates if a string begins with a specified prefix.

_**Output data type:** Boolean_

```js
import "strings"

strings.hasPrefix(v: "go gopher", prefix: "go")

// returns true
```

## Parameters

### v {data-type="string"}
The string value to search.

### prefix {data-type="string"}
The prefix to search for.

###### Filter based on the presence of a prefix in a column value
```js
import "strings"

data
    |> filter(fn:(r) => strings.hasPrefix(v: r.metric, prefix: "int_" ))
```
