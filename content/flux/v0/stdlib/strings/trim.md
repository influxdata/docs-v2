---
title: strings.trim() function
description: >
  `strings.trim()` removes leading and trailing characters specified in the cutset from a string.
menu:
  flux_v0_ref:
    name: strings.trim
    parent: strings
    identifier: strings/trim
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L99-L99

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.trim()` removes leading and trailing characters specified in the cutset from a string.



##### Function type signature

```js
(cutset: string, v: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
String to remove characters from.



### cutset
({{< req >}})
Leading and trailing characters to remove from the string.

Only characters that match the cutset string exactly are trimmed.


## Examples

### Trim leading and trailing periods from all values in a column

```js
import "strings"

data
    |> map(fn: (r) => ({r with _value: strings.trim(v: r._value, cutset: "smpl_")}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value        | *tag |
| -------------------- | ------------- | ---- |
| 2021-01-01T00:00:00Z | .smpl_g9qczs. | t1   |
| 2021-01-01T00:00:10Z | .smpl_0mgv9n. | t1   |
| 2021-01-01T00:00:20Z | .smpl_phw664. | t1   |
| 2021-01-01T00:00:30Z | .smpl_guvzy4. | t1   |
| 2021-01-01T00:00:40Z | .smpl_5v3cce. | t1   |
| 2021-01-01T00:00:50Z | .smpl_s9fmgy. | t1   |

| _time                | _value        | *tag |
| -------------------- | ------------- | ---- |
| 2021-01-01T00:00:00Z | .smpl_b5eida. | t2   |
| 2021-01-01T00:00:10Z | .smpl_eu4oxp. | t2   |
| 2021-01-01T00:00:20Z | .smpl_5g7tz4. | t2   |
| 2021-01-01T00:00:30Z | .smpl_sox1ut. | t2   |
| 2021-01-01T00:00:40Z | .smpl_wfm757. | t2   |
| 2021-01-01T00:00:50Z | .smpl_dtn2bv. | t2   |


#### Output data

| _time                | _value        | *tag |
| -------------------- | ------------- | ---- |
| 2021-01-01T00:00:00Z | .smpl_g9qczs. | t1   |
| 2021-01-01T00:00:10Z | .smpl_0mgv9n. | t1   |
| 2021-01-01T00:00:20Z | .smpl_phw664. | t1   |
| 2021-01-01T00:00:30Z | .smpl_guvzy4. | t1   |
| 2021-01-01T00:00:40Z | .smpl_5v3cce. | t1   |
| 2021-01-01T00:00:50Z | .smpl_s9fmgy. | t1   |

| _time                | _value        | *tag |
| -------------------- | ------------- | ---- |
| 2021-01-01T00:00:00Z | .smpl_b5eida. | t2   |
| 2021-01-01T00:00:10Z | .smpl_eu4oxp. | t2   |
| 2021-01-01T00:00:20Z | .smpl_5g7tz4. | t2   |
| 2021-01-01T00:00:30Z | .smpl_sox1ut. | t2   |
| 2021-01-01T00:00:40Z | .smpl_wfm757. | t2   |
| 2021-01-01T00:00:50Z | .smpl_dtn2bv. | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
