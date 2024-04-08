---
title: strings.substring() function
description: >
  `strings.substring()` returns a substring based on start and end parameters. These parameters are represent indices of UTF code points in the string.
menu:
  flux_v0_ref:
    name: strings.substring
    parent: strings
    identifier: strings/substring
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L834-L834

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.substring()` returns a substring based on start and end parameters. These parameters are represent indices of UTF code points in the string.



When start or end are past the bounds of the string, respectively the start or end of the string
is assumed. When end is less than or equal to start an empty string is returned.

##### Function type signature

```js
(end: int, start: int, v: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
String value to search for.



### start
({{< req >}})
Starting inclusive index of the substring.



### end
({{< req >}})
Ending exclusive index of the substring.




## Examples

### Return part of a string based on character index

```js
import "sampledata"
import "strings"

sampledata.string()
    |> map(fn: (r) => ({r with _value: strings.substring(v: r._value, start: 5, end: 9)}))

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
| 2021-01-01T00:00:00Z | g9qc    | t1   |
| 2021-01-01T00:00:10Z | 0mgv    | t1   |
| 2021-01-01T00:00:20Z | phw6    | t1   |
| 2021-01-01T00:00:30Z | guvz    | t1   |
| 2021-01-01T00:00:40Z | 5v3c    | t1   |
| 2021-01-01T00:00:50Z | s9fm    | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | b5ei    | t2   |
| 2021-01-01T00:00:10Z | eu4o    | t2   |
| 2021-01-01T00:00:20Z | 5g7t    | t2   |
| 2021-01-01T00:00:30Z | sox1    | t2   |
| 2021-01-01T00:00:40Z | wfm7    | t2   |
| 2021-01-01T00:00:50Z | dtn2    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
