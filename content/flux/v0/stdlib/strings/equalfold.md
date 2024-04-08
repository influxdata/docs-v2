---
title: strings.equalFold() function
description: >
  `strings.equalFold()` reports whether two UTF-8 strings are equal under Unicode case-folding.
menu:
  flux_v0_ref:
    name: strings.equalFold
    parent: strings
    identifier: strings/equalFold
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L350-L350

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.equalFold()` reports whether two UTF-8 strings are equal under Unicode case-folding.



##### Function type signature

```js
(t: string, v: string) => bool
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
String value to compare.



### t
({{< req >}})
String value to compare against.




## Examples

### Ignore case when comparing two strings

```js
import "strings"

data
    |> map(fn: (r) => ({r with same: strings.equalFold(v: r.string1, t: r.string2)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| time                 | string1    | string2    |
| -------------------- | ---------- | ---------- |
| 2022-01-01T00:00:00Z | RJqcVGNlcJ | rjQCvGNLCj |
| 2022-01-01T00:01:00Z | hBumdSljCQ | unfbcNAXUA |
| 2022-01-01T00:02:00Z | ITcHyLZuqu | KKtCcRHsKj |
| 2022-01-01T00:03:00Z | HyXdjvrjgp | hyxDJvrJGP |
| 2022-01-01T00:04:00Z | SVepvUBAVx | GuKKjuGsyI |


#### Output data

| same  | string1    | string2    | time                 |
| ----- | ---------- | ---------- | -------------------- |
| true  | RJqcVGNlcJ | rjQCvGNLCj | 2022-01-01T00:00:00Z |
| false | hBumdSljCQ | unfbcNAXUA | 2022-01-01T00:01:00Z |
| false | ITcHyLZuqu | KKtCcRHsKj | 2022-01-01T00:02:00Z |
| true  | HyXdjvrjgp | hyxDJvrJGP | 2022-01-01T00:03:00Z |
| false | SVepvUBAVx | GuKKjuGsyI | 2022-01-01T00:04:00Z |

{{% /expand %}}
{{< /expand-wrapper >}}
