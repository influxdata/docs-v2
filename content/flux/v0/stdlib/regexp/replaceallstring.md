---
title: regexp.replaceAllString() function
description: >
  `regexp.replaceAllString()` replaces all reguar expression matches in a string with a
  specified replacement.
menu:
  flux_v0_ref:
    name: regexp.replaceAllString
    parent: regexp
    identifier: regexp/replaceAllString
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/regexp/regexp.flux#L148-L148

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`regexp.replaceAllString()` replaces all reguar expression matches in a string with a
specified replacement.



##### Function type signature

```js
(r: regexp, t: string, v: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### r
({{< req >}})
Regular expression used to search `v`.



### v
({{< req >}})
String value to search.



### t
({{< req >}})
Replacement for matches to `r`.




## Examples

- [Replace regular expression matches in a string](#replace-regular-expression-matches-in-a-string)
- [Replace regular expression matches in string column values](#replace-regular-expression-matches-in-string-column-values)

### Replace regular expression matches in a string

```js
import "regexp"

regexp.replaceAllString(r: /a(x*)b/, v: "-ab-axxb-", t: "T")// Returns "-T-T-"


```


### Replace regular expression matches in string column values

```js
import "regexp"
import "sampledata"

sampledata.string()
    |> map(fn: (r) => ({r with _value: regexp.replaceAllString(r: /smpl_/, v: r._value, t: "")}))

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
