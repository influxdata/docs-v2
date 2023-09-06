---
title: strings.compare() function
description: >
  `strings.compare()` compares the lexicographical order of two strings.
menu:
  flux_v0_ref:
    name: strings.compare
    parent: strings
    identifier: strings/compare
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L387-L387

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.compare()` compares the lexicographical order of two strings.

#### Return values
| Comparison | Return value |
| :--------- | -----------: |
| v < t      |           -1 |
| v == t     |            0 |
| v > t      |            1 |

##### Function type signature

```js
(t: string, v: string) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
String value to compare.



### t
({{< req >}})
String value to compare against.




## Examples

### Compare the lexicographical order of column values

```js
import "strings"

data
    |> map(fn: (r) => ({r with same: strings.compare(v: r.string1, t: r.string2)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| time                 | string1    | string2    |
| -------------------- | ---------- | ---------- |
| 2022-01-01T00:00:00Z | RJqcVGNlcJ | rjQCvGNLCj |
| 2022-01-01T00:01:00Z | unfbcNAXUA | hBumdSljCQ |
| 2022-01-01T00:02:00Z | ITcHyLZuqu | ITcHyLZuqu |
| 2022-01-01T00:03:00Z | HyXdjvrjgp | hyxDJvrJGP |
| 2022-01-01T00:04:00Z | SVepvUBAVx | GuKKjuGsyI |


#### Output data

| same  | string1    | string2    | time                 |
| ----- | ---------- | ---------- | -------------------- |
| -1    | RJqcVGNlcJ | rjQCvGNLCj | 2022-01-01T00:00:00Z |
| 1     | unfbcNAXUA | hBumdSljCQ | 2022-01-01T00:01:00Z |
| 0     | ITcHyLZuqu | ITcHyLZuqu | 2022-01-01T00:02:00Z |
| -1    | HyXdjvrjgp | hyxDJvrJGP | 2022-01-01T00:03:00Z |
| 1     | SVepvUBAVx | GuKKjuGsyI | 2022-01-01T00:04:00Z |

{{% /expand %}}
{{< /expand-wrapper >}}
