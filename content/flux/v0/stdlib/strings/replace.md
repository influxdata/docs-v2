---
title: strings.replace() function
description: >
  `strings.replace()` replaces the first `i` non-overlapping instances of a substring with
  a specified replacement.
menu:
  flux_v0_ref:
    name: strings.replace
    parent: strings
    identifier: strings/replace
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L651-L651

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.replace()` replaces the first `i` non-overlapping instances of a substring with
a specified replacement.



##### Function type signature

```js
(i: int, t: string, u: string, v: string) => string
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
String value to search.



### t
({{< req >}})
Substring value to replace.



### u
({{< req >}})
Replacement for `i` instances of `t`.



### i
({{< req >}})
Number of non-overlapping `t` matches to replace.




## Examples

### Replace a specific number of string matches

```js
import "sampledata"
import "strings"

sampledata.string()
    |> map(fn: (r) => ({r with _value: strings.replace(v: r._value, t: "p", u: "XX", i: 2)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value      |
| -------------------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | t1   | smpl_g9qczs |
| 2021-01-01T00:00:10Z | t1   | smpl_0mgv9n |
| 2021-01-01T00:00:20Z | t1   | smpl_phw664 |
| 2021-01-01T00:00:30Z | t1   | smpl_guvzy4 |
| 2021-01-01T00:00:40Z | t1   | smpl_5v3cce |
| 2021-01-01T00:00:50Z | t1   | smpl_s9fmgy |

| _time                | *tag | _value      |
| -------------------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | t2   | smpl_b5eida |
| 2021-01-01T00:00:10Z | t2   | smpl_eu4oxp |
| 2021-01-01T00:00:20Z | t2   | smpl_5g7tz4 |
| 2021-01-01T00:00:30Z | t2   | smpl_sox1ut |
| 2021-01-01T00:00:40Z | t2   | smpl_wfm757 |
| 2021-01-01T00:00:50Z | t2   | smpl_dtn2bv |


#### Output data

| _time                | _value        | *tag |
| -------------------- | ------------- | ---- |
| 2021-01-01T00:00:00Z | smXXl_g9qczs  | t1   |
| 2021-01-01T00:00:10Z | smXXl_0mgv9n  | t1   |
| 2021-01-01T00:00:20Z | smXXl_XXhw664 | t1   |
| 2021-01-01T00:00:30Z | smXXl_guvzy4  | t1   |
| 2021-01-01T00:00:40Z | smXXl_5v3cce  | t1   |
| 2021-01-01T00:00:50Z | smXXl_s9fmgy  | t1   |

| _time                | _value        | *tag |
| -------------------- | ------------- | ---- |
| 2021-01-01T00:00:00Z | smXXl_b5eida  | t2   |
| 2021-01-01T00:00:10Z | smXXl_eu4oxXX | t2   |
| 2021-01-01T00:00:20Z | smXXl_5g7tz4  | t2   |
| 2021-01-01T00:00:30Z | smXXl_sox1ut  | t2   |
| 2021-01-01T00:00:40Z | smXXl_wfm757  | t2   |
| 2021-01-01T00:00:50Z | smXXl_dtn2bv  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
