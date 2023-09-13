---
title: strings.trimSuffix() function
description: >
  `strings.trimSuffix()` removes a suffix from a string.
menu:
  flux_v0_ref:
    name: strings.trimSuffix
    parent: strings
    identifier: strings/trimSuffix
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L164-L164

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.trimSuffix()` removes a suffix from a string.

Strings that do not end with the suffix are returned unchanged.

##### Function type signature

```js
(suffix: string, v: string) => string
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
String to trim.



### suffix
({{< req >}})
Suffix to remove.




## Examples

### Remove a suffix from all values in a column

```js
import "strings"

data
    |> map(fn: (r) => ({r with _value: strings.trimSuffix(v: r._value, suffix: "_ex1")}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value          | *tag |
| -------------------- | --------------- | ---- |
| 2021-01-01T00:00:00Z | smpl_g9qczs_ex1 | t1   |
| 2021-01-01T00:00:10Z | smpl_0mgv9n_ex1 | t1   |
| 2021-01-01T00:00:20Z | smpl_phw664_ex1 | t1   |
| 2021-01-01T00:00:30Z | smpl_guvzy4_ex1 | t1   |
| 2021-01-01T00:00:40Z | smpl_5v3cce_ex1 | t1   |
| 2021-01-01T00:00:50Z | smpl_s9fmgy_ex1 | t1   |

| _time                | _value          | *tag |
| -------------------- | --------------- | ---- |
| 2021-01-01T00:00:00Z | smpl_b5eida_ex1 | t2   |
| 2021-01-01T00:00:10Z | smpl_eu4oxp_ex1 | t2   |
| 2021-01-01T00:00:20Z | smpl_5g7tz4_ex1 | t2   |
| 2021-01-01T00:00:30Z | smpl_sox1ut_ex1 | t2   |
| 2021-01-01T00:00:40Z | smpl_wfm757_ex1 | t2   |
| 2021-01-01T00:00:50Z | smpl_dtn2bv_ex1 | t2   |


#### Output data

| _time                | _value      | *tag |
| -------------------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | smpl_g9qczs | t1   |
| 2021-01-01T00:00:10Z | smpl_0mgv9n | t1   |
| 2021-01-01T00:00:20Z | smpl_phw664 | t1   |
| 2021-01-01T00:00:30Z | smpl_guvzy4 | t1   |
| 2021-01-01T00:00:40Z | smpl_5v3cce | t1   |
| 2021-01-01T00:00:50Z | smpl_s9fmgy | t1   |

| _time                | _value      | *tag |
| -------------------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | smpl_b5eida | t2   |
| 2021-01-01T00:00:10Z | smpl_eu4oxp | t2   |
| 2021-01-01T00:00:20Z | smpl_5g7tz4 | t2   |
| 2021-01-01T00:00:30Z | smpl_sox1ut | t2   |
| 2021-01-01T00:00:40Z | smpl_wfm757 | t2   |
| 2021-01-01T00:00:50Z | smpl_dtn2bv | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
