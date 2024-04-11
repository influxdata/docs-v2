---
title: strings.trimPrefix() function
description: >
  `strings.trimPrefix()` removes a prefix from a string. Strings that do not start with the prefix are returned unchanged.
menu:
  flux_v0_ref:
    name: strings.trimPrefix
    parent: strings
    identifier: strings/trimPrefix
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L119-L119

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.trimPrefix()` removes a prefix from a string. Strings that do not start with the prefix are returned unchanged.



##### Function type signature

```js
(prefix: string, v: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
String to trim.



### prefix
({{< req >}})
Prefix to remove.




## Examples

### Trim a prefix from all values in a column

```js
import "sampledata"
import "strings"

sampledata.string()
    |> map(fn: (r) => ({r with _value: strings.trimPrefix(v: r._value, prefix: "smpl_")}))

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

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | g9qczs  | t1   |
| 2021-01-01T00:00:10Z | 0mgv9n  | t1   |
| 2021-01-01T00:00:20Z | phw664  | t1   |
| 2021-01-01T00:00:30Z | guvzy4  | t1   |
| 2021-01-01T00:00:40Z | 5v3cce  | t1   |
| 2021-01-01T00:00:50Z | s9fmgy  | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | b5eida  | t2   |
| 2021-01-01T00:00:10Z | eu4oxp  | t2   |
| 2021-01-01T00:00:20Z | 5g7tz4  | t2   |
| 2021-01-01T00:00:30Z | sox1ut  | t2   |
| 2021-01-01T00:00:40Z | wfm757  | t2   |
| 2021-01-01T00:00:50Z | dtn2bv  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
