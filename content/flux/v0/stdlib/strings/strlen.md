---
title: strings.strlen() function
description: >
  `strings.strlen()` returns the length of a string. String length is determined by the number of UTF code points a string contains.
menu:
  flux_v0_ref:
    name: strings.strlen
    parent: strings
    identifier: strings/strlen
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L811-L811

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.strlen()` returns the length of a string. String length is determined by the number of UTF code points a string contains.



##### Function type signature

```js
(v: string) => int
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
String value to measure.




## Examples

- [Filter based on string value length](#filter-based-on-string-value-length)
- [Store the length of string values](#store-the-length-of-string-values)

### Filter based on string value length

```js
import "strings"

data
    |> filter(fn: (r) => strings.strlen(v: r._value) <= 6)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value   | *tag |
| -------------------- | -------- | ---- |
| 2021-01-01T00:00:00Z | pl_gqcz  | t1   |
| 2021-01-01T00:00:10Z | pl_gvn   | t1   |
| 2021-01-01T00:00:20Z | pl_phw   | t1   |
| 2021-01-01T00:00:30Z | pl_guvzy | t1   |
| 2021-01-01T00:00:40Z | pl_vcce  | t1   |
| 2021-01-01T00:00:50Z | pl_fgy   | t1   |

| _time                | _value   | *tag |
| -------------------- | -------- | ---- |
| 2021-01-01T00:00:00Z | pl_beida | t2   |
| 2021-01-01T00:00:10Z | pl_euoxp | t2   |
| 2021-01-01T00:00:20Z | pl_gtz   | t2   |
| 2021-01-01T00:00:30Z | pl_oxut  | t2   |
| 2021-01-01T00:00:40Z | pl_wf    | t2   |
| 2021-01-01T00:00:50Z | pl_dtnbv | t2   |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z | pl_gvn  | t1   |
| 2021-01-01T00:00:20Z | pl_phw  | t1   |
| 2021-01-01T00:00:50Z | pl_fgy  | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | pl_gtz  | t2   |
| 2021-01-01T00:00:40Z | pl_wf   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Store the length of string values

```js
import "strings"

data
    |> map(fn: (r) => ({r with length: strings.strlen(v: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value   | *tag |
| -------------------- | -------- | ---- |
| 2021-01-01T00:00:00Z | pl_gqcz  | t1   |
| 2021-01-01T00:00:10Z | pl_gvn   | t1   |
| 2021-01-01T00:00:20Z | pl_phw   | t1   |
| 2021-01-01T00:00:30Z | pl_guvzy | t1   |
| 2021-01-01T00:00:40Z | pl_vcce  | t1   |
| 2021-01-01T00:00:50Z | pl_fgy   | t1   |

| _time                | _value   | *tag |
| -------------------- | -------- | ---- |
| 2021-01-01T00:00:00Z | pl_beida | t2   |
| 2021-01-01T00:00:10Z | pl_euoxp | t2   |
| 2021-01-01T00:00:20Z | pl_gtz   | t2   |
| 2021-01-01T00:00:30Z | pl_oxut  | t2   |
| 2021-01-01T00:00:40Z | pl_wf    | t2   |
| 2021-01-01T00:00:50Z | pl_dtnbv | t2   |


#### Output data

| _time                | _value   | length  | *tag |
| -------------------- | -------- | ------- | ---- |
| 2021-01-01T00:00:00Z | pl_gqcz  | 7       | t1   |
| 2021-01-01T00:00:10Z | pl_gvn   | 6       | t1   |
| 2021-01-01T00:00:20Z | pl_phw   | 6       | t1   |
| 2021-01-01T00:00:30Z | pl_guvzy | 8       | t1   |
| 2021-01-01T00:00:40Z | pl_vcce  | 7       | t1   |
| 2021-01-01T00:00:50Z | pl_fgy   | 6       | t1   |

| _time                | _value   | length  | *tag |
| -------------------- | -------- | ------- | ---- |
| 2021-01-01T00:00:00Z | pl_beida | 8       | t2   |
| 2021-01-01T00:00:10Z | pl_euoxp | 8       | t2   |
| 2021-01-01T00:00:20Z | pl_gtz   | 6       | t2   |
| 2021-01-01T00:00:30Z | pl_oxut  | 7       | t2   |
| 2021-01-01T00:00:40Z | pl_wf    | 5       | t2   |
| 2021-01-01T00:00:50Z | pl_dtnbv | 8       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
