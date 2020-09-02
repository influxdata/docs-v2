---
title: strings.countStr() function
description: >
  The strings.countStr() function counts the number of non-overlapping instances
  of a substring appears in a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/countstr/
menu:
  influxdb_2_0_ref:
    name: strings.countStr
    parent: Strings
weight: 301
---

The `strings.countStr()` function counts the number of non-overlapping instances
of a substring appears in a string.

_**Output data type:** Integer_

```js
import "strings"

strings.countStr(v: "Hello mellow fellow", substr: "ello")

// returns 3
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### substr
The substring to count.

_**Data type:** String_

{{% note %}}
The function counts only non-overlapping instances of `substr`.
For example:

```js
strings.coutnStr(v: "ooooo", substr: "oo")

// Returns 2 -- (oo)(oo)o
```
{{% /note %}}

## Examples

###### Count instances of a substring within a string
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      _value: strings.countStr(v: r.message, substr: "uh")
    })
  )
```
