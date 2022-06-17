---
title: strings.compare() function
description: The strings.compare() function compares the lexicographical order of two strings.
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/compare/
  - /influxdb/v2.0/reference/flux/stdlib/strings/compare/
  - /influxdb/cloud/reference/flux/stdlib/strings/compare/
menu:
  flux_0_x_ref:
    name: strings.compare
    parent: strings
weight: 301
introduced: 0.18.0
---

The `strings.compare()` function compares the lexicographical order of two strings.

_**Output data type:** Integer_

```js
import "strings"

strings.compare(v: "a", t: "b")

// returns -1
```

#### Return values
| Comparison | Return value |
|:----------:|:------------:|
| `v < t`    | `-1`         |
| `v == t`   | `0`          |
| `v > t`    | `1`          |

## Parameters

### v {data-type="string"}
The string value to compare.

### t {data-type="string"}
The string value to compare against.

## Examples

###### Compare the lexicographical order of column values
```js
import "strings"

data
    |> map(fn: (r) => ({r with _value: strings.compare(v: r.tag1, t: r.tag2)}))
```
