---
title: sampledata.numericBool() function
description: >
  `sampledata.numericBool()` returns a sample data set with numeric (integer) boolean values.
menu:
  flux_v0_ref:
    name: sampledata.numericBool
    parent: sampledata
    identifier: sampledata/numericBool
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/sampledata/sampledata.flux#L280-L284

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sampledata.numericBool()` returns a sample data set with numeric (integer) boolean values.



##### Function type signature

```js
(?includeNull: bool) => stream[{A with _value: B, _value: int}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### includeNull

Include null values in the returned dataset.
Default is `false`.




## Examples

### Output basic sample data with numeric boolean values

```js
import "sampledata"

sampledata.numericBool()

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 1       | t1   |
| 2021-01-01T00:00:10Z | 1       | t1   |
| 2021-01-01T00:00:20Z | 0       | t1   |
| 2021-01-01T00:00:30Z | 1       | t1   |
| 2021-01-01T00:00:40Z | 0       | t1   |
| 2021-01-01T00:00:50Z | 0       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 0       | t2   |
| 2021-01-01T00:00:10Z | 1       | t2   |
| 2021-01-01T00:00:20Z | 0       | t2   |
| 2021-01-01T00:00:30Z | 1       | t2   |
| 2021-01-01T00:00:40Z | 1       | t2   |
| 2021-01-01T00:00:50Z | 0       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
