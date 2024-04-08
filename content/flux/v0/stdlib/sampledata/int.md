---
title: sampledata.int() function
description: >
  `sampledata.int()` returns a sample data set with integer values.
menu:
  flux_v0_ref:
    name: sampledata.int
    parent: sampledata
    identifier: sampledata/int
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/sampledata/sampledata.flux#L192-L196

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sampledata.int()` returns a sample data set with integer values.



##### Function type signature

```js
(?includeNull: bool) => stream[{A with _value: B, _value: int}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### includeNull

Include null values in the returned dataset.
Default is `false`.




## Examples

### Output basic sample data with integer values

```js
import "sampledata"

sampledata.int()

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
