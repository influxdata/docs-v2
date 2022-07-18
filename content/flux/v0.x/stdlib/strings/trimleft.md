---
title: strings.trimLeft() function
description: >
  `strings.trimLeft()` removes specified leading characters from a string.
menu:
  flux_0_x_ref:
    name: strings.trimLeft
    parent: strings
    identifier: strings/trimLeft
weight: 101
aliases:
  - /influxdb/v2.0/reference/flux/functions/strings/trimleft/
  - /influxdb/v2.0/reference/flux/stdlib/strings/trimleft/
  - /influxdb/cloud/reference/flux/stdlib/strings/trimleft/
related:
  - /flux/v0.x/stdlib/strings/trim/
  - /flux/v0.x/stdlib/strings/trimright/
  - /flux/v0.x/stdlib/strings/trimprefix/
  - /flux/v0.x/stdlib/strings/trimsuffix/
  - /flux/v0.x/stdlib/strings/trimspace/
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L210-L210

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.trimLeft()` removes specified leading characters from a string.



##### Function type signature

```js
(cutset: string, v: string) => string
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
String to to remove characters from.



### cutset
({{< req >}})
Leading characters to trim from the string.




## Examples

### Trim leading periods from all values in a column

```js
import "strings"

data
    |> map(fn: (r) => ({r with _value: strings.trimLeft(v: r._value, cutset: ".")}))

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value         | *tag |
| -------------------- | -------------- | ---- |
| 2021-01-01T00:00:00Z | ...smpl_g9qczs | t1   |
| 2021-01-01T00:00:10Z | ...smpl_0mgv9n | t1   |
| 2021-01-01T00:00:20Z | ...smpl_phw664 | t1   |
| 2021-01-01T00:00:30Z | ...smpl_guvzy4 | t1   |
| 2021-01-01T00:00:40Z | ...smpl_5v3cce | t1   |
| 2021-01-01T00:00:50Z | ...smpl_s9fmgy | t1   |

| _time                | _value         | *tag |
| -------------------- | -------------- | ---- |
| 2021-01-01T00:00:00Z | ...smpl_b5eida | t2   |
| 2021-01-01T00:00:10Z | ...smpl_eu4oxp | t2   |
| 2021-01-01T00:00:20Z | ...smpl_5g7tz4 | t2   |
| 2021-01-01T00:00:30Z | ...smpl_sox1ut | t2   |
| 2021-01-01T00:00:40Z | ...smpl_wfm757 | t2   |
| 2021-01-01T00:00:50Z | ...smpl_dtn2bv | t2   |


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
