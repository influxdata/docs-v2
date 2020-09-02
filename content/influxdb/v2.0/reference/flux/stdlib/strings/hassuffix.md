---
title: strings.hasSuffix() function
description: The strings.hasSuffix() function indicates if a string ends with a specified suffix.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/hassuffix/
menu:
  influxdb_2_0_ref:
    name: strings.hasSuffix
    parent: Strings
weight: 301
related:
  - /influxdb/v2.0/reference/flux/stdlib/strings/hasprefix
---

The `strings.hasSuffix()` function indicates if a string ends with a specified suffix.

_**Output data type:** Boolean_

```js
import "strings"

strings.hasSuffix(v: "go gopher", suffix: "go")

// returns false
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### suffix
The suffix to search for.

_**Data type:** String_

###### Filter based on the presence of a suffix in a column value
```js
import "strings"

data
  |> filter(fn:(r) => strings.hasSuffix(v: r.metric, suffix: "_count" ))
```
