---
title: strings.hasPrefix() function
description: The strings.hasPrefix() function indicates if a string begins with a specific prefix.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/hasprefix/
menu:
  influxdb_2_0_ref:
    name: strings.hasPrefix
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/hassuffix
---

The `strings.hasPrefix()` function indicates if a string begins with a specified prefix.

_**Output data type:** Boolean_

```js
import "strings"

strings.hasPrefix(v: "go gopher", prefix: "go")

// returns true
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### prefix
The prefix to search for.

_**Data type:** String_

###### Filter based on the presence of a prefix in a column value
```js
import "strings"

data
  |> filter(fn:(r) => strings.hasPrefix(v: r.metric, prefix: "int_" ))
```
